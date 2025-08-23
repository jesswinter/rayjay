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

  /** Length of this Interval. i.e. max - min */
  get length(): number {
    return this.max - this.min;
  }

  /** Is x contained in this interval */
  contains(x: number): boolean {
    return this.min <= x && x <= this.max;
  }

  /** Is x surrounded by this interval */
  surrounds(x: number): boolean {
    return this.min < x && x < this.max;
  }

  /** @returns a number clamped to this interval */
  clamp(x: number): number {
    if (x < this.min) return this.min;

    if (x > this.max) return this.max;

    return x;
  }
}

export const EMPTY_INTERVAL = Object.freeze(new Interval(Infinity, -Infinity));

export const UNIVERSE_INTERVAL = Object.freeze(
  new Interval(-Infinity, Infinity)
);
