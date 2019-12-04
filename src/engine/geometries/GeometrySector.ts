import Geometry from './Geometry';
import { angleVectors2D, radToDeg, vector2DLength } from 'engine/math/Math';
import DoubleList from 'engine/system/DoubleList';
import Sector from 'engine/Sector';

class GeometrySector extends Geometry {
  constructor() {
    super();
  }

  private _addPlane(sector: Sector, heightFunc: Function, inverted: boolean, uvs: Array<number>): void {
    const vertices = sector.vertices;

    let n = vertices.root;
    let ind = this._vertexData.length / 9;
    let breakPoint = 100;

    while (vertices.length >= 3) {
      if (breakPoint-- <= 0) {
        console.error('cannot build');
        vertices.destroy();
        return;
      }

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

      this.addVertex(v1[0], heightFunc(v1[0], v1[1]), v1[1])
        .addTexCoord(v1[0], v1[1])
        .addUVs(uvs[0], uvs[1], uvs[2], uvs[3])

        .addVertex(v2[0], heightFunc(v2[0], v2[1]), v2[1])
        .addTexCoord(v2[0], v2[1])
        .addUVs(uvs[0], uvs[1], uvs[2], uvs[3])

        .addVertex(v3[0], heightFunc(v3[0], v3[1]), v3[1])
        .addTexCoord(v3[0], v3[1])
        .addUVs(uvs[0], uvs[1], uvs[2], uvs[3]);

      if (inverted) {
        this.addTriangle(ind, ind + 2, ind + 1);
      } else {
        this.addTriangle(ind, ind + 1, ind + 2);
      }

      vertices.remove(n2);

      ind += 3;
    }

    vertices.destroy();
  }

  private _addWalls(sector: Sector): void {
    const vertices = sector.vertices;
    const inverted = sector.options.inverted;

    const len = vertices.length;
    let n = vertices.root;
    let ind = this._vertexData.length / 9;

    let tx = 0;

    for (let i = 0; i < len; i++) {
      if (n.value[2].invisible) {
        n = n.next;
        tx = 0;
        continue;
      }

      const n2 = n.next ? n.next : vertices.root;
      const tw = tx + vector2DLength(n.value[0], n.value[1], n2.value[0], n2.value[1]);
      const uvs = n.value[2].uvs;

      const y1 = sector.getBottomY(n.value[0], n.value[1]);
      const y2 = sector.getBottomY(n2.value[0], n2.value[1]);
      const h1 = sector.getTopY(n.value[0], n.value[1]);
      const h2 = sector.getTopY(n2.value[0], n2.value[1]);

      this.addVertex(n.value[0], y1, n.value[1])
        .addTexCoord(tx, y1)
        .addUVs(uvs[0], uvs[1], uvs[2], uvs[3])

        .addVertex(n2.value[0], y2, n2.value[1])
        .addTexCoord(tw, y2)
        .addUVs(uvs[0], uvs[1], uvs[2], uvs[3])

        .addVertex(n.value[0], h1, n.value[1])
        .addTexCoord(tx, h1)
        .addUVs(uvs[0], uvs[1], uvs[2], uvs[3])

        .addVertex(n2.value[0], h2, n2.value[1])
        .addTexCoord(tw, h2)
        .addUVs(uvs[0], uvs[1], uvs[2], uvs[3]);

      if (inverted) {
        this.addTriangle(ind, ind + 2, ind + 1).addTriangle(ind + 1, ind + 2, ind + 3);
      } else {
        this.addTriangle(ind, ind + 1, ind + 2).addTriangle(ind + 1, ind + 3, ind + 2);
      }

      ind += 4;
      tx = tw;
      n = n.next;
    }

    vertices.destroy();
  }

  private _areVertexEqual(v1: Array<number>, v2: Array<number>): boolean {
    return v2[0] === v1[0] && v2[1] === v1[1];
  }

  private _pointsInTriangle(vertices: DoubleList, v1: Array<number>, v2: Array<number>, v3: Array<number>): boolean {
    let n = vertices.root;

    while (n) {
      const v = n.value;

      if (this._areVertexEqual(v, v1) || this._areVertexEqual(v, v2) || this._areVertexEqual(v, v3)) {
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

  public addSector(sector: Sector) {
    this._addPlane(sector, sector.getBottomY.bind(sector), !sector.options.inverted, sector.options.floorUVs);
    this._addPlane(sector, sector.getTopY.bind(sector), sector.options.inverted, sector.options.ceilingUVs);
    this._addPlane;
    this._addWalls(sector);
  }
}

export default GeometrySector;
