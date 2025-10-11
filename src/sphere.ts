import { v3Div, v3Dot, v3LengthSquared, v3Sub, type Vec3 } from "./vec";
import { Ray } from "./ray";
import { Hit } from "./hit";
import { Interval } from "./interval";
import { type Entity } from "./entity";
import { type Material } from "./material";

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
    const oc = v3Sub(this.center, ray.origin);
    const a = v3LengthSquared(ray.direction);
    const h = v3Dot(ray.direction, oc);
    const c = v3LengthSquared(oc) - this.radius * this.radius;
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
    const outwardNormal = v3Div(v3Sub(contact, this.center), this.radius);
    return Hit.fromOutwardNormal(
      ray,
      root,
      contact,
      outwardNormal,
      this.material,
    );
  }
}
