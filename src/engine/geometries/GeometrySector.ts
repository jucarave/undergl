import Geometry from './Geometry';
import { angleVectors2D, radToDeg, vector2DLength } from 'engine/math/Math';
import DoubleList from 'engine/system/DoubleList';

class GeometrySector extends Geometry {
  constructor(vertices: DoubleList, y: number, height: number, invert: boolean) {
    super();

    this._addPlane(vertices.clone(), y, !invert);
    this._addPlane(vertices.clone(), y + height, invert);
    this._addWalls(vertices.clone(), y, height, invert);

    this.build();
  }

  private _addPlane(vertices: DoubleList, height: number, inverted: boolean): void {
    let n = vertices.root;
    let ind = this._indices.length;

    while (vertices.length >= 3) {
      const root = vertices.root;

      const n2 = n.next ? n.next : root;
      const n3 = n2.next ? n2.next : root;

      const v1 = n.value;
      const v2 = n2.value;
      const v3 = n3.value;

      const angle = (radToDeg(angleVectors2D(v3[0] - v2[0], v3[1] - v2[1], v1[0] - v2[0], v1[1] - v2[1])) + 360) % 360;

      if (angle >= 180 || this._pointsInTriangle(vertices, v1, v2, v3)) {
        n = n.next ? n.next : root;
        continue;
      }

      this.addVertex(v1[0], height, v1[1])
        .addTexCoord(v1[0], v1[1])

        .addVertex(v2[0], height, v2[1])
        .addTexCoord(v2[0], v2[1])

        .addVertex(v3[0], height, v3[1])
        .addTexCoord(v3[0], v3[1]);

      if (inverted) {
        this.addTriangle(ind, ind + 2, ind + 1);
      } else {
        this.addTriangle(ind, ind + 1, ind + 2);
      }

      vertices.remove(n2);

      ind += 3;
    }
  }

  private _addWalls(vertices: DoubleList, y: number, height: number, invert: boolean): void {
    const len = vertices.length;
    let n = vertices.root;
    let ind = this._indices.length;

    let tx = 0;

    for (let i = 0; i < len; i++) {
      const n2 = n.next ? n.next : vertices.root;
      const tw = tx + vector2DLength(n.value[0], n.value[1], n2.value[0], n2.value[1]);

      this.addVertex(n.value[0], y, n.value[1])
        .addTexCoord(tx, height)

        .addVertex(n2.value[0], y, n2.value[1])
        .addTexCoord(tw, height)

        .addVertex(n.value[0], y + height, n.value[1])
        .addTexCoord(tx, 0)

        .addVertex(n2.value[0], y + height, n2.value[1])
        .addTexCoord(tw, 0);

      if (invert) {
        this.addTriangle(ind, ind + 2, ind + 1).addTriangle(ind + 1, ind + 2, ind + 3);
      } else {
        this.addTriangle(ind, ind + 1, ind + 2).addTriangle(ind + 1, ind + 3, ind + 2);
      }

      ind += 4;
      tx = tw;
      n = n.next;
    }
  }

  private _pointsInTriangle(vertices: DoubleList, v1: Array<number>, v2: Array<number>, v3: Array<number>): boolean {
    let n = vertices.root;

    while (n) {
      const v = n.value;

      if (v === v1 || v === v2 || v === v3) {
        n = n.next;
        continue;
      }

      const denominator: number = (v2[1] - v3[1]) * (v1[0] - v3[0]) + (v3[0] - v2[0]) * (v1[1] - v3[1]);
      const a: number = ((v2[1] - v3[1]) * (v[0] - v3[0]) + (v3[0] - v2[0]) * (v[1] - v3[1])) / denominator;
      const b: number = ((v3[1] - v1[1]) * (v[0] - v3[0]) + (v1[0] - v3[0]) * (v[1] - v3[1])) / denominator;
      const c: number = 1 - a - b;

      if (0 <= a && a <= 1 && 0 <= b && b <= 1 && 0 <= c && c <= 1) {
        return true;
      }

      n = n.next;
    }

    return false;
  }
}

export default GeometrySector;
