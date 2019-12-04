import DoubleList from './system/DoubleList';
import Vector3 from './math/Vector3';
import { vector2DDot, vector2DLength } from './math/Math';

export enum SlopeDirection {
  NORTH,
  EAST,
  SOUTH,
  WEST
}

interface SectorOptions {
  inverted?: boolean;
  floorUVs?: Array<number>;
  ceilingUVs?: Array<number>;
  topSlope?: number;
  bottomSlope?: number;
  slopeDir?: SlopeDirection;
}

interface VerticeOptions {
  uvs?: Array<number>;
  normal?: Vector3;
  solid?: boolean;
}

class Sector {
  private _boundingBox: Array<number>;
  private _vertices: DoubleList;
  private _options: SectorOptions;
  private _y: number;
  private _height: number;

  constructor(y: number, height: number, options?: SectorOptions) {
    this._boundingBox = [Infinity, Infinity, -Infinity, -Infinity];
    this._vertices = new DoubleList();
    this._options = options;
    this._y = y;
    this._height = height;

    this._mergeOptions();
  }

  private _mergeOptions(): void {
    if (!this._options) {
      this._options = {};
    }

    this._options.inverted = this._options.inverted !== undefined ? this._options.inverted : false;
    this._options.floorUVs = this._options.floorUVs !== undefined ? this._options.floorUVs : [0, 0, 1, 1];
    this._options.ceilingUVs = this._options.ceilingUVs !== undefined ? this._options.ceilingUVs : [0, 0, 1, 1];
    this._options.topSlope = this._options.topSlope !== undefined ? this._options.topSlope : 0;
    this._options.bottomSlope = this._options.bottomSlope !== undefined ? this._options.bottomSlope : 0;
    this._options.slopeDir = this._options.slopeDir !== undefined ? this._options.slopeDir : SlopeDirection.NORTH;
  }

  private _mergeVerticesOptions(options?: VerticeOptions): VerticeOptions {
    if (!options) {
      options = {};
    }

    options.uvs = options.uvs !== undefined ? options.uvs : [0, 0, 1, 1];
    options.solid = options.solid !== undefined ? options.solid : true;

    return options;
  }

  public addVertice(x: number, y: number, options?: VerticeOptions): Sector {
    options = this._mergeVerticesOptions(options);

    this._vertices.addNode([x, y, options]);

    this._boundingBox[0] = Math.min(x, this._boundingBox[0]);
    this._boundingBox[1] = Math.min(y, this._boundingBox[1]);
    this._boundingBox[2] = Math.max(x, this._boundingBox[2]);
    this._boundingBox[3] = Math.max(y, this._boundingBox[3]);

    return this;
  }

  public isPointInsideBoundingBox(x: number, y: number): boolean {
    const bb = this._boundingBox;

    return !(x < bb[0] || x > bb[2] || y < bb[1] || y > bb[3]);
  }

  private _isPointRightToLine(px: number, py: number, x1: number, y1: number, x2: number, y2: number): boolean {
    if (py < Math.min(y1, y2) || py >= Math.max(y1, y2) || px < Math.min(x1, x2)) {
      return false;
    }

    if (px >= Math.max(x1, x2)) {
      return true;
    }

    const dx = x2 - x1;
    const dy = Math.abs(y2 - y1);
    const f = Math.abs(py - y1) / dy;
    const dpx = x1 + dx * f;

    return px > dpx;
  }

  private _getCircleCollidingWithLinePoint(px: number, py: number, r: number, x1: number, y1: number, x2: number, y2: number): Array<number> {
    if (py + r < Math.min(y1, y2) || py - r >= Math.max(y1, y2) || px + r < Math.min(x1, x2) || px - r >= Math.max(x1, x2)) {
      return null;
    }

    const dx = x2 - x1;
    const dy = y2 - y1;
    const vpx = px - x1;
    const vpy = py - y1;

    const l = vector2DDot(dx, dy, dx, dy);
    const f = vector2DDot(dx, dy, vpx, vpy) / l;

    const wpx = x1 + dx * f;
    const wpy = y1 + dy * f;

    if (vector2DLength(wpx, wpy, px, py) <= r) {
      return [wpx, wpy];
    }
  }

  public isPointInSector(x: number, y: number): boolean {
    if (!this.isPointInsideBoundingBox(x, y)) {
      return false;
    }

    const length = this._vertices.length;

    let count = 0;
    let n = this._vertices.root;

    // Point in polygon routine
    for (let i = 0; i < length; i++) {
      const n2 = n.next ? n.next : this._vertices.root;

      if (this._isPointRightToLine(x, y, n.value[0], n.value[1], n2.value[0], n2.value[1])) {
        count += 1;
      }

      n = n.next;
    }

    return count % 2 == 1;
  }

  public getCircleInSectorY(x: number, y: number, r: number, top: boolean = true): number {
    // Circle vs walls routine
    const length = this._vertices.length;

    let n = this._vertices.root;
    let ret: number = null;

    for (let i = 0; i < length; i++) {
      const n2 = n.next ? n.next : this._vertices.root;
      const col = this._getCircleCollidingWithLinePoint(x, y, r, n.value[0], n.value[1], n2.value[0], n2.value[1]);

      if (col != null) {
        if (top) {
          const yTop = this.getTopY(col[0], col[1]);

          if (ret === null || yTop > ret) {
            ret = yTop;
          }
        } else {
          const yBottom = this.getBottomY(col[0], col[1]);

          if (ret === null || yBottom < ret) {
            ret = yBottom;
          }
        }
      }

      n = n.next;
    }

    return ret;
  }

  public getHeightFraction(x: number, y: number): number {
    if (!this.isPointInsideBoundingBox(x, y)) {
      return 0.0;
    }

    let f = 0.0;
    switch (this._options.slopeDir) {
      case SlopeDirection.NORTH:
        f = (this._boundingBox[3] - y) / (this._boundingBox[3] - this._boundingBox[1]);
        break;

      case SlopeDirection.EAST:
        f = (x - this._boundingBox[0]) / (this._boundingBox[2] - this._boundingBox[0]);
        break;

      case SlopeDirection.SOUTH:
        f = (y - this._boundingBox[1]) / (this._boundingBox[3] - this._boundingBox[1]);
        break;

      case SlopeDirection.WEST:
        f = (this._boundingBox[2] - x) / (this._boundingBox[2] - this._boundingBox[0]);
        break;
    }

    return f;
  }

  public getSolidTop(x: number, y: number): number {
    if (this._options.topSlope === 0.0) {
      return this.yTop;
    }

    return this.yTop + this._options.topSlope * this.getHeightFraction(x, y);
  }

  public getSolidBottom(x: number, y: number): number {
    if (this._options.topSlope === 0.0) {
      return this.yBottom;
    }

    return this.yBottom + this._options.topSlope * this.getHeightFraction(x, y);
  }

  public getTopY(x: number, y: number): number {
    if (this._options.topSlope === 0.0) {
      return this._y + this._height;
    }

    return this._y + this._height + this._options.topSlope * this.getHeightFraction(x, y);
  }

  public getMaxTopY(x: number, y: number, r: number): number {
    return Math.max(this.getTopY(x - r, y - r), this.getTopY(x + r, y - r), this.getTopY(x - r, y + r), this.getTopY(x + r, y + r));
  }

  public getBottomY(x: number, y: number): number {
    if (this._options.bottomSlope === 0.0) {
      return this._y;
    }

    return this._y + this._options.bottomSlope * this.getHeightFraction(x, y);
  }

  public translate(x: number, z: number): Sector {
    this._vertices.forEach((vertice: Array<number>) => {
      vertice[0] += x;
      vertice[1] += z;

      this._boundingBox[0] = Math.min(vertice[0], this._boundingBox[0]);
      this._boundingBox[1] = Math.min(vertice[1], this._boundingBox[1]);
      this._boundingBox[2] = Math.max(vertice[0], this._boundingBox[2]);
      this._boundingBox[3] = Math.max(vertice[1], this._boundingBox[3]);
    });

    return this;
  }

  public get vertices(): DoubleList {
    return this._vertices.clone();
  }

  public get y(): number {
    return this._y;
  }

  public get height(): number {
    return this._height;
  }

  public get yBottom(): number {
    return this._y + (this.options.inverted ? this._height : 0);
  }

  public get yTop(): number {
    return this._y + (this.options.inverted ? 0 : this._height);
  }

  public get options(): SectorOptions {
    return this._options;
  }
}

export default Sector;
