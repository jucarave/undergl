import Entity from './Entity';
import Camera from './Camera';
import Time from './system/Time';

interface RenderEntitiesMap {
  [index: string]: Array<Entity>;
}

class Scene {
  protected _entities: Array<Entity>;
  protected _camera: Camera;
  protected _started: boolean;
  protected _renderEntities: RenderEntitiesMap;

  constructor() {
    this._entities = [];
    this._renderEntities = {};
    this._started = false;
  }

  public addEntity(entity: Entity): Scene {
    this._entities.push(entity);

    if (this._started) {
      entity.init();
    }

    if (entity.material && entity.material.texture) {
      const texId = entity.material.shader.id + entity.material.texture.id;

      if (this._renderEntities[texId]) {
        this._renderEntities[texId].push(entity);
      } else {
        this._renderEntities[texId] = [entity];
      }
    }

    return this;
  }

  public setCamera(camera: Camera): Scene {
    this._camera = camera;

    return this;
  }

  public init(): Scene {
    const len = this._entities.length;
    for (let i = 0; i < len; i++) {
      const entity = this._entities[i];
      entity.init();
    }

    this._started = true;

    return this;
  }

  public destroy(): Scene {
    const len = this._entities.length;
    for (let i = 0; i < len; i++) {
      const entity = this._entities[i];
      entity.destroy();
    }

    return this;
  }

  protected _render(entities: Array<Entity>): void {
    const len = entities.length;
    for (let i = 0; i < len; i++) {
      entities[i].render(this._camera);
    }
  }

  public update(): Scene {
    if (!this._started) {
      this.init();
    }

    Time.update();

    const len = this._entities.length;
    for (let i = 0; i < len; i++) {
      const entity = this._entities[i];
      entity.update();
    }

    for (const texId in this._renderEntities) {
      this._render(this._renderEntities[texId]);
    }

    return this;
  }
}

export default Scene;
