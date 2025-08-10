import { Vec3 } from "./vec3.js";
import { Ray } from "./ray.js";

/**
 * Data about a hit on an object from a ray.
 *
 * @class Hit
 * @typedef {Hit}
 */
export class Hit {
  /**
   * Creates a Hit determining its normal and isFrontFace from the givin ray and outwardNoraml.
   *
   * @static
   * @param {Ray} ray
   * @param {number} t
   * @param {Vec3} contact
   * @param {Vec3} outwardNormal
   * @returns {Hit}
   */
  static fromOutwardNormal(ray, t, contact, outwardNormal) {
    const isFrontFace = Vec3.dot(ray.dir, outwardNormal) < 0;

    const normal = outwardNormal.clone();
    if (!isFrontFace) normal.negate();

    return new Hit(contact, normal, t, isFrontFace);
  }

  /**
   * @constructor
   * @param {Vec3} contact - contact point
   * @param {Vec3} normal - outward noraml if the hit was from the front; inward normal if the hit was from the back
   * @param {number} t - t along the ray
   * @param {bool} isFrontFace - did this hit from the front
   */
  constructor(contact, normal, t, isFrontFace) {
    this.contact = contact;
    this.normal = normal;
    this.t = t;
    this.isFrontFace = isFrontFace;
  }
}
