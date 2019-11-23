class Signal {
  private _listeners: Array<Function>;

  constructor() {
    this._listeners = new Array();
  }

  public add(callback: Function): void {
    this._listeners.push(callback);
  }

  public remove(callback: Function): void {
    const ind = this._listeners.indexOf(callback);

    if (ind !== -1) {
      this._listeners.splice(ind, 1);
    }
  }

  public dispatch(): void {
    const len = this._listeners.length;

    for (let i = 0; i < len; i++) {
      this._listeners[i]();
    }
  }
}

export default Signal;
