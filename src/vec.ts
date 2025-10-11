import { randomRange } from "./utils.js";

export type Vec3 = readonly [number, number, number];
export type Vec2 = readonly [number, number];

/** new Vec3 with result of add */
export const v3Add = (a: Vec3, b: Vec3): Vec3 => [
  a[0] + b[0],
  a[1] + b[1],
  a[2] + b[2],
];

export const v3Sub = (a: Vec3, b: Vec3): Vec3 => [
  a[0] - b[0],
  a[1] - b[1],
  a[2] - b[2],
];

/** new Vec3 with result of mul */
export const v3Mul = (vec: Vec3, s: number): Vec3 => [
  vec[0] * s,
  vec[1] * s,
  vec[2] * s,
];

/** new Vec3 with result of div */
export const v3Div = (vec: Vec3, s: number): Vec3 => [
  vec[0] / s,
  vec[1] / s,
  vec[2] / s,
];

export const v3Length = (v: Vec3): number =>
  Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);

export const v3LengthSquared = (v: Vec3): number =>
  v[0] * v[0] + v[1] * v[1] + v[2] * v[2];

export const v3Normalize = (v: Vec3): Vec3 => v3Div(v, v3Length(v));

/** returns a copy of vec negated */
export const v3Negate = (vec: Vec3): Vec3 => [-vec[0], -vec[1], -vec[2]];

/** dot product of a * b */
export const v3Dot = (a: Vec3, b: Vec3): number =>
  a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

/** cross product of a x b */
export const v3Cross = (u: Vec3, v: Vec3): Vec3 => [
  u[1] * v[2] - u[2] * v[1],
  u[2] * v[0] - u[0] * v[2],
  u[0] * v[1] - u[1] * v[0],
];

const e = 1e-8;

/** Is this vectors length aproximatly zero */
export const v3IsNearZero = (v: Vec3): boolean =>
  Math.abs(v[0]) < e && Math.abs(v[1]) < e && Math.abs(v[2]) < e;

/** @returns a copy of this Vec3 */
export const v3Clone = (a: Vec3): Vec3 => [a[0], a[1], a[2]];

/** Generates a random vector on a unit sphere */
export function v3RandomUnit(): Vec3 {
  while (true) {
    const candidate = v3RandomComponentRange(-1, 1);
    const lengthSquared = v3LengthSquared(candidate);
    if (lengthSquared <= 1) {
      const length = Math.sqrt(lengthSquared);
      if (length > 0) {
        return v3Div(candidate, length);
      }
    }
  }
}

/** Generates a random Vec3 where each component is between min and max */
export const v3RandomComponentRange = (min: number, max: number): Vec3 => [
  randomRange(min, max),
  randomRange(min, max),
  randomRange(min, max),
];

export function v3RandomInUnitDisk(): Vec3 {
  while (true) {
    const p: Vec3 = [randomRange(-1, 1), randomRange(-1, 1), 0];
    if (v3LengthSquared(p) < 1) {
      return p;
    }
  }
}

export function v3RandomOnHemisphere(normal: Vec3): Vec3 {
  const vecOnSphere = v3RandomUnit();
  if (v3Dot(vecOnSphere, normal) > 0) {
    return vecOnSphere;
  } else {
    return v3Negate(vecOnSphere);
  }
}

/** Returns reflected vector v off a surface with normal */
export const v3Reflect = (v: Vec3, normal: Vec3): Vec3 =>
  // v - 2*dot(v, normal)*normal;
  v3Sub(v, v3Mul(normal, 2 * v3Dot(v, normal)));

export function v3Refract(uv: Vec3, normal: Vec3, etaiOverEtat: number) {
  // min(-uv * normal, 1)
  const cosTheta = Math.min(v3Dot(v3Negate(uv), normal), 1.0);

  // etaiOverEtat * (uv + cosTheta * normal)
  const rOutPerp = v3Mul(v3Add(v3Mul(normal, cosTheta), uv), etaiOverEtat);

  // -sqrt(abs(1 - rOutPerp.lengthSquared)) * normal
  const rOutParallel = v3Mul(
    normal,
    -Math.sqrt(Math.abs(1 - v3LengthSquared(rOutPerp))),
  );

  return v3Add(rOutPerp, rOutParallel);
}
