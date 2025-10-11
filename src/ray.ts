import { v3Add, v3Mul, type Vec3 } from "./vec";

export class Ray {
  origin: Vec3;
  direction: Vec3;

  constructor(origin: Vec3, dir: Vec3) {
    this.origin = origin;
    this.direction = dir;
  }

  /**
   * Get a point along the ray.
   * @param t the distance from the origin
   * @returns the point t along this ray
   */
  at(t: number): Vec3 {
    // origin + t*dir
    return v3Add(v3Mul(this.direction, t), this.origin);
  }
}
