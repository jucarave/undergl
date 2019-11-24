import Renderer from 'engine/Renderer';
import Geometry from 'engine/Geometry';
import Camera from 'engine/Camera';
import MaterialBasic from 'engine/materials/MaterialBasic';
import Entity from 'engine/Entity';
import Vector3 from 'engine/math/Vector3';

class Game {
  private _renderer: Renderer;

  init() {
    this._renderer = new Renderer(854, 480, document.getElementById('divGame'));

    this.renderTestScene();
  }

  private renderTestScene() {
    const geometry = new Geometry();

    geometry.addVertex(-0.5, -0.5, 0.0).addColor(1.0, 0.0, 0.0, 1.0);
    geometry.addVertex(0.5, -0.5, 0.0).addColor(0.0, 1.0, 0.0, 1.0);
    geometry.addVertex(-0.5, 0.5, 0.0).addColor(0.0, 0.0, 1.0, 1.0);
    geometry.addVertex(0.5, 0.5, 0.0).addColor(1.0, 1.0, 0.0, 1.0);

    geometry.addTriangle(0, 1, 2).addTriangle(1, 3, 2);
    geometry.build(this._renderer);

    const material = new MaterialBasic(this._renderer);

    const entity = new Entity(Vector3.zero, geometry, material);

    const camera = Camera.createPerspective(60, 854 / 480, 0.1, 1000.0);

    this.loopRender(entity, camera);
  }

  private loopRender(entity: Entity, camera: Camera) {
    camera.position.x = 5;
    camera.position.z = 5;
    camera.rotation.y = 45;

    entity.rotation.z += 1;

    this._renderer.clear();

    entity.render(camera);

    requestAnimationFrame(() => this.loopRender(entity, camera));
  }
}

window.onload = () => {
  const game = new Game();
  game.init();
};
