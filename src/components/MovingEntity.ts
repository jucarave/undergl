import Component from 'engine/Component';
import { vector2DLength, vector2DNormalized, vector2DDot } from 'engine/math/Math';
import SolidWalls, { Wall } from 'engine/collisions/SolidWalls';
import Vector3 from 'engine/math/Vector3';

const VERY_CLOSE_DISTANCE = 0.8;

class MovingEntity extends Component {
  private _movingBB: Array<number>;
  private _mvLine: Array<number>;

  public radius: number;

  public readonly componentName: string = 'MovingEntity';

  constructor() {
    super();

    this.radius = 0.4;

    this._movingBB = [0, 0, 0, 0, 0, 0];
    this._mvLine = [0, 0, 0, 0];
  }

  private _updateMovingBoundingBox(xTo: number, zTo: number) {
    const p = this._entity.position;

    this._movingBB[0] = Math.min(p.x - this.radius, p.x - this.radius + xTo);
    this._movingBB[1] = p.y;
    this._movingBB[2] = Math.min(p.z - this.radius, p.z - this.radius + zTo);

    this._movingBB[3] = Math.max(p.x + this.radius, p.x + this.radius + xTo);
    this._movingBB[4] = p.y + 1.8;
    this._movingBB[5] = Math.max(p.z + this.radius, p.z + this.radius + zTo);
  }

  private _setEntityAt(x: number, y: number, z: number) {
    this._entity.position.x = x;
    this._entity.position.y = y;
    this._entity.position.z = z;
  }

  private _updateMvLine(xTo: number, zTo: number, wallNormal: Vector3) {
    const p = this._entity.position;

    this._mvLine[0] = p.x - wallNormal.x * this.radius;
    this._mvLine[1] = p.z - wallNormal.z * this.radius;
    this._mvLine[2] = this._mvLine[0] + xTo;
    this._mvLine[3] = this._mvLine[1] + zTo;
  }

  public moveTo(xTo: number, zTo: number, iteration: number) {
    const p = this._entity.position;

    if (iteration >= 3) {
      this._setEntityAt(p.x + xTo, p.y, p.z + zTo);
      return;
    }

    this._updateMovingBoundingBox(xTo, zTo);

    const mvLength = vector2DLength(0, 0, xTo, zTo);
    const mvInverted = vector2DNormalized(-xTo, -zTo);
    const walls = SolidWalls.getCollidingWalls(this._movingBB, p.x + xTo, p.z + zTo, this.radius);

    let collisionTime = 1.0;
    let collisionPoint: Array<number> = null;

    // Collision routine with each wall
    walls.forEach((wall: Wall) => {
      if (!wall.isFacingMovement(xTo, zTo)) {
        return;
      }

      this._updateMvLine(xTo, zTo, wall.normal);

      const intersectionPoint = wall.getLinesIntersectionPoint(this._mvLine);
      if (intersectionPoint === null) {
        return;
      }

      if (wall.isPointInWall(intersectionPoint[0], intersectionPoint[1])) {
        // It collides with the wall itself
        const dx = intersectionPoint[0] - this._mvLine[0];
        const dy = intersectionPoint[1] - this._mvLine[1];
        const time = Math.max(vector2DLength(0, 0, dx, dy) / mvLength - VERY_CLOSE_DISTANCE, 0.0);

        if (time < collisionTime) {
          collisionTime = time;
          collisionPoint = intersectionPoint;
        }
      } else {
        // Does collides with a vertex?
        const vt = [wall.x1, wall.z1, wall.x2, wall.z2];
        for (let i = 0; i < 4; i += 2) {
          const r = this.radius;
          const distance = wall.getDistanceToVertex(vt[0 + i], vt[1 + i], mvInverted[0], mvInverted[1], p.x, p.z, r);

          if (distance > 0.0) {
            const time = Math.max(distance / mvLength - VERY_CLOSE_DISTANCE, 0.0);

            if (time < collisionTime) {
              collisionTime = time;
              collisionPoint = [vt[0 + i], vt[1 + i]];
              i = 4;
            }
          }
        }
      }
    });

    // Collision response
    if (collisionPoint !== null) {
      const remainingEnergy = 1.0 - collisionTime;
      if (remainingEnergy < 0.1) {
        this._setEntityAt(p.x + xTo * collisionTime, p.y, p.z + zTo * collisionTime);
        return;
      }

      const slideNormal = vector2DNormalized(p.x - collisionPoint[0], p.z - collisionPoint[1]);
      const velDotN = -vector2DDot(slideNormal[0], slideNormal[1], xTo, zTo);
      const slideVelX = slideNormal[0] * velDotN;
      const slideVelZ = slideNormal[1] * velDotN;

      const newXTo = (xTo + slideVelX) * remainingEnergy;
      const newZTo = (zTo + slideVelZ) * remainingEnergy;

      this._setEntityAt(p.x + xTo * collisionTime, p.y, p.z + zTo * collisionTime);
      this.moveTo(newXTo, newZTo, iteration + 1);
    } else {
      this._setEntityAt(p.x + xTo, p.y, p.z + zTo);
    }
  }
}

export default MovingEntity;
