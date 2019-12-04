import Vector3 from 'engine/math/Vector3';
import Sector from 'engine/Sector';
import { vector2DLength, vector2DDot } from 'engine/math/Math';
import CONFIG from 'Config';

export class Wall {
  private _sector: Sector;

  public x1: number;
  public y1: number;
  public z1: number;
  public x2: number;
  public y2: number;
  public z2: number;
  public normal: Vector3;

  constructor(sector: Sector, x1: number, y1: number, z1: number, x2: number, y2: number, z2: number) {
    this._sector = sector;
    this.x1 = x1;
    this.y1 = y1;
    this.z1 = z1;
    this.x2 = x2;
    this.y2 = y2;
    this.z2 = z2;

    this._calculateNormals();
  }

  private _calculateNormals() {
    const dx = this.x2 - this.x1;
    const dz = this.z2 - this.z1;

    this.normal = new Vector3(-dz, 0, dx).normalize();
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

    const topY = this._sector.getMaxTopY(x, z, r);

    if (box[1] >= Math.max(this.y1, topY - CONFIG.MAX_SLOPE) || box[4] < Math.min(this.y1, this.y2)) {
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
}

class SolidWalls {
  private _walls: Array<Wall>;

  constructor() {
    this._walls = [];
  }

  public addWall(sector: Sector, vertex1: Array<number>, vertex2: Array<number>, y: number, height: number) {
    this._walls.push(new Wall(sector, vertex1[0], y, vertex1[1], vertex2[0], y + height, vertex2[1]));

    return this;
  }

  public addSector(sector: Sector): SolidWalls {
    const len = sector.vertices.length;
    let n = sector.vertices.root;

    for (let i = 0; i < len; i++) {
      const n2 = n.next ? n.next : sector.vertices.root;

      this.addWall(sector, n.value, n2.value, sector.y, sector.height);

      n = n.next;
    }

    return this;
  }

  public getCollidingWalls(box: Array<number>, x: number, z: number, r: number): Array<Wall> {
    const walls: Array<Wall> = [];

    this._walls.forEach((wall: Wall) => {
      if (wall.collidesWithBox(box, x, z, r)) {
        walls.push(wall);
      }
    });

    return walls;
  }
}

export default new SolidWalls();
