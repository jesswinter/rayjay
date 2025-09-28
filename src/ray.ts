import { Vec3 } from "./vec3";

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
    return Vec3.mul(this.direction, t).add(this.origin);
  }
}
