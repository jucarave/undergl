import Component from 'engine/Component';
import Time from 'engine/system/Time';
import SolidGround from 'engine/collisions/SolidGround';
import CONFIG from 'Config';

class GravityController extends Component {
  private _vspeed: number;
  private _gravity: number;
  private _jumping: boolean;
  private _boundingBox: Array<number>;

  public readonly componentName: string = 'GravityController';

  constructor() {
    super();

    this._vspeed = 0;
    this._gravity = 12;
    this._jumping = false;
    this._boundingBox = [0, 0, 0, 0, 0, 0];
  }

  private _climbToGround(ground: number) {
    const p = this._entity.position;
    if (ground > p.y) {
      p.y += CONFIG.CLIMP_SPEED * Time.deltaTime;
      if (p.y >= ground) {
        p.y = ground;
      }
    } else {
      p.y -= CONFIG.CLIMP_SPEED * Time.deltaTime;
      if (p.y <= ground) {
        p.y = ground;
      }
    }
  }

  private _updateBoundingBox() {
    const p = this._entity.position;
    const r = this._entity.radius;
    const h = this._entity.height;

    this._boundingBox[0] = p.x - r;
    this._boundingBox[1] = p.y;
    this._boundingBox[2] = p.z - r;
    this._boundingBox[3] = p.x + r;
    this._boundingBox[4] = p.y + h;
    this._boundingBox[5] = p.z + r;
  }

  private _updateGravityMovement() {
    const p = this._entity.position;

    this._vspeed -= this._gravity * Time.deltaTime;
    const spd = this._vspeed * Time.deltaTime;

    if (spd < 0) {
      p.y += spd;
      return;
    }

    const ceiling = SolidGround.getMinYAt(this._boundingBox, p.x, p.y, p.z, this._entity.radius, this._entity.height);
    if (ceiling === Infinity) {
      p.y += spd;
      return;
    }

    if (p.y + 1.8 + spd >= ceiling) {
      p.y = ceiling - 1.8;
      this._vspeed = 0;
    } else {
      p.y += spd;
    }
  }

  public jump() {
    this._vspeed = 6;
    this._jumping = true;
  }

  public update() {
    const p = this._entity.position;
    const prevVSpeed = this._vspeed;

    this._updateBoundingBox();

    this._updateGravityMovement();

    const ground = SolidGround.getMaxYAt(this._boundingBox, p.x, p.z, this._entity.radius);

    if ((!this._jumping && prevVSpeed === 0 && p.y - CONFIG.MAX_SLOPE <= ground) || (p.y <= ground && this._vspeed < 0)) {
      this._climbToGround(ground);

      this._vspeed = 0;
      this._jumping = false;
    }
  }
}

export default GravityController;
