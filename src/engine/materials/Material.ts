import Camera from 'engine/Camera';
import Geometry from 'engine/Geometry';
import Renderer from 'engine/Renderer';
import Entity from 'engine/Entity';

abstract class Material {
  protected _renderer: Renderer;

  constructor() {
    this._renderer = Renderer.instance;
  }

  public abstract render(camera: Camera, entity: Entity, geometry: Geometry): void;
}

export default Material;
