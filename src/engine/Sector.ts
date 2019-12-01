import DoubleList from './system/DoubleList';
import Vector3 from './math/Vector3';

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
  invisible?: boolean;
  uvs?: Array<number>;
  normal?: Vector3;
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

    options.invisible = options.invisible !== undefined ? options.invisible : false;
    options.uvs = options.uvs !== undefined ? options.uvs : [0, 0, 1, 1];

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

  public insideBoundingBox(x: number, y: number): boolean {
    const bb = this._boundingBox;

    return !(x < bb[0] || x > bb[2] || y < bb[1] || y > bb[3]);
  }

  public getHeightFraction(x: number, y: number): number {
    if (!this.insideBoundingBox(x, y)) {
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

  public getTopY(x: number, y: number): number {
    if (this._options.topSlope === 0.0) {
      return this._y + this._height;
    }

    return this._y + this._height + this._options.topSlope * this.getHeightFraction(x, y);
  }

  public getMaxTopY(x: number, y: number, r: number): number {
    return Math.max(
      this.getTopY(x - r, y - r),
      this.getTopY(x + r, y - r),
      this.getTopY(x - r, y + r),
      this.getTopY(x + r, y + r)
    );
  }

  public getBottomY(x: number, y: number): number {
    if (this._options.bottomSlope === 0.0) {
      return this._y;
    }

    return this._y + this._options.bottomSlope * this.getHeightFraction(x, y);
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

  public get options(): SectorOptions {
    return this._options;
  }
}

export default Sector;
