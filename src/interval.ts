/**
 * Defines a numarical interval.
 */
export class Interval {
  min: number;
  max: number;

  constructor(min: number, max: number) {
    this.min = min;
    this.max = max;
  }

  /** @returns a clone of this interval */
  clone(): Interval {
    return new Interval(this.min, this.max);
  }

  /** @returns The length of this Interval. i.e. max - min */
  get length(): number {
    return this.max - this.min;
  }

  /**
   * @returns is x contained in this interval
   */
  contains(x: number): boolean {
    return this.min <= x && x <= this.max;
  }

  /**
   * @returns is x surrounds by this interval
   */
  surrounds(x: number) {
    return this.min < x && x < this.max;
  }
}

export const EMPTY_INTERVAL = Object.freeze(new Interval(Infinity, -Infinity));

export const UNIVERSE_INTERVAL = Object.freeze(
  new Interval(-Infinity, Infinity)
);
