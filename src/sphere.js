import { Vec3 } from "./vec3.js";
import { Ray } from "./ray.js";
import { Hit } from "./hit.js";
import { Interval } from "./interval.js";

export class Sphere {
  /**
   * @param {Vec3} center
   * @param {number} radius
   */
  constructor(center, radius) {
    this.center = center;
    this.radius = Math.max(0, radius);
  }

  /**
   * @param {Ray} ray
   * @param {Interval} interval - interrval along ray to test
   * @returns {Hit|null}
   */
  hit(ray, interval) {
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
    if (!interval.surrounds(root)) {
      root = (h + sqrtD) / a;
      if (!interval.surrounds(root)) {
        return null;
      }
    }

    const contact = ray.at(root);
    const outwardNormal = Vec3.sub(contact, this.center).div(this.radius);
    return Hit.fromOutwardNormal(ray, root, contact, outwardNormal);
  }
}
