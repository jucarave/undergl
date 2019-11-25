import Geometry from './Geometry';
import Material from './materials/Material';
import Vector3 from './math/Vector3';
import Camera from './Camera';
import Matrix4 from './math/Matrix4';
import Component from './Component';

class Entity {
  private _components: Array<Component>;
  private _geometry: Geometry;
  private _material: Material;
  private _transform: Matrix4;
  private _worldMatrix: Matrix4;
  private _updateTransformMatrix: boolean;
  private _started: boolean;

  public position: Vector3;
  public rotation: Vector3;

  constructor(position: Vector3, geometry?: Geometry, material?: Material) {
    this._components = [];
    this._geometry = geometry;
    this._material = material;
    this._updateTransformMatrix = true;
    this._started = false;
    this._transform = Matrix4.createIdentity();
    this._worldMatrix = Matrix4.createIdentity();

    this.position = position;
    this.position.onChange.add(() => (this._updateTransformMatrix = true));

    this.rotation = Vector3.zero;
    this.rotation.onChange.add(() => (this._updateTransformMatrix = true));
  }

  public addComponent(component: Component): void {
    this._components.push(component);

    if (this._started) {
      component.init();
    }
  }

  public init(): void {
    const len = this._components.length;
    for (let i = 0; i < len; i++) {
      this._components[i].init();
    }

    this._started = true;
  }

  public update(): void {
    const len = this._components.length;
    for (let i = 0; i < len; i++) {
      this._components[i].update();
    }
  }

  public render(camera: Camera): void {
    if (this._material && this._geometry) {
      this._worldMatrix.copy(this.transform).multiply(camera.viewMatrix);
      this._material.render(camera, this, this._geometry);
    }
  }

  public get transform(): Matrix4 {
    if (!this._updateTransformMatrix) {
      return this._transform;
    }

    const h = Matrix4.helper;

    this._transform
      .setRotationZ(this.rotation.z)
      .multiply(h.setRotationY(this.rotation.y))
      .multiply(h.setRotationX(this.rotation.x))
      .translate(this.position.x, this.position.y, this.position.z);

    this._updateTransformMatrix = false;

    return this._transform;
  }

  public get worldMatrix(): Matrix4 {
    return this._worldMatrix;
  }

  public get material(): Material {
    return this._material;
  }
}

export default Entity;
