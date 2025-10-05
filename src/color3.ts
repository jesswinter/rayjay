import { Interval } from "./interval";
import { randomRange } from "./utils";

/**
 * An opaque color with components in the range of 0-1
 */
export type Color3 = [number, number, number];

/** Converts a color from linear space to gamma space */
export const c3LinearToGamma = (color: Color3): Color3 => [
  color[0] > 0 ? Math.sqrt(color[0]) : 0,
  color[1] > 0 ? Math.sqrt(color[1]) : 0,
  color[2] > 0 ? Math.sqrt(color[2]) : 0,
];

export const c3Mul = (a: Color3, b: Color3): Color3 => [
  a[0] * b[0],
  a[1] * b[1],
  a[2] * b[2],
];

export const c3MulScalar = (color: Color3, scalar: number): Color3 => [
  color[0] * scalar,
  color[1] * scalar,
  color[2] * scalar,
];

export const c3Add = (a: Color3, b: Color3): Color3 => [
  a[0] + b[0],
  a[1] + b[1],
  a[2] + b[2],
];

/** Returns the components of this color mapped from 0-1 range to 0-255 */
export const c3To256Components = (
  color: Color3,
  intensity: Interval,
): [number, number, number] => [
  Math.floor(255.999 * intensity.clamp(color[0])),
  Math.floor(255.999 * intensity.clamp(color[1])),
  Math.floor(255.999 * intensity.clamp(color[2])),
];

export function c3Random(): Color3 {
  return [Math.random(), Math.random(), Math.random()];
}

/** Generates a random Color3 where each component is between min and max */
export function c3RandomComponentRange(min: number, max: number): Color3 {
  return [randomRange(min, max), randomRange(min, max), randomRange(min, max)];
}
