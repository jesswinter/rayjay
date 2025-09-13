import { randomRange } from "./utils.js";

export class Vec3 {
  /** dot product of a * b */
  static dot(a: Vec3, b: Vec3): number {
    return a.x * b.x + a.y * b.y + a.z * b.z;
  }

  /** cross product of a x b */
  static cross(u: Vec3, v: Vec3): Vec3 {
    return new Vec3(
      u.y * v.z - u.z * v.y,
      u.z * v.x - u.x * v.z,
      u.x * v.y - u.y * v.x,
    );
  }

  /** returns a copy of vec negated */
  static negate(vec: Vec3): Vec3 {
    return new Vec3(-vec.x, -vec.y, -vec.z);
  }

  /** new Vec3 with result of add */
  static add(a: Vec3, b: Vec3): Vec3 {
    return new Vec3(a.x + b.x, a.y + b.y, a.z + b.z);
  }

  /** new Vec3 with result of add */
  static addScalar(v: Vec3, s: number): Vec3 {
    return new Vec3(v.x + s, v.y + s, v.z + s);
  }

  /** new Vec3 with result of sub */
  static sub(a: Vec3, b: Vec3): Vec3 {
    return new Vec3(a.x - b.x, a.y - b.y, a.z - b.z);
  }

  /** new Vec3 with result of mul */
  static mul(vec: Vec3, s: number): Vec3 {
    return new Vec3(vec.x * s, vec.y * s, vec.z * s);
  }

  /** new Vec3 with result of div */
  static div(vec: Vec3, s: number): Vec3 {
    return new Vec3(vec.x / s, vec.y / s, vec.z / s);
  }

  /** unit vector pointing in the direction of dir */
  static unit(dir: Vec3): Vec3 {
    return Vec3.div(dir, dir.length);
  }

  /** Generates a random Vec3 where each component is >= 0 and < 1. The generated vector is not normalized. */
  static random(): Vec3 {
    return new Vec3(Math.random(), Math.random(), Math.random());
  }

  /** Generates a random Vec3 where each component is between min and max */
  static randomComponentRange(min: number, max: number): Vec3 {
    return new Vec3(
      randomRange(min, max),
      randomRange(min, max),
      randomRange(min, max),
    );
  }

  /** Generates a random vector on a unit sphere */
  static randomUnit(): Vec3 {
    while (true) {
      const candidate = Vec3.randomComponentRange(-1, 1);
      const lengthSquared = candidate.lengthSquared;
      if (lengthSquared <= 1) {
        const length = Math.sqrt(lengthSquared);
        if (length > 0) {
          return candidate.div(length);
        }
      }
    }
  }

  /** Generate a vector on the hemisphere around the given normal */
  static randomOnHemisphere(normal: Vec3): Vec3 {
    const vecOnSphere = Vec3.randomUnit();
    if (Vec3.dot(vecOnSphere, normal) > 0) {
      return vecOnSphere;
    } else {
      return vecOnSphere.negate();
    }
  }

  static randomInUnitDisk(): Vec3 {
    while (true) {
      let p = new Vec3(randomRange(-1, 1), randomRange(-1, 1), 0);
      if (p.lengthSquared < 1) {
        return p;
      }
    }
  }

  /** Returns reflected vector v off a surface with normal */
  static reflect(v: Vec3, normal: Vec3): Vec3 {
    // v - 2*dot(v, normal)*normal;
    return Vec3.sub(v, Vec3.mul(normal, 2 * Vec3.dot(v, normal)));
  }

  static refract(uv: Vec3, normal: Vec3, etaiOverEtat: number) {
    // min(-uv * normal, 1)
    const cosTheta = Math.min(Vec3.dot(Vec3.negate(uv), normal), 1.0);

    // etaiOverEtat * (uv + cosTheta * normal)
    const rOutPerp = Vec3.mul(normal, cosTheta).add(uv).mul(etaiOverEtat);

    // -sqrt(abs(1 - rOutPerp.lengthSquared)) * normal
    const rOutParallel = Vec3.mul(
      normal,
      -Math.sqrt(Math.abs(1 - rOutPerp.lengthSquared)),
    );

    return rOutPerp.add(rOutParallel);
  }

  x: number;
  y: number;
  z: number;

  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  /** @returns a copy of this Vec3 */
  clone(): Vec3 {
    return new Vec3(this.x, this.y, this.z);
  }

  /**
   * Negate and assign result to this Vec3
   */
  negate(): Vec3 {
    this.x = -this.x;
    this.y = -this.y;
    this.z = -this.z;
    return this;
  }

  /** Is this vectors length aproximatly zero */
  isNearZero(): boolean {
    const e = 1e-8;
    return Math.abs(this.x) < e && Math.abs(this.y) < e && Math.abs(this.z) < e;
  }

  /**
   * Normalize this Vec3
   */
  normalize(): Vec3 {
    this.div(this.length);
    return this;
  }

  /**
   * Add v and assign the result to this Vec3
   * @param {Vec3} v
   */
  add(v: Vec3): Vec3 {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
    return this;
  }

  /**
   * Subtract v and assign result to this Vec3
   * @param {Vec3} v
   */
  sub(v: Vec3): Vec3 {
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;
    return this;
  }

  /**
   * Multiply s and assign result to this Vec3
   */
  mul(s: number): Vec3 {
    this.x *= s;
    this.y *= s;
    this.z *= s;
    return this;
  }

  /**
   * Divide by s and assign result to this Vec3
   */
  div(s: number): Vec3 {
    this.x /= s;
    this.y /= s;
    this.z /= s;
    return this;
  }

  get length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  get lengthSquared(): number {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }

  toString(): string {
    return `${this.x} ${this.y} ${this.z}`;
  }
}
