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

  private _createCube(): Geometry {
    const geometry = new Geometry();

    // Front
    geometry.addVertex(-0.5, -0.5, 0.5).addColor(1.0, 0.0, 0.0, 1.0);
    geometry.addVertex(0.5, -0.5, 0.5).addColor(1.0, 0.0, 0.0, 1.0);
    geometry.addVertex(-0.5, 0.5, 0.5).addColor(1.0, 0.0, 0.0, 1.0);
    geometry.addVertex(0.5, 0.5, 0.5).addColor(1.0, 0.0, 0.0, 1.0);
    geometry.addTriangle(0, 1, 2).addTriangle(1, 3, 2);

    // Back
    geometry.addVertex(0.5, -0.5, -0.5).addColor(0.0, 1.0, 0.0, 1.0);
    geometry.addVertex(-0.5, -0.5, -0.5).addColor(0.0, 1.0, 0.0, 1.0);
    geometry.addVertex(0.5, 0.5, -0.5).addColor(0.0, 1.0, 0.0, 1.0);
    geometry.addVertex(-0.5, 0.5, -0.5).addColor(0.0, 1.0, 0.0, 1.0);
    geometry.addTriangle(4, 5, 6).addTriangle(5, 7, 6);

    // Left
    geometry.addVertex(-0.5, -0.5, -0.5).addColor(0.0, 0.0, 1.0, 1.0);
    geometry.addVertex(-0.5, -0.5, 0.5).addColor(0.0, 0.0, 1.0, 1.0);
    geometry.addVertex(-0.5, 0.5, -0.5).addColor(0.0, 0.0, 1.0, 1.0);
    geometry.addVertex(-0.5, 0.5, 0.5).addColor(0.0, 0.0, 1.0, 1.0);
    geometry.addTriangle(8, 9, 10).addTriangle(9, 11, 10);

    // Right
    geometry.addVertex(0.5, -0.5, 0.5).addColor(1.0, 1.0, 0.0, 1.0);
    geometry.addVertex(0.5, -0.5, -0.5).addColor(1.0, 1.0, 0.0, 1.0);
    geometry.addVertex(0.5, 0.5, 0.5).addColor(1.0, 1.0, 0.0, 1.0);
    geometry.addVertex(0.5, 0.5, -0.5).addColor(1.0, 1.0, 0.0, 1.0);
    geometry.addTriangle(12, 13, 14).addTriangle(13, 15, 14);

    // Top
    geometry.addVertex(-0.5, 0.5, 0.5).addColor(1.0, 0.0, 1.0, 1.0);
    geometry.addVertex(0.5, 0.5, 0.5).addColor(1.0, 0.0, 1.0, 1.0);
    geometry.addVertex(-0.5, 0.5, -0.5).addColor(1.0, 0.0, 1.0, 1.0);
    geometry.addVertex(0.5, 0.5, -0.5).addColor(1.0, 0.0, 1.0, 1.0);
    geometry.addTriangle(16, 17, 18).addTriangle(17, 19, 18);

    // Bottom
    geometry.addVertex(-0.5, -0.5, -0.5).addColor(0.0, 1.0, 1.0, 1.0);
    geometry.addVertex(0.5, -0.5, -0.5).addColor(0.0, 1.0, 1.0, 1.0);
    geometry.addVertex(-0.5, -0.5, 0.5).addColor(0.0, 1.0, 1.0, 1.0);
    geometry.addVertex(0.5, -0.5, 0.5).addColor(0.0, 1.0, 1.0, 1.0);
    geometry.addTriangle(20, 21, 22).addTriangle(21, 23, 22);

    geometry.build(this._renderer);

    return geometry;
  }

  private renderTestScene() {
    const geometry = this._createCube();

    const material = new MaterialBasic(this._renderer);

    const entity = new Entity(Vector3.zero, geometry, material);

    const camera = Camera.createPerspective(60, 854 / 480, 0.1, 1000.0);

    this.loopRender(entity, camera);
  }

  private loopRender(entity: Entity, camera: Camera) {
    camera.position.set(5, 5, 5);
    camera.rotation.set(-35, 45, 0);

    entity.rotation.x -= 1;
    entity.rotation.y += 1;
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
