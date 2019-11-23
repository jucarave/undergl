import Matrix4 from 'engine/math/Matrix4';
import Vector3 from './math/Vector3';

class Camera {
  private _projection: Matrix4;
  private _viewMatrix: Matrix4;
  private _updateViewMatrix: boolean;

  public readonly position: Vector3;
  public readonly rotation: Vector3;

  constructor(projection: Matrix4) {
    this._projection = projection;
    this._viewMatrix = Matrix4.createIdentity();

    this._updateViewMatrix = true;

    this.position = new Vector3(0, 0, 0);
    this.position.onChange.add(() => (this._updateViewMatrix = true));

    this.rotation = new Vector3(0, 0, 0);
    this.rotation.onChange.add(() => (this._updateViewMatrix = true));
  }

  public static createPerspective(fov: number, ratio: number, znear: number, zfar: number): Camera {
    return new Camera(Matrix4.createPerspective(fov, ratio, znear, zfar));
  }

  public get projection(): Matrix4 {
    return this._projection;
  }

  public get viewMatrix(): Matrix4 {
    if (!this._updateViewMatrix) {
      return this._viewMatrix;
    }

    const h = Matrix4.helper;
    this._viewMatrix
      .setIdentity()
      .translate(-this.position.x, -this.position.y, -this.position.z)
      .multiply(h.setRotationY(this.rotation.y))
      .multiply(h.setRotationX(-this.rotation.x));

    this._updateViewMatrix = false;

    return this._viewMatrix;
  }
}

export default Camera;
