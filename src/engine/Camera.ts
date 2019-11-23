import Matrix4 from 'engine/math/Matrix4';

class Camera {
  private _projection: Matrix4;
  private _transform: Matrix4;

  constructor(projection: Matrix4) {
    this._projection = projection;
    this._transform = Matrix4.createIdentity();
  }

  public static createPerspective(fov: number, ratio: number, znear: number, zfar: number): Camera {
    return new Camera(Matrix4.createPerspective(fov, ratio, znear, zfar));
  }

  public get projection(): Matrix4 {
    return this._projection;
  }

  public get transform(): Matrix4 {
    return this._transform;
  }
}

export default Camera;
