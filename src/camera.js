import { HittableList } from "./hittable-list.js";
import { Vec3 } from "./vec3.js";
import { Ray } from "./ray.js";
import { Interval } from "./interval.js";

export class Camera {
  /** @type {number} */
  aspectRatio = 16.0 / 9.0;

  /** @type {number} */
  imageWidth = 400;

  /** @type {Vec3} */
  cameraCenter = new Vec3(0, 0, 0);

  /**
   * Render world to an image
   * @param {HittableList} world
   */
  render(world) {
    this.#initialize();

    process.stderr.write("Rayjay gonna do what Rayjay does!\n");

    process.stdout.write(`P3\n${this.imageWidth} ${this.#imageHeight}\n255\n`);

    for (let j = 0; j < this.#imageHeight; ++j) {
      process.stderr.write(`\rScanlines remaining: ${this.#imageHeight - j}`);

      for (let i = 0; i < this.imageWidth; ++i) {
        const pixelCenter = Vec3.mul(this.#pixelDeltaU, i)
          .add(Vec3.mul(this.#pixelDeltaV, j))
          .add(this.#pixel00Loc);
        const rayDir = Vec3.sub(pixelCenter, this.cameraCenter);
        const ray = new Ray(this.cameraCenter, rayDir);

        const pixelColor = this.#rayColor(ray, world);

        process.stdout.write(`${pixelColor.toColorString()}\n`);
      }
    }

    process.stderr.write("\rFin.                    \n");
  }

  /** @type {number} */
  #imageHeight;

  /** @type {Vec3} */
  #pixel00Loc;

  /** @type {Vec3} */
  #pixelDeltaU;

  /** @type {Vec3} */
  #pixelDeltaV;

  #initialize() {
    // Image
    this.#imageHeight =
      this.imageWidth / this.aspectRatio < 1
        ? 1
        : Math.floor(this.imageWidth / this.aspectRatio);

    // Camera  x: right, y: up, z: forward
    const focalLength = 1.0;
    const viewportHeight = 2.0;
    const viewportWidth =
      (viewportHeight * this.imageWidth) / this.#imageHeight;

    // Viewport: u: right, v: down
    // Vectors across the horizontal and down the vertical viewport edges
    const viewportUVec = new Vec3(viewportWidth, 0, 0);
    const viewportVVec = new Vec3(0, -viewportHeight, 0);

    // Horizontal and vertical delta vectors from pixel to pixel
    this.#pixelDeltaU = Vec3.div(viewportUVec, this.imageWidth);
    this.#pixelDeltaV = Vec3.div(viewportVVec, this.#imageHeight);

    // Location of upper left pixel
    const viewportUpperLeft = Vec3.sub(
      this.cameraCenter,
      new Vec3(0, 0, focalLength)
    )
      .sub(Vec3.div(viewportUVec, 2))
      .sub(Vec3.div(viewportVVec, 2));
    this.#pixel00Loc = Vec3.add(this.#pixelDeltaU, this.#pixelDeltaV)
      .mul(0.5)
      .add(viewportUpperLeft);
  }

  /**
   * Cast a ray into the world and return color
   * @param {Ray} ray the ray to cast
   * @param {HittableList} world
   * @returns {Vec3} r, g, b color
   */
  #rayColor(ray, world) {
    const h = world.hit(ray, new Interval(0, Infinity));
    if (h !== null) {
      return new Vec3(1, 1, 1).add(h.normal).mul(0.5);
    }

    const unitDir = Vec3.unit(ray.dir);
    const a = 0.5 * (unitDir.y + 1.0);
    const topColor = new Vec3(0.5, 0.7, 1.0);
    const botColor = new Vec3(1, 1, 1);

    return topColor.mul(a).add(botColor.mul(1 - a));
  }
}
