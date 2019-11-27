import Geometry from './Geometry';
import { degToRad } from 'engine/math/Math';

class GeometrySphere extends Geometry {
  constructor(radius: number, segments: number, rings: number, inverted: boolean = false) {
    super();

    const anglePerSegments = 360 / segments;
    const anglePerRings = 180 / rings;

    let ind = 0;

    for (let r = 0; r < 180; r += anglePerRings) {
      for (let s = 0; s < 360; s += anglePerSegments) {
        for (let j = 0; j <= anglePerRings; j += anglePerRings) {
          for (let i = 0; i <= anglePerSegments; i += anglePerSegments) {
            const sAng = degToRad(s + i);
            const rAng = degToRad(r + j);

            const x = Math.cos(sAng) * Math.sin(rAng) * radius;
            const y = Math.cos(rAng) * radius;
            const z = Math.sin(sAng) * Math.sin(rAng) * radius;

            this.addVertex(x, y, z).addTexCoord((s + i) / 360, (r + j) / 180);
          }
        }

        if (inverted) {
          this.addTriangle(ind, ind + 2, ind + 1).addTriangle(ind + 1, ind + 2, ind + 3);
        } else {
          this.addTriangle(ind, ind + 1, ind + 2).addTriangle(ind + 1, ind + 3, ind + 2);
        }

        ind += 4;
      }
    }

    this.build();
  }
}

export default GeometrySphere;
