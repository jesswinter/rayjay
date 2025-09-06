import { Vec3 } from "./vec3.js";
import { Ray } from "./ray.js";
import { Hit } from "./hit.js";
import { Interval } from "./interval.js";
import { Entity } from "./entity.js";
import { Material } from "./material.js";

export class Sphere implements Entity {
  center: Vec3;
  radius: number;
  material: Material;

  constructor(center: Vec3, radius: number, material: Material) {
    this.center = center;
    this.radius = Math.max(0, radius);
    this.material = material;
  }

  /**
   * @param ray
   * @param interval - interrval along ray to test
   */
  hit(ray: Ray, interval: Interval): Hit | null {
    const oc = Vec3.sub(this.center, ray.origin);
    const a = ray.direction.lengthSquared;
    const h = Vec3.dot(ray.direction, oc);
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
    return Hit.fromOutwardNormal(
      ray,
      root,
      contact,
      outwardNormal,
      this.material
    );
  }
}
