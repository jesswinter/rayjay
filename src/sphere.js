import { Vec3 } from "./vec3.js";
import { Ray } from "./ray.js";
import { Hit } from "./hit.js";

export class Sphere {
  /**
   * @constructor
   * @param {Vec3} center
   * @param {number} radius
   */
  constructor(center, radius) {
    this.center = center;
    this.radius = Math.max(0, radius);
  }

  /**
   * @param {Ray} ray
   * @param {number} tMin - minimum t where a hit can occur
   * @param {number} tMax - maximum t where a hit can occur
   * @returns {Hit|null}
   */
  hit(ray, tMin, tMax) {
    const oc = Vec3.sub(this.center, ray.origin);
    const a = ray.dir.lengthSquared;
    const h = Vec3.dot(ray.dir, oc);
    const c = oc.lengthSquared - this.radius * this.radius;
    const discriminant = h * h - a * c;

    if (discriminant < 0) {
      return null;
    }

    const sqrtD = Math.sqrt(discriminant);

    // Find the nearest root that lies in the acceptable range
    let root = (h - sqrtD) / a;
    if (root <= tMin || tMax <= root) {
      root = (h + sqrtD) / a;
      if (root <= tMin || tMax <= root) {
        return null;
      }
    }

    const contact = ray.at(root);
    const outwardNormal = Vec3.sub(contact, this.center).div(this.radius);
    return Hit.fromOutwardNormal(ray, root, contact, outwardNormal);
  }
}
