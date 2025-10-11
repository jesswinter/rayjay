import { v3Clone, v3Dot, v3Negate, type Vec3 } from "./vec";
import { Ray } from "./ray";
import { type Material } from "./material";

/**
 * Data about a hit on an object from a ray.
 */
export class Hit {
  /**
   * Creates a Hit determining its normal and isFrontFace from the givin ray and outwardNoraml.
   */
  static fromOutwardNormal(
    ray: Ray,
    t: number,
    contact: Vec3,
    outwardNormal: Vec3,
    material: Material,
  ): Hit {
    const isFrontFace = v3Dot(ray.direction, outwardNormal) < 0;

    let normal = v3Clone(outwardNormal);
    if (!isFrontFace) {
      normal = v3Negate(normal);
    }
    return new Hit(contact, normal, t, isFrontFace, material);
  }

  contact: Vec3;
  normal: Vec3;
  t: number;
  isFrontFace: boolean;
  material: Material;

  constructor(
    contact: Vec3,
    normal: Vec3,
    t: number,
    isFrontFace: boolean,
    material: Material,
  ) {
    this.contact = contact;
    this.normal = normal;
    this.t = t;
    this.isFrontFace = isFrontFace;
    this.material = material;
  }
}
