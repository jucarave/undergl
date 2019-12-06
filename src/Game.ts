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
import GeometrySector from 'engine/geometries/GeometrySector';
import Sector, { SlopeDirection } from 'engine/Sector';
import MaterialSector from 'engine/materials/MaterialSector';
//import SolidWalls from 'engine/collisions/SolidWalls';
import MovementController from 'components/MovementController';
import GravityController from 'components/GravityController';
import SolidGround from 'engine/collisions/SolidGround';

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

  private _createSector(): Geometry {
    const texture = Texture.getTexture('textures');
    const cobbleStone = texture.getUVS(38, 2, 32, 32);

    const sector = new Sector(0.0, 3.0, {
      floorUVs: cobbleStone,
      ceilingUVs: cobbleStone,
      topSlope: 0.0,
      bottomSlope: 0.0,
      slopeDir: SlopeDirection.WEST
    });

    const sector2 = new Sector(3.0, 0.0, {
      floorUVs: cobbleStone,
      ceilingUVs: cobbleStone,
      topSlope: 2.0,
      bottomSlope: 0.0,
      slopeDir: SlopeDirection.EAST
    });

    const sector3 = new Sector(3.0, 0.0, {
      floorUVs: cobbleStone,
      ceilingUVs: cobbleStone,
      topSlope: 2.0,
      bottomSlope: 0.0,
      slopeDir: SlopeDirection.WEST
    });

    const sector4 = new Sector(2.3, 0.7, {
      floorUVs: cobbleStone,
      ceilingUVs: cobbleStone,
      topSlope: 0.0,
      bottomSlope: 0.0,
      slopeDir: SlopeDirection.WEST
    });

    const sector5 = new Sector(3.0, 2.5, {
      floorUVs: cobbleStone,
      ceilingUVs: cobbleStone,
      topSlope: 0.0,
      bottomSlope: 0.0,
      slopeDir: SlopeDirection.WEST
    });

    const sector6 = new Sector(0.0, 0.4, {
      floorUVs: cobbleStone,
      ceilingUVs: cobbleStone,
      topSlope: 0.0,
      bottomSlope: 0.0,
      slopeDir: SlopeDirection.EAST
    });

    sector
      .addVertice(0, 0, { uvs: cobbleStone })
      .addVertice(0, 10, { uvs: cobbleStone })
      .addVertice(4.2, 10, { uvs: cobbleStone })
      .addVertice(4.2, 9.85, { uvs: cobbleStone })
      .addVertice(0.15, 9.85, { uvs: cobbleStone })
      .addVertice(0.15, 0.15, { uvs: cobbleStone })
      .addVertice(9.85, 0.15, { uvs: cobbleStone })
      .addVertice(9.85, 9.85, { uvs: cobbleStone })
      .addVertice(5.8, 9.85, { uvs: cobbleStone })
      .addVertice(5.8, 10, { uvs: cobbleStone })
      .addVertice(10, 10, { uvs: cobbleStone })
      .addVertice(10, 0, { uvs: cobbleStone });

    sector2
      .addVertice(0, 0, { uvs: cobbleStone })
      .addVertice(0, 10, { uvs: cobbleStone })
      .addVertice(5, 10, { uvs: cobbleStone })
      .addVertice(5, 0, { uvs: cobbleStone });

    sector3
      .addVertice(5, 0, { uvs: cobbleStone })
      .addVertice(5, 10, { uvs: cobbleStone })
      .addVertice(10, 10, { uvs: cobbleStone })
      .addVertice(10, 0, { uvs: cobbleStone });

    sector4
      .addVertice(4.2, 9.85, { uvs: cobbleStone })
      .addVertice(4.2, 10, { uvs: cobbleStone })
      .addVertice(5.8, 10, { uvs: cobbleStone })
      .addVertice(5.8, 9.85, { uvs: cobbleStone });

    sector5
      .addVertice(2, 2, { uvs: cobbleStone })
      .addVertice(2, 3, { uvs: cobbleStone })
      .addVertice(3, 3, { uvs: cobbleStone })
      .addVertice(3, 2, { uvs: cobbleStone });

    sector6
      .addVertice(0, 2 + 15, { uvs: cobbleStone })
      .addVertice(0, 4 + 15, { uvs: cobbleStone })
      .addVertice(2, 6 + 15, { uvs: cobbleStone })
      .addVertice(4, 6 + 15, { uvs: cobbleStone })
      .addVertice(6, 4 + 15, { uvs: cobbleStone })
      .addVertice(6, 2 + 15, { uvs: cobbleStone })
      .addVertice(4, 0 + 15, { uvs: cobbleStone })
      .addVertice(2, 0 + 15, { uvs: cobbleStone });

    /*SolidWalls.addSector(sector);
    SolidWalls.addSector(sector2);
    SolidWalls.addSector(sector3);
    SolidWalls.addSector(sector4);
    SolidWalls.addSector(sector5);
    SolidWalls.addSector(sector6);*/

    SolidGround.addSector(sector2);
    SolidGround.addSector(sector3);
    SolidGround.addSector(sector4);
    SolidGround.addSector(sector5);
    SolidGround.addSector(sector6);

    const geo = new GeometrySector();

    geo.addSector(sector);
    geo.addSector(sector2);
    geo.addSector(sector3);
    geo.addSector(sector4);
    geo.addSector(sector5);
    geo.addSector(sector6);
    geo.build();

    return geo;
  }

  private _floatingSector() {
    const texture = Texture.getTexture('textures');
    const cobbleStone = texture.getUVS(38, 2, 32, 32);

    const sector = new Sector(10.0, 3.0, {
      floorUVs: cobbleStone,
      ceilingUVs: cobbleStone,
      topSlope: 0.0,
      bottomSlope: -6.0,
      slopeDir: SlopeDirection.NORTH,
      inverted: true
    });

    sector
      .addVertice(2, 0, { uvs: cobbleStone })
      .addVertice(0, 2, { uvs: cobbleStone })
      .addVertice(0, 4, { uvs: cobbleStone })
      .addVertice(3, 7, { uvs: cobbleStone })
      .addVertice(3, 9, { uvs: cobbleStone })
      .addVertice(2, 9, { uvs: cobbleStone })
      .addVertice(2, 12, { uvs: cobbleStone })
      .addVertice(6, 12, { uvs: cobbleStone })
      .addVertice(11, 7, { uvs: cobbleStone })
      .addVertice(11, 5, { uvs: null, solid: false })
      .addVertice(8, 5, { uvs: null, solid: false })
      .addVertice(8, 7, { uvs: null, solid: false })
      .addVertice(4, 4, { uvs: null, solid: false })
      .addVertice(7, 4, { uvs: null, solid: false })
      .addVertice(8, 5, { uvs: null, solid: false })
      .addVertice(11, 5, { uvs: cobbleStone })
      .addVertice(8, 0, { uvs: cobbleStone })
      .translate(10, 0);

    //SolidWalls.addSector(sector);
    SolidGround.addSector(sector);

    const sector2 = new Sector(7.6, 8.8, {
      floorUVs: cobbleStone,
      ceilingUVs: cobbleStone,
      inverted: true
    });

    sector2
      .addVertice(8, 5, { uvs: cobbleStone })
      .addVertice(7, 4, { uvs: cobbleStone })
      .addVertice(4, 4, { uvs: cobbleStone })
      .addVertice(8, 7, { uvs: cobbleStone })
      .addVertice(8, 5, { uvs: cobbleStone })
      .setParent(sector)
      .translate(10, 0);

    //SolidWalls.addSector(sector2);
    SolidGround.addSector(sector2);

    const geo = new GeometrySector();
    geo.addSector(sector);
    geo.addSector(sector2);
    geo.build();

    return geo;
  }

  private renderTestScene() {
    this._createCube();

    const cubeGeometry = this._createSector();
    const cubeMaterial = new MaterialSector(Texture.getTexture('textures'));
    const cube = new Entity(new Vector3(0, 0.0, 0), cubeGeometry, cubeMaterial);

    const floatingGeometry = this._floatingSector();
    const floatingMaterial = new MaterialSector(Texture.getTexture('textures'));
    const floating = new Entity(new Vector3(0, 0.0, 0), floatingGeometry, floatingMaterial);

    const skyboxGeo = new GeometrySphere(900, 32, 16, true);
    const skyboxMat = new MaterialSkybox(Texture.getTexture('skybox'));
    const skybox = new Entity(new Vector3(2, 2, 0), skyboxGeo, skyboxMat);

    const floorGeometry = this._createFloor();
    const floorMaterial = new MaterialBasic(Texture.getTexture('textures'));
    floorMaterial.v4UV = Texture.getTexture('textures').getUVS(1, 1, 32, 32);
    floorMaterial.v2Repeat = [1000, 1000];
    const floor = new Entity(Vector3.zero, floorGeometry, floorMaterial);

    const camera = Camera.createPerspective(90, 854 / 480, 0.1, 1000.0);

    const player = new Entity(new Vector3(-3, 0, 15));
    player.rotation.y = 45;
    player.addComponent(new PlayerController(camera));
    player.addComponent(new MovementController());
    player.addComponent(new GravityController());

    const scene = new Scene();
    scene.addEntity(cube);
    scene.addEntity(skybox);
    scene.addEntity(floor);
    scene.addEntity(player);
    scene.setCamera(camera);
    scene.addEntity(floating);

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
