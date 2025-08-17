import { Hit } from "./hit.js";
import { Ray } from "./ray.js";
import { Interval } from "./interval.js";

/**
 * A list of hittable objects that can be raycast against.
 *
 * Hittable objects implement `hit(ray, tMin, tMax)` methods that returns a Hit or null
 */
export class HittableList {
  constructor() {
    this.objects = [];
  }

  add(hittable) {
    this.objects.push(hittable);
  }

  clear() {
    this.objects = [];
  }

  /**
   * Cast a ray into the world and return Hit if anything was hit
   *
   * @param {Ray} ray
   * @param {Interval} interval - interval along ray to test for hits
   * @returns {Hit|null}
   */
  hit(ray, interval) {
    let closestHit = null;
    const closestInterval = interval.clone();

    for (const obj of this.objects) {
      const h = obj.hit(ray, closestInterval);
      if (h !== null) {
        closestInterval.max = h.t;
        closestHit = h;
      }
    }

    return closestHit;
  }
}
