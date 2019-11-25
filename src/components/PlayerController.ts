import Component from 'engine/Component';
import Input from 'engine/system/Input';
import Camera from 'engine/Camera';
import { degToRad } from 'engine/math/Math';

type KEYS = 'NONE' | 'LEFT' | 'UP' | 'RIGHT' | 'DOWN';

class PlayerController extends Component {
  private _camera: Camera;
  private _keys = {
    UP: 0,
    RIGHT: 0,
    DOWN: 0,
    LEFT: 0
  };

  constructor(camera: Camera) {
    super();

    this._camera = camera;
  }

  public init(): void {
    Input.onKeyDown.add(this._onKeyDown, this);
    Input.onKeyUp.add(this._onKeyUp, this);
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

  private _updateMovement() {
    const h = this._keys.RIGHT - this._keys.LEFT;
    const v = this._keys.UP - this._keys.DOWN;

    if (h !== 0.0 || v != 0.0) {
      const ang = Math.atan2(v, h) - Math.PI / 2 + degToRad(this._entity.rotation.y);

      this._entity.position.x += Math.cos(ang) * 0.3;
      this._entity.position.z -= Math.sin(ang) * 0.3;
    }
  }

  public update() {
    this._updateMovement();

    const p = this._entity.position;
    const r = this._entity.rotation;

    this._camera.position.set(p.x, p.y + 0.5, p.z);
    this._camera.rotation.set(0, r.y - 90, 0);
  }
}

export default PlayerController;
