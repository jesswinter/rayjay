import { Hit } from "./hit.js";
import { Ray } from "./ray.js";
import { Interval } from "./interval.js";
import { Entity } from "./entity.js";

/**
 * A list of hittable objects that can be raycast against.
 *
 * Hittable objects implement `hit(ray, tMin, tMax)` methods that returns a Hit or null
 */
export class EntityList {
  entities: Entity[];

  constructor() {
    this.entities = [];
  }

  add(entity: Entity) {
    this.entities.push(entity);
  }

  clear() {
    this.entities = [];
  }

  /**
   * Cast a ray into the world and return Hit if anything was hit
   *
   * @param interval - interval along ray to test for hits
   */
  hit(ray: Ray, interval: Interval): Hit | null {
    let closestHit: Hit | null = null;
    const closestInterval = interval.clone();

    for (const entity of this.entities) {
      const h = entity.hit(ray, closestInterval);
      if (h !== null) {
        closestInterval.max = h.t;
        closestHit = h;
      }
    }

    return closestHit;
  }
}
