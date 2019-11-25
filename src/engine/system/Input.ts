import Signal from './Signal';

class Input {
  private _canvas: HTMLCanvasElement;
  private _focus: boolean;
  private _isPointerLocked: boolean;

  public onKeyDown: Signal;
  public onKeyUp: Signal;
  public onMouseDown: Signal;
  public onMouseMove: Signal;
  public onMouseUp: Signal;

  public init(canvas: HTMLCanvasElement) {
    this._canvas = canvas;
    this._focus = false;

    this.onKeyDown = new Signal();
    this.onKeyUp = new Signal();
    this.onMouseDown = new Signal();
    this.onMouseMove = new Signal();
    this.onMouseUp = new Signal();

    document.addEventListener('pointerlockchange', this._handlePointerLockChange.bind(this));
    document.addEventListener('mozfullscreenchange', this._handlePointerLockChange.bind(this));
    document.addEventListener('webkitfullscreenchange', this._handlePointerLockChange.bind(this));

    document.addEventListener('click', (ev: MouseEvent) => {
      this._focus = ev.target === this._canvas;

      if (this._focus && this._canvas.requestPointerLock) {
        this._canvas.requestPointerLock();
      }
    });

    document.body.addEventListener('keydown', (ev: KeyboardEvent) => {
      if (!this._focus) {
        return;
      }

      this.onKeyDown.dispatch(ev);
    });

    document.body.addEventListener('keyup', (ev: KeyboardEvent) => {
      if (!this._focus) {
        return;
      }

      this.onKeyUp.dispatch(ev);
    });

    document.body.addEventListener('mousedown', (ev: MouseEvent) => {
      if (!this._focus) {
        return;
      }

      this.onMouseDown.dispatch(ev);
    });

    document.body.addEventListener('mousemove', (ev: MouseEvent) => {
      if (!this._focus) {
        return;
      }

      this.onMouseMove.dispatch(ev);
    });

    document.body.addEventListener('mouseup', (ev: MouseEvent) => {
      if (!this._focus) {
        return;
      }

      this.onMouseUp.dispatch(ev);
    });
  }

  private _handlePointerLockChange(): void {
    if (
      document.pointerLockElement === this._canvas ||
      (<any>document).mozfullscreenchange === this._canvas ||
      (<any>document).webkitPointerLockElement === this._canvas
    ) {
      this._isPointerLocked = true;
    } else {
      this._isPointerLocked = false;
    }
  }

  public get isPointerLocked(): boolean {
    return this._isPointerLocked;
  }
}

export default new Input();
