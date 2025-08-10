import { Hit } from "./hit.js";
import { Ray } from "./ray.js";

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
   * @param {number} tMin
   * @param {number} tMax
   * @returns {Hit|null}
   */
  hit(ray, tMin, tMax) {
    let closestTSoFar = tMax;
    let closestHit = null;
    for (const obj of this.objects) {
      const h = obj.hit(ray, tMin, closestTSoFar);
      if (h !== null) {
        closestTSoFar = h.t;
        closestHit = h;
      }
    }

    return closestHit;
  }
}
