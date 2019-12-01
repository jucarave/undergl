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

  public getMaxYAt(x: number, y: number, z: number): number {
    let maxY = 0;

    this._sectors.forEach((sector: Sector) => {
      let topY = 0;
      if (sector.isPointInSector(x, z)) {
        topY = sector.getTopY(x, z);
      } else {
        topY = sector.getCircleInSectorY(x, z);
        if (topY === null) {
          return;
        }
      }

      if (topY - CONFIG.MAX_SLOPE <= y) {
        maxY = Math.max(topY, maxY);
      }
    });

    return maxY;
  }
}

export default new SolidGround();
