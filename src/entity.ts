import { Hit } from "./hit.js";
import { Ray } from "./ray.js";
import { Interval } from "./interval.js";

export interface Entity {
  hit(ray: Ray, interval: Interval): Hit | null;
}
