interface Node {
  value: any;
  prev?: Node;
  next?: Node;
}

class DoubleList {
  private _root: Node;

  public addNode(value: any): DoubleList {
    if (!this._root) {
      this._root = { value };
    } else {
      const last = this.last;
      const node = {
        value,
        prev: last
      };

      last.next = node;
    }

    return this;
  }

  public remove(node: Node): DoubleList {
    const prev = node.prev;
    const next = node.next;

    if (prev) {
      prev.next = next;
    }

    if (next) {
      next.prev = prev;
    }

    if (node === this._root) {
      this._root = node.next;
    }

    node.prev = null;
    node.next = null;
    node.value = null;

    return this;
  }

  public forEach(callback: Function): void {
    let n = this.root;

    while (n) {
      callback(n.value);

      n = n.next;
    }
  }

  public get root(): Node {
    return this._root;
  }

  public get last(): Node {
    let node = this.root;

    while (node.next) {
      node = node.next;
    }

    return node;
  }

  public get length(): number {
    let node = this.root;
    let length = 1;

    if (!node) {
      return 0;
    }

    while (node.next) {
      node = node.next;
      length += 1;
    }

    return length;
  }
}

export default DoubleList;
