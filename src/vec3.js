export class Vec3 {
  /**
   * @param {Vec3} a
   * @param {Vec3} b
   * @returns {number} dot product of a * b
   */
  static dot(a, b) {
    return a.x * b.x + a.y * b.y + a.z * b.z;
  }

  /**
   * @static
   * @param {Vec3} a
   * @param {Vec3} b
   * @returns {Vec3} new Vec3 with result of add
   */
  static add(a, b) {
    return new Vec3(a.x + b.x, a.y + b.y, a.z + b.z);
  }

  /**
   * @static
   * @param {Vec3} v
   * @param {number} s
   * @returns {Vec3} new Vec3 with result of add
   */
  static addScalar(v, s) {
    return new Vec3(v.x + s, v.y + s, v.z + s);
  }

  /**
   * @static
   * @param {Vec3} a
   * @param {Vec3} b
   * @returns {Vec3} new Vec3 with result of sub
   */
  static sub(a, b) {
    return new Vec3(a.x - b.x, a.y - b.y, a.z - b.z);
  }

  /**
   * @static
   * @param {Vec3} vec
   * @param {number} s
   * @returns {Vec3} new Vec3 with result of mul
   */
  static mul(vec, s) {
    return new Vec3(vec.x * s, vec.y * s, vec.z * s);
  }

  /**
   * @static
   * @param {Vec3} vec
   * @param {number} s
   * @returns {Vec3} new Vec3 with result of div
   */
  static div(vec, s) {
    return new Vec3(vec.x / s, vec.y / s, vec.z / s);
  }

  /**
   * @static
   * @param {Vec3} dir
   * @returns {Vec3} unit vector pointing in the direction of dir
   */
  static unit(dir) {
    return Vec3.div(dir, dir.length);
  }

  /**
   * @param {number} x
   * @param {number} y
   * @param {number} z
   */
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  /** @returns a copy of this Vec3 */
  clone() {
    return new Vec3(this.x, this.y, this.z);
  }

  /**
   * Negate and assign result to this Vec3
   * @returns {Vec3} this Vec3
   */
  negate() {
    this.x = -this.x;
    this.y = -this.y;
    this.z = -this.z;
    return this;
  }

  /**
   * Normalize this Vec3
   * @returns {this} 
   */
  normalize() {
    this.div(this.length);
    return this;
  }

  /**
   * Add v and assign the result to this Vec3
   * @param {Vec3} v
   * @returns {this}
   */
  add(v) {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
    return this;
  }

  /**
   * Subtract v and assign result to this Vec3
   * @param {Vec3} v
   * @returns {this}
   */
  sub(v) {
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;
    return this;
  }

  /**
   * Multiply s and assign result to this Vec3
   * @param {number} s
   * @returns {this}
   */
  mul(s) {
    this.x *= s;
    this.y *= s;
    this.z *= s;
    return this;
  }

  /**
   * Divide by s and assign result to this Vec3
   * @param {number} s
   * @returns {this}
   */
  div(s) {
    this.x /= s;
    this.y /= s;
    this.z /= s;
    return this;
  }

  /**
   * @readonly
   * @type {number}
   */
  get length() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  /**
   * @readonly
   * @type {number}
   */
  get lengthSquared() {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }

  /** @returns {string} */
  toString() {
    return `${this.x} ${this.y} ${this.z}`;
  }

  /**
   * @returns {string} PPM color string
   */
  toColorString() {
    let ir = Math.floor(255.999 * this.x);
    let ig = Math.floor(255.999 * this.y);
    let ib = Math.floor(255.999 * this.z);

    return `${ir} ${ig} ${ib}`;
  }
}
