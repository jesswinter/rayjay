import { Hit } from "./hit";
import { Ray } from "./ray";
import { Interval } from "./interval";

export interface Entity {
  hit(ray: Ray, interval: Interval): Hit | null;
}
