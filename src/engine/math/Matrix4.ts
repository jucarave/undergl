const MATRIX_LENGTH = 16;

class Matrix4 {
  public data: Array<number>;

  constructor(...values: Array<number>) {
    if (values.length !== MATRIX_LENGTH) {
      throw new Error(`Matrix4 needs ${MATRIX_LENGTH} values`);
    }

    this.data = new Array(MATRIX_LENGTH);

    this.set(...values);
  }

  public set(...values: Array<number>): Matrix4 {
    for (let i = 0; i < MATRIX_LENGTH; i++) {
      this.data[i] = values[i];
    }

    return this;
  }

  public translate(x: number, y: number, z: number, relative: boolean = false): Matrix4 {
    if (relative) {
      this.data[12] += x;
      this.data[13] += y;
      this.data[14] += z;
    } else {
      this.data[12] = x;
      this.data[13] = y;
      this.data[14] = z;
    }

    return this;
  }

  public static createIdentity(): Matrix4 {
    return new Matrix4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
  }

  public static createPerspective(fov: number, ratio: number, znear: number, zfar: number): Matrix4 {
    const S = 1 / Math.tan(fov / 2),
      R = S * ratio,
      A = -zfar / (zfar - znear),
      B = -(zfar * znear) / (zfar - znear);

    return new Matrix4(S, 0, 0, 0, 0, R, 0, 0, 0, 0, A, -1, 0, 0, B, 0);
  }
}

export default Matrix4;
