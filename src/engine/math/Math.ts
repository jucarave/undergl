const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;

export function degToRad(degrees: number): number {
  return degrees * DEG_TO_RAD;
}

export function radToDeg(radians: number): number {
  return radians * RAD_TO_DEG;
}

export function angleVectors2D(x1: number, y1: number, x2: number, y2: number) {
  const dot = x1 * x2 + y1 * y2;
  const det = y1 * x2 - x1 * y2;

  return Math.atan2(det, dot);
}

export function vector2DLength(x1: number, y1: number, x2: number, y2: number) {
  const x = x2 - x1;
  const y = y2 - y1;

  return Math.sqrt(x * x + y * y);
}
