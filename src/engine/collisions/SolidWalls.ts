import Vector3 from 'engine/math/Vector3';
import Sector from 'engine/Sector';
import { vector2DLength, vector2DDot } from 'engine/math/Math';
import CONFIG from 'Config';
import { createUUID, isElementInArray } from 'engine/system/Utils';
import { SIZE_OF_WORLD } from 'engine/system/Constants';

const SIZE_OF_GRID = 5;
const SIZE_PER_GRID = SIZE_OF_WORLD / SIZE_OF_GRID;

const usedSectors = new Array(4);
const usedWalls = new Array(20);
const solidWalls = new Array(20);

export class Wall {
  private _sector: Sector;
  private _dx: number;
  private _dy: number;
  private _dh: number;
  private _dz: number;

  public readonly id: string;

  public x1: number;
  public y1: number;
  public h1: number;
  public z1: number;
  public x2: number;
  public y2: number;
  public h2: number;
  public z2: number;
  public normal: Vector3;

  constructor(sector: Sector, x1: number, y1: number, h1: number, z1: number, x2: number, y2: number, h2: number, z2: number) {
    this.id = createUUID();

    this._sector = sector;
    this.x1 = x1;
    this.y1 = Math.min(y1, h1);
    this.h1 = Math.max(y1, h1) - this.y1;
    this.z1 = z1;
    this.x2 = x2;
    this.y2 = Math.min(y2, h2);
    this.h2 = Math.max(y2, h2) - this.y2;
    this.z2 = z2;

    this._calculateNormals();
  }

  private _calculateNormals() {
    this._dx = this.x2 - this.x1;
    this._dy = this.y2 - this.y1;
    this._dh = this.h2 + this.y2 - (this.h1 + this.y1);
    this._dz = this.z2 - this.z1;

    this.normal = new Vector3(-this._dz, 0, this._dx).normalize();
  }

  public getPointInLineFraction(x: number, z: number): number {
    const px = x - this.x1;
    const pz = z - this.z1;

    const l = vector2DDot(this._dx, this._dz, this._dx, this._dz);
    const dot = vector2DDot(this._dx, this._dz, px, pz) / l;

    return dot;
  }

  public getTop(x: number, z: number): number {
    return this.y1 + this.h1 + this._dh * this.getPointInLineFraction(x, z);
  }

  public getBottom(x: number, z: number): number {
    return this.y1 + this._dy * this.getPointInLineFraction(x, z);
  }

  public getMaxTop(x: number, z: number, r: number): number {
    return Math.max(this.getTop(x - r, z - r), this.getTop(x + r, z - r), this.getTop(x - r, z + r), this.getTop(x + r, z + r));
  }

  public getMaxBottom(x: number, z: number, r: number): number {
    return Math.max(this.getBottom(x - r, z - r), this.getBottom(x + r, z - r), this.getBottom(x - r, z + r), this.getBottom(x + r, z + r));
  }

  public collidesWithBox(box: Array<number>, x: number, z: number, r: number): boolean {
    if (
      box[0] > Math.max(this.x1, this.x2) ||
      box[3] < Math.min(this.x1, this.x2) ||
      box[2] > Math.max(this.z1, this.z2) ||
      box[5] < Math.min(this.z1, this.z2)
    ) {
      return false;
    }

    const y1 = this.getMaxBottom(x, z, r);
    const y2 = this.getMaxTop(x, z, r);

    if (box[1] >= y2 - CONFIG.MAX_SLOPE || box[4] < y1) {
      return false;
    }

    return true;
  }

  public isFacingMovement(xTo: number, zTo: number): boolean {
    return this.normal.x * xTo + this.normal.z * zTo < 0;
  }

  public isPointInWall(x: number, y: number): boolean {
    return !((x < this.x1 && x < this.x2) || (x > this.x1 && x > this.x2) || (y < this.z1 && y < this.z2) || (y > this.z1 && y > this.z2));
  }

  public getLinesIntersectionPoint(line: Array<number>): Array<number> {
    const l1x1 = line[0];
    const l1y1 = line[1];
    const l1x2 = line[2];
    const l1y2 = line[3];

    const l2x1 = this.x1;
    const l2y1 = this.z1;
    const l2x2 = this.x2;
    const l2y2 = this.z2;

    const a1 = l1y2 - l1y1;
    const b1 = l1x1 - l1x2;
    const c1 = a1 * l1x1 + b1 * l1y1;

    const a2 = l2y2 - l2y1;
    const b2 = l2x1 - l2x2;
    const c2 = a2 * l2x1 + b2 * l2y1;

    const determinant = a1 * b2 - a2 * b1;

    if (determinant == 0.0) {
      return null;
    }

    const x = (b2 * c1 - b1 * c2) / determinant;
    const y = (a1 * c2 - a2 * c1) / determinant;

    return [parseFloat(x.toFixed(4)), parseFloat(y.toFixed(4))];
  }

  public getDistanceToVertex(vx: number, vy: number, rdX: number, rdY: number, px: number, py: number, r: number) {
    const vecToCircleX = px - vx;
    const vecToCircleY = py - vy;
    const vecToCircleLength = vector2DLength(0, 0, vecToCircleX, vecToCircleY);

    const vtcDotrd = vector2DDot(vecToCircleX, vecToCircleY, rdX, rdY);

    const d = r * r - (vecToCircleLength * vecToCircleLength - vtcDotrd * vtcDotrd);

    if (d < 0.0) {
      return null;
    }

    return vtcDotrd - Math.sqrt(d);
  }

  public get sector(): Sector {
    return this._sector;
  }
}

class SolidWalls {
  private _walls: Array<Wall>;
  private _gridWalls: Array<Array<Array<Wall>>>;
  private _bboxCorners = [0, 2, 3, 2, 0, 5, 3, 5];

  constructor() {
    this._walls = [];

    const sizeOfGrids = SIZE_PER_GRID;
    this._gridWalls = [];
    for (let i = 0; i < sizeOfGrids; i++) {
      this._gridWalls[i] = [];
      for (let j = 0; j < sizeOfGrids; j++) {
        this._gridWalls[i][j] = [];
      }
    }
  }

  public addWall(sector: Sector, x1: number, y1: number, h1: number, z1: number, x2: number, y2: number, h2: number, z2: number): SolidWalls {
    const wall = new Wall(sector, x1, y1, h1, z1, x2, y2, h2, z2);
    this._walls.push(wall);

    const dx = x2 - x1;
    const dy = z2 - z1;
    let f = 0.0;

    while (f < 1.0) {
      const wx = Math.floor((x1 + dx * f) / SIZE_OF_GRID);
      const wy = Math.floor((z1 + dy * f) / SIZE_OF_GRID);

      if (this._gridWalls[wy][wx].indexOf(wall) === -1) {
        this._gridWalls[wy][wx].push(wall);
      }

      f += 0.1;
    }

    return this;
  }

  public addSector(sector: Sector): SolidWalls {
    const len = sector.vertices.length;
    let n = sector.vertices.root;

    for (let i = 0; i < len; i++) {
      if (!n.value[2].solid) {
        n = n.next;
        continue;
      }

      const n2 = n.next ? n.next : sector.vertices.root;
      n2;

      if (sector.options.inverted) {
        //this.addWall(sector, n2.value, n.value, sector.y, sector.height);
      } else {
        //this.addWall(sector, n.value, n2.value, sector.y, sector.height);
      }

      n = n.next;
    }

    return this;
  }

  private _getWallsOnGrid(x: number, y: number): Array<Wall> {
    if (x < 0 || y < 0 || x >= SIZE_PER_GRID || y >= SIZE_PER_GRID) {
      return [];
    }

    return this._gridWalls[y][x];
  }

  public getCollidingWalls(box: Array<number>, x: number, z: number, r: number): Array<Wall> {
    const walls: Array<Wall> = solidWalls;
    let wallsCount = 0;
    walls.fill(null);

    const us: Array<string> = usedSectors;
    let usCount = 0;

    const uw: Array<Wall> = usedWalls;
    let uwCount = 0;

    for (let i = 0; i < 8; i += 2) {
      const sx = Math.floor(box[this._bboxCorners[i]] / SIZE_OF_GRID);
      const sz = Math.floor(box[this._bboxCorners[i + 1]] / SIZE_OF_GRID);
      const sector = sx + '_' + sz;
      if (isElementInArray(us, sector, usCount)) {
        continue;
      }

      us[usCount++] = sector;

      const w = this._getWallsOnGrid(sx, sz);

      w.forEach((wall: Wall) => {
        if (isElementInArray(uw, wall, uwCount)) {
          return;
        }

        uw[uwCount++] = wall;
        if (wall.collidesWithBox(box, x, z, r)) {
          walls[wallsCount++] = wall;
        }
      });
    }

    return walls;
  }
}

export default new SolidWalls();
