import Geometry from './Geometry';
import { angleVectors2D, radToDeg } from 'engine/math/Math';
import DoubleList from 'engine/system/DoubleList';

class GeometrySector extends Geometry {
  constructor(vertices: DoubleList) {
    super();

    let n = vertices.root;
    let ind = 0;

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

      this.addVertex(v1[0], 0.3, v1[1])
        .addTexCoord(0, 0)

        .addVertex(v2[0], 0.3, v2[1])
        .addTexCoord(0, 0)

        .addVertex(v3[0], 0.3, v3[1])
        .addTexCoord(0, 0)

        .addTriangle(ind, ind + 1, ind + 2);

      vertices.remove(n2);

      ind += 3;
    }

    this.build();
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
