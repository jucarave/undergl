import Camera from 'engine/Camera';
import Geometry from 'engine/Geometry';
import Renderer from 'engine/Renderer';
import Entity from 'engine/Entity';
import { createUUID } from 'engine/system/Utils';
import Texture from 'engine/Texture';
import Shader from 'engine/shaders/Shader';

abstract class Material {
  protected _texture: Texture;
  protected _renderer: Renderer;
  protected _shader: Shader;

  public readonly id: string;

  constructor() {
    this.id = createUUID();

    this._renderer = Renderer.instance;
  }

  public abstract render(camera: Camera, entity: Entity, geometry: Geometry): void;

  public get texture(): Texture {
    return this._texture;
  }

  public get shader(): Shader {
    return this._shader;
  }
}

export default Material;
