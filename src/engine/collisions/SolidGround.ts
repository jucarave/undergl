import Sector from 'engine/Sector';
import CONFIG from 'Config';
import { SIZE_OF_WORLD } from 'engine/system/Constants';
import { isElementInArray } from 'engine/system/Utils';

const SIZE_OF_GRID = 10;
const SIZE_PER_GRID = SIZE_OF_WORLD / SIZE_OF_GRID;

const sectors: Array<Sector> = new Array(4);
const usedWalls: Array<string> = new Array(20);

class SolidGround {
  private _sectors: Array<Sector>;
  private _sectorsGrid: Array<Array<Array<Sector>>>;
  private _bboxCorners = [0, 2, 3, 2, 0, 5, 3, 5];

  constructor() {
    this._sectors = [];

    const sizeOfGrids = SIZE_PER_GRID;

    this._sectorsGrid = [];
    for (let i = 0; i < sizeOfGrids; i++) {
      this._sectorsGrid[i] = [];
      for (let j = 0; j < sizeOfGrids; j++) {
        this._sectorsGrid[i][j] = [];
      }
    }
  }

  public addSector(sector: Sector): SolidGround {
    this._sectors.push(sector);

    const bb = sector.boundingBox;
    for (let x = Math.floor(bb[0] / SIZE_OF_GRID); x <= Math.floor(bb[2] / SIZE_OF_GRID); x++) {
      for (let y = Math.floor(bb[1] / SIZE_OF_GRID); y <= Math.floor(bb[3] / SIZE_OF_GRID); y++) {
        this._sectorsGrid[y][x].push(sector);
      }
    }

    return this;
  }

  private _getSectorsInGrid(x: number, y: number): Array<Sector> {
    if (x < 0 || y < 0 || x >= SIZE_PER_GRID || y >= SIZE_PER_GRID) {
      return [];
    }

    return this._sectorsGrid[y][x];
  }

  private _getCollidingSectors(box: Array<number>): Array<Sector> {
    let usCount = 0;

    let ugCount = 0;

    for (let i = 0; i < 8; i += 2) {
      const sx = Math.floor(box[this._bboxCorners[i]] / SIZE_OF_GRID);
      const sz = Math.floor(box[this._bboxCorners[i + 1]] / SIZE_OF_GRID);
      const sectorInd = sx + '_' + sz;
      if (isElementInArray(usedWalls, sectorInd, ugCount)) {
        continue;
      }

      usedWalls[ugCount++] = sectorInd;

      this._getSectorsInGrid(sx, sz).forEach((sector: Sector) => {
        if (isElementInArray(sectors, sector, usCount)) {
          return;
        }

        sectors[usCount++] = sector;
      });
    }

    return sectors;
  }

  public getMaxYAt(box: Array<number>, x: number, y: number, z: number, r: number): number {
    let maxY = 0;

    this._getCollidingSectors(box).forEach((sector: Sector) => {
      let topY = 0;
      if (sector.isPointInSector(x, z)) {
        topY = sector.getSolidTop(x, z);
      } else {
        topY = sector.getCircleInSectorY(x, z, r);
        if (topY === null) {
          return;
        }
      }

      if (topY - CONFIG.MAX_SLOPE - 0.1 <= y) {
        maxY = Math.max(topY, maxY);
      }
    });

    return maxY;
  }

  public getMinYAt(box: Array<number>, x: number, y: number, z: number, r: number, height: number): number {
    let minY = Infinity;

    this._getCollidingSectors(box).forEach((sector: Sector) => {
      let bottomY = 0;
      if (sector.isPointInSector(x, z)) {
        bottomY = sector.getSolidBottom(x, z);
      } else {
        bottomY = sector.getCircleInSectorY(x, z, r, false);
        if (bottomY === null) {
          return;
        }
      }

      if (bottomY >= y + height) {
        minY = Math.min(bottomY, minY);
      }
    });

    return minY;
  }
}

export default new SolidGround();
