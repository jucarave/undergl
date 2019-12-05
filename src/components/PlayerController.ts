import Component from 'engine/Component';
import Input from 'engine/system/Input';
import Camera from 'engine/Camera';
import { degToRad } from 'engine/math/Math';
import Vector3 from 'engine/math/Vector3';
import Time from 'engine/system/Time';
import CONFIG from 'Config';
import MovementController from './MovementController';
import GravityController from './GravityController';

type KEYS = 'NONE' | 'LEFT' | 'UP' | 'RIGHT' | 'DOWN' | 'JUMP';

class PlayerController extends Component {
  private _camera: Camera;
  private _mouse: Vector3;
  private _speed: number;
  private _movingController: MovementController;
  private _gravityController: GravityController;
  private _keys = {
    UP: 0,
    RIGHT: 0,
    DOWN: 0,
    LEFT: 0,
    JUMP: 0
  };

  public readonly componentName: string = 'PlayerController';

  constructor(camera: Camera) {
    super();

    this._camera = camera;
    this._mouse = Vector3.zero;
    this._speed = 6;
  }

  public init(): void {
    Input.onKeyDown.add(this._onKeyDown, this);
    Input.onKeyUp.add(this._onKeyUp, this);
    Input.onMouseMove.add(this._onMouseMove, this);

    this._movingController = this._entity.getComponent<MovementController>('MovementController');
    this._gravityController = this._entity.getComponent<GravityController>('GravityController');
  }

  public destroy(): void {
    Input.onKeyDown.remove(this._onKeyDown);
    Input.onKeyUp.remove(this._onKeyUp);
  }

  private _getKeyByCode(keyCode: number): KEYS {
    let key: KEYS = 'NONE';

    if (keyCode === 65) {
      key = 'LEFT';
    } else if (keyCode === 87) {
      key = 'UP';
    } else if (keyCode === 68) {
      key = 'RIGHT';
    } else if (keyCode === 83) {
      key = 'DOWN';
    } else if (keyCode === 32) {
      key = 'JUMP';
    }

    return key;
  }

  private _onKeyDown(ev: KeyboardEvent): void {
    const key = this._getKeyByCode(ev.keyCode);
    if (key === 'NONE' || this._keys[key] === 2) {
      return;
    }

    this._keys[key] = 1;
  }

  private _onKeyUp(ev: KeyboardEvent): void {
    const key = this._getKeyByCode(ev.keyCode);
    if (key === 'NONE') {
      return;
    }

    this._keys[key] = 0;
  }

  private _onMouseMove(ev: MouseEvent): void {
    if (!Input.isPointerLocked) {
      return;
    }

    this._mouse.x = ev.movementX;
    this._mouse.y = ev.movementY;
  }

  private _updateMovement() {
    const h = this._keys.RIGHT - this._keys.LEFT;
    const v = this._keys.UP - this._keys.DOWN;

    if (h !== 0.0 || v != 0.0) {
      const ang = Math.atan2(v, h) - Math.PI / 2 + degToRad(this._entity.rotation.y);
      const speed = this._speed * Time.deltaTime;

      const xTo = Math.cos(ang) * speed;
      const zTo = -Math.sin(ang) * speed;

      this._movingController.moveTo(xTo, zTo, 1);
    }
  }

  private _updateRotation() {
    this._camera.rotation.x -= this._mouse.y * CONFIG.mouseSensitivity * Time.deltaTime;
    this._entity.rotation.y -= this._mouse.x * CONFIG.mouseSensitivity * Time.deltaTime;

    if (this._camera.rotation.x > 60) {
      this._camera.rotation.x = 60;
    } else if (this._camera.rotation.x < -60) {
      this._camera.rotation.x = -60;
    }

    this._mouse.x = 0;
    this._mouse.y = 0;
  }

  private _updateJumping() {
    if (this._keys.JUMP === 1) {
      this._gravityController.jump();
      this._keys.JUMP = 2;
    }
  }

  public update() {
    this._updateMovement();
    this._updateRotation();
    this._updateJumping();

    const p = this._entity.position;
    const r = this._entity.rotation;

    this._camera.position.set(p.x, p.y + 1.7, p.z);
    this._camera.rotation.y = r.y - 90;
  }
}

export default PlayerController;
