class Time {
  private _lastFrame: number;
  private _deltaTime: number;

  constructor() {
    this._lastFrame = new Date().getTime();
  }

  public update(): void {
    const time = new Date().getTime();

    this._deltaTime = (time - this._lastFrame) / 1000;
    this._lastFrame = time;
  }

  public get deltaTime(): number {
    return this._deltaTime;
  }
}

export default new Time();
