import DoubleList from './system/DoubleList';

interface SectorOptions {
  inverted?: boolean;
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

    if (this._options.inverted === undefined) {
      this._options.inverted = false;
    }
  }

  public addVertice(x: number, y: number): Sector {
    this._vertices.addNode([x, y]);

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
