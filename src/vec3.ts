export class Vec3 {
  /**
   * @returns dot product of a * b
   */
  static dot(a: Vec3, b: Vec3): number {
    return a.x * b.x + a.y * b.y + a.z * b.z;
  }

  /**
   * @returns new Vec3 with result of add
   */
  static add(a: Vec3, b: Vec3): Vec3 {
    return new Vec3(a.x + b.x, a.y + b.y, a.z + b.z);
  }

  /**
   * @returns new Vec3 with result of add
   */
  static addScalar(v: Vec3, s: number): Vec3 {
    return new Vec3(v.x + s, v.y + s, v.z + s);
  }

  /**
   * @returns new Vec3 with result of sub
   */
  static sub(a: Vec3, b: Vec3): Vec3 {
    return new Vec3(a.x - b.x, a.y - b.y, a.z - b.z);
  }

  /**
   * @returns new Vec3 with result of mul
   */
  static mul(vec: Vec3, s: number): Vec3 {
    return new Vec3(vec.x * s, vec.y * s, vec.z * s);
  }

  /**
   * @returns new Vec3 with result of div
   */
  static div(vec: Vec3, s: number): Vec3 {
    return new Vec3(vec.x / s, vec.y / s, vec.z / s);
  }

  /**
   * @returns unit vector pointing in the direction of dir
   */
  static unit(dir: Vec3): Vec3 {
    return Vec3.div(dir, dir.length);
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
