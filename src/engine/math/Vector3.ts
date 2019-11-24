import Signal from 'engine/system/Signal';

class Vector3 {
  private _x: number;
  private _y: number;
  private _z: number;

  public readonly onChange: Signal;

  constructor(x: number, y: number, z: number) {
    this.onChange = new Signal();

    this.set(x, y, z);
  }

  public set(x: number, y: number, z: number): Vector3 {
    this._x = x;
    this._y = y;
    this._z = z;

    this.onChange.dispatch();

    return this;
  }

  public get x(): number {
    return this._x;
  }

  public set x(x: number) {
    this._x = x;

    this.onChange.dispatch();
  }

  public get y(): number {
    return this._y;
  }

  public set y(y: number) {
    this._y = y;

    this.onChange.dispatch();
  }

  public get z(): number {
    return this._z;
  }

  public set z(z: number) {
    this._z = z;

    this.onChange.dispatch();
  }

  public static get zero(): Vector3 {
    return new Vector3(0, 0, 0);
  }
}

export default Vector3;
