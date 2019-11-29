import DoubleList from './system/DoubleList';

interface SectorOptions {
  inverted?: boolean;
  floorUVs?: Array<number>;
  ceilingUVs?: Array<number>;
}

interface VerticeOptions {
  invisible?: boolean;
  uvs?: Array<number>;
}

class Sector {
  private _vertices: DoubleList;
  private _options: SectorOptions;
  private _y: number;
  private _height: number;

  constructor(y: number, height: number, options?: SectorOptions) {
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

  public get options(): SectorOptions {
    return this._options;
  }
}

export default Sector;
