import Component from 'engine/Component';
import Time from 'engine/system/Time';
import SolidGround from 'engine/collisions/SolidGround';
import CONFIG from 'Config';

class GravityController extends Component {
  private _vspeed: number;
  private _gravity: number;
  private _jumping: boolean;

  public readonly componentName: string = 'GravityController';

  constructor() {
    super();

    this._vspeed = 0;
    this._gravity = 12;
    this._jumping = false;
  }

  public jump() {
    this._vspeed = 6;
    this._jumping = true;
  }

  public update() {
    const p = this._entity.position;
    const prevVSpeed = this._vspeed;

    this._vspeed -= this._gravity * Time.deltaTime;
    p.y += this._vspeed * Time.deltaTime;

    const ground = SolidGround.getMaxYAt(p.x, p.y, p.z, this._entity.radius);

    if ((!this._jumping && prevVSpeed === 0 && p.y - CONFIG.MAX_SLOPE <= ground) || (p.y <= ground && this._vspeed < 0)) {
      p.y = ground;
      this._vspeed = 0;
      this._jumping = false;
    }
  }
}

export default GravityController;
