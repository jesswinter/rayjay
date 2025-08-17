/**
 * Defines a numarical interval.
 */
export class Interval {
  /**
   * @param {number} min
   * @param {number} max
   */
  constructor(min, max) {
    this.min = min;
    this.max = max;
  }

  /** @returns {Interval} a clone of this interval */
  clone() {
    return new Interval(this.min, this.max);
  }

  /** @returns {number} The length of this Interval. i.e. max - min */
  get length() {
    return this.max - this.min;
  }

  /**
   * @param {number} x
   * @returns {boolean} is x contained in this interval
   */
  contains(x) {
    return this.min <= x && x <= this.max;
  }

  /**
   * @param {number} x
   * @returns {boolean} is x surrounds by this interval
   */
  surrounds(x) {
    return this.min < x && x < this.max;
  }
}

export const EMPTY_INTERVAL = Object.freeze(new Interval(Infinity, -Infinity));

export const UNIVERSE_INTERVAL = Object.freeze(
  new Interval(-Infinity, Infinity)
);
