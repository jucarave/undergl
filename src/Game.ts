import Renderer from 'engine/Renderer';
import Geometry from 'engine/Geometry';
import Camera from 'engine/Camera';
import MaterialBasic from 'engine/materials/MaterialBasic';
import Material from 'engine/materials/Material';

class Game {
  private _renderer: Renderer;
  public angle: number = 0;

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

    const camera = Camera.createPerspective(60, 854 / 480, 0.1, 1000.0);

    const material = new MaterialBasic(this._renderer);

    this.loopRender(geometry, camera, material);
  }

  private loopRender(geometry: Geometry, camera: Camera, material: Material) {
    this.angle += 2;
    camera.transform.setIdentity();
    camera.transform.setRotationY(this.angle);
    camera.transform.translate(0, 0, -5);

    this._renderer.clear();

    material.render(camera, geometry);

    requestAnimationFrame(() => this.loopRender(geometry, camera, material));
  }
}

window.onload = () => {
  const game = new Game();
  game.init();
};
