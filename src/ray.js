import { Vec3 } from "./vec3.js";

export class Ray {
  /**
   * @param {Vec3} origin
   * @param {Vec3} dir
   */
  constructor(origin, dir) {
    this.origin = origin;
    this.dir = dir;
  }

  /**
   * Get a point along the ray.
   * @param {number} t the distance from the origin
   * @returns {Vec3} the point t along this ray
   */
  at(t) {
    // origin + t*dir
    return Vec3.mul(this.dir, t).add(this.origin);
  }
}
