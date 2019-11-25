import Signal from './Signal';

class Input {
  private _canvas: HTMLCanvasElement;
  private _focus: boolean;

  public onKeyDown: Signal;
  public onKeyUp: Signal;

  public init(canvas: HTMLCanvasElement) {
    this._canvas = canvas;
    this._focus = false;

    this.onKeyDown = new Signal();
    this.onKeyUp = new Signal();

    document.addEventListener('click', (ev: MouseEvent) => {
      this._focus = ev.target === this._canvas;
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
  }
}

export default new Input();
