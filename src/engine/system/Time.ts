class Time {
  private _lastFrame: number;
  private _deltaTime: number;
  private _focus: boolean;

  constructor() {
    this._lastFrame = new Date().getTime();
    this._focus = true;

    window.addEventListener('blur', () => {
      this._focus = false;
    });

    window.addEventListener('focus', () => {
      this._lastFrame = new Date().getTime();
      this._focus = true;
    });
  }

  public update(): void {
    const time = new Date().getTime();

    this._deltaTime = (time - this._lastFrame) / 1000;
    this._lastFrame = time;
  }

  public get deltaTime(): number {
    if (!this._focus) {
      return 0;
    }

    return this._deltaTime;
  }
}

export default new Time();
