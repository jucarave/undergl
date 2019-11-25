interface Callback {
  callback: Function;
  context: object;
}

class Signal {
  private _listeners: Array<Callback>;

  constructor() {
    this._listeners = new Array();
  }

  public add(callback: Function, context: object): void {
    this._listeners.push({ callback, context });
  }

  public remove(callback: Function): void {
    const len = this._listeners.length;
    for (let i = 0; i < len; i++) {
      if (this._listeners[i].callback === callback) {
        this._listeners.splice(i, 1);
        return;
      }
    }
  }

  public dispatch(...params: any): void {
    const len = this._listeners.length;

    for (let i = 0; i < len; i++) {
      const listener = this._listeners[i];
      listener.callback.bind(listener.context)(...params);
    }
  }
}

export default Signal;
