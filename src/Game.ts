import Renderer from 'engine/Renderer';
import Geometry from 'engine/geometries/Geometry';
import Camera from 'engine/Camera';
import MaterialBasic from 'engine/materials/MaterialBasic';
import Entity from 'engine/Entity';
import Vector3 from 'engine/math/Vector3';
import Texture from 'engine/Texture';
import Scene from 'engine/Scene';
import PlayerController from 'components/PlayerController';
import MaterialSkybox from 'engine/materials/MaterialSkybox';
import GeometrySphere from 'engine/geometries/GeometrySphere';

class Game {
  private _renderer: Renderer;

  init() {
    this._renderer = new Renderer(854, 480, document.getElementById('divGame'));

    this._loadData();
  }

  private _loadData(): void {
    new Texture('textures', 'img/textures.png');
    new Texture('skybox', 'img/skybox.png', this._renderer.gl.LINEAR);

    const wait = () => {
      if (Texture.areTexturesReady()) {
        this.renderTestScene();
      } else {
        requestAnimationFrame(() => wait());
      }
    };

    wait();
  }

  private _createCube(): Geometry {
    const geometry = new Geometry();

    // Front
    geometry.addVertex(-0.5, -0.5, 0.5).addTexCoord(0.0, 1.0);
    geometry.addVertex(0.5, -0.5, 0.5).addTexCoord(1.0, 1.0);
    geometry.addVertex(-0.5, 0.5, 0.5).addTexCoord(0.0, 0.0);
    geometry.addVertex(0.5, 0.5, 0.5).addTexCoord(1.0, 0.0);
    geometry.addTriangle(0, 1, 2).addTriangle(1, 3, 2);

    // Back
    geometry.addVertex(0.5, -0.5, -0.5).addTexCoord(0.0, 1.0);
    geometry.addVertex(-0.5, -0.5, -0.5).addTexCoord(1.0, 1.0);
    geometry.addVertex(0.5, 0.5, -0.5).addTexCoord(0.0, 0.0);
    geometry.addVertex(-0.5, 0.5, -0.5).addTexCoord(1.0, 0.0);
    geometry.addTriangle(4, 5, 6).addTriangle(5, 7, 6);

    // Left
    geometry.addVertex(-0.5, -0.5, -0.5).addTexCoord(0.0, 1.0);
    geometry.addVertex(-0.5, -0.5, 0.5).addTexCoord(1.0, 1.0);
    geometry.addVertex(-0.5, 0.5, -0.5).addTexCoord(0.0, 0.0);
    geometry.addVertex(-0.5, 0.5, 0.5).addTexCoord(1.0, 0.0);
    geometry.addTriangle(8, 9, 10).addTriangle(9, 11, 10);

    // Right
    geometry.addVertex(0.5, -0.5, 0.5).addTexCoord(0.0, 1.0);
    geometry.addVertex(0.5, -0.5, -0.5).addTexCoord(1.0, 1.0);
    geometry.addVertex(0.5, 0.5, 0.5).addTexCoord(0.0, 0.0);
    geometry.addVertex(0.5, 0.5, -0.5).addTexCoord(1.0, 0.0);
    geometry.addTriangle(12, 13, 14).addTriangle(13, 15, 14);

    // Top
    geometry.addVertex(-0.5, 0.5, 0.5).addTexCoord(0.0, 1.0);
    geometry.addVertex(0.5, 0.5, 0.5).addTexCoord(1.0, 1.0);
    geometry.addVertex(-0.5, 0.5, -0.5).addTexCoord(0.0, 0.0);
    geometry.addVertex(0.5, 0.5, -0.5).addTexCoord(1.0, 0.0);
    geometry.addTriangle(16, 17, 18).addTriangle(17, 19, 18);

    // Bottom
    geometry.addVertex(-0.5, -0.5, -0.5).addTexCoord(0.0, 1.0);
    geometry.addVertex(0.5, -0.5, -0.5).addTexCoord(1.0, 1.0);
    geometry.addVertex(-0.5, -0.5, 0.5).addTexCoord(0.0, 0.0);
    geometry.addVertex(0.5, -0.5, 0.5).addTexCoord(1.0, 0.0);
    geometry.addTriangle(20, 21, 22).addTriangle(21, 23, 22);

    geometry.build();

    return geometry;
  }

  private _createFloor(): Geometry {
    const geometry = new Geometry();

    geometry.addVertex(-500, 0, 500).addTexCoord(0.0, 1.0);
    geometry.addVertex(500, 0, 500).addTexCoord(1.0, 1.0);
    geometry.addVertex(-500, 0, -500).addTexCoord(0.0, 0.0);
    geometry.addVertex(500, 0, -500).addTexCoord(1.0, 0.0);
    geometry.addTriangle(0, 1, 2).addTriangle(1, 3, 2);

    geometry.build();

    return geometry;
  }

  private renderTestScene() {
    const cubeGeometry = this._createCube();
    const cubeMaterial = new MaterialBasic(Texture.getTexture('textures'));
    cubeMaterial.v4UV = [0.5, 0.0, 0.5, 1.0];
    cubeMaterial.v2Repeat = [1, 1];
    const cube = new Entity(new Vector3(0, 0.5, 0), cubeGeometry, cubeMaterial);

    const skyboxGeo = new GeometrySphere(900, 32, 16, true);
    const skyboxMat = new MaterialSkybox(Texture.getTexture('skybox'));
    const skybox = new Entity(new Vector3(0, 2, 0), skyboxGeo, skyboxMat);

    const floorGeometry = this._createFloor();
    const floorMaterial = new MaterialBasic(Texture.getTexture('textures'));
    floorMaterial.v4UV = [0.0, 0.0, 0.5, 1.0];
    floorMaterial.v2Repeat = [1000, 1000];
    const floor = new Entity(Vector3.zero, floorGeometry, floorMaterial);

    const camera = Camera.createPerspective(60, 854 / 480, 0.1, 1000.0);

    const player = new Entity(new Vector3(-3, 0, 3));
    player.rotation.y = 45;
    player.addComponent(new PlayerController(camera));

    const scene = new Scene();
    scene.addEntity(cube);
    scene.addEntity(skybox);
    scene.addEntity(floor);
    scene.addEntity(player);
    scene.setCamera(camera);

    this.loopRender(scene);
  }

  private loopRender(scene: Scene) {
    this._renderer.clear();

    scene.update();

    requestAnimationFrame(() => this.loopRender(scene));
  }
}

window.onload = () => {
  const game = new Game();
  game.init();
};
