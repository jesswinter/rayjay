import { Interval } from "./interval.js";
import { randomRange } from "./utils.js";

/**
 * An opaque color with components in the range of 0-1
 */
export class Color3 {
  /** Converts a color from linear space to gamma space */
  static linearToGamma(color: Color3): Color3 {
    return new Color3(
      color.red > 0 ? Math.sqrt(color.red) : 0,
      color.green > 0 ? Math.sqrt(color.green) : 0,
      color.blue > 0 ? Math.sqrt(color.blue) : 0,
    );
  }

  static mul(a: Color3, b: Color3): Color3 {
    return new Color3(a.red * b.red, a.green * b.green, a.blue * b.blue);
  }

  static random(): Color3 {
    return new Color3(Math.random(), Math.random(), Math.random());
  }

  /** Generates a random Color3 where each component is between min and max */
  static randomComponentRange(min: number, max: number): Color3 {
    return new Color3(
      randomRange(min, max),
      randomRange(min, max),
      randomRange(min, max),
    );
  }

  red: number;
  green: number;
  blue: number;

  constructor(red: number, green: number, blue: number) {
    this.red = red;
    this.green = green;
    this.blue = blue;
  }

  add(color: Color3) {
    this.red += color.red;
    this.green += color.green;
    this.blue += color.blue;
    return this;
  }

  mul(scalar: number) {
    this.red *= scalar;
    this.green *= scalar;
    this.blue *= scalar;
    return this;
  }

  /** Returns the components of this color mapped from 0-1 range to 0-255 */
  to256Components(intensity: Interval): [number, number, number] {
    return [
      Math.floor(255.999 * intensity.clamp(this.red)),
      Math.floor(255.999 * intensity.clamp(this.green)),
      Math.floor(255.999 * intensity.clamp(this.blue)),
    ];
  }
}
