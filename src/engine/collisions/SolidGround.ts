import Sector from 'engine/Sector';
import CONFIG from 'Config';

class SolidGround {
  private _sectors: Array<Sector>;

  constructor() {
    this._sectors = [];
  }

  public addSector(sector: Sector): SolidGround {
    this._sectors.push(sector);
    return this;
  }

  public getMaxYAt(x: number, y: number, z: number, r: number): number {
    let maxY = 0;

    this._sectors.forEach((sector: Sector) => {
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

  public getMinYAt(x: number, y: number, z: number, r: number, height: number): number {
    let minY = Infinity;

    this._sectors.forEach((sector: Sector) => {
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
