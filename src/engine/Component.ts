import Entity from './Entity';

abstract class Component {
  protected _entity: Entity;

  public readonly componentName: string;

  init(): void {}
  destroy(): void {}
  update(): void {}

  public set entity(entity: Entity) {
    this._entity = entity;
  }
}

export default Component;
