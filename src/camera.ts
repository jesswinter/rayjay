import { EntityList } from "./entity-list.js";
import { Vec3 } from "./vec3.js";
import { Ray } from "./ray.js";
import { Interval } from "./interval.js";

export class Camera {
  aspectRatio = 16.0 / 9.0;
  imageWidth = 400;
  cameraCenter = new Vec3(0, 0, 0);
  samplesPerPixel = 10;
  maxDepth = 10;

  /**
   * Render world to an image
   */
  render(world: EntityList) {
    Object.freeze(this.cameraCenter);
    this.#initialize();

    process.stderr.write("Rayjay gonna do what Rayjay does!\n");

    process.stdout.write(`P3\n${this.imageWidth} ${this.#imageHeight}\n255\n`);

    for (let j = 0; j < this.#imageHeight; ++j) {
      process.stderr.write(
        `\rScanlines remaining: ${this.#imageHeight - j}               `
      );

      for (let i = 0; i < this.imageWidth; ++i) {
        let pixelColor = new Vec3(0, 0, 0);
        for (let sample = 0; sample < this.samplesPerPixel; ++sample) {
          let ray = this.#getRay(i, j);
          pixelColor.add(this.#rayColor(ray, this.maxDepth, world));
        }
        pixelColor.mul(this.#pixelSamplesScale);
        writePpmColor(pixelColor);
      }
    }

    process.stderr.write("\rFin.                    \n");
  }

  #imageHeight: number;
  #pixel00Loc: Vec3;
  #pixelDeltaU: Vec3;
  #pixelDeltaV: Vec3;
  #pixelSamplesScale: number;

  #initialize(): void {
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
    this.#pixelDeltaU = Object.freeze(Vec3.div(viewportUVec, this.imageWidth));
    this.#pixelDeltaV = Object.freeze(
      Vec3.div(viewportVVec, this.#imageHeight)
    );

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

    this.#pixelSamplesScale = 1 / this.samplesPerPixel;
  }

  /** Generates a sample Ray inside the pixel square at i, j */
  #getRay(i: number, j: number): Ray {
    let offset = this.#sampleSquare();
    const u = Vec3.mul(this.#pixelDeltaU, i + offset.x);
    const v = Vec3.mul(this.#pixelDeltaV, j + offset.y);
    const pixelSample = Vec3.add(this.#pixel00Loc, u).add(v);

    return new Ray(this.cameraCenter, pixelSample.sub(this.cameraCenter));
  }

  /** Generates a random sample point within [-.5,-.5]-[+.5,+.5] unit square */
  // TODO(jw): sampleDisk
  #sampleSquare(): Vec3 {
    return new Vec3(Math.random() - 0.5, Math.random() - 0.5, 0);
  }

  /**
   * Cast a ray into the world and return color
   * @param ray the ray to cast
   * @param depth current depth. reflections will stop when this reaches 0
   * @returns r, g, b color
   */
  #rayColor(ray: Ray, depth: number, world: EntityList): Vec3 {
    if (depth <= 0) {
      return new Vec3(0, 0, 0);
    }
    const h = world.hit(ray, new Interval(0.001, Infinity));
    if (h !== null) {
      const direction = Vec3.randomOnHemisphere(h.normal);
      const reflectedColor = this.#rayColor(
        new Ray(h.contact, direction),
        depth - 1,
        world
      );
      return reflectedColor.mul(0.5);
    }

    // Nothing was hit. Render sky gradient
    const unitDir = Vec3.unit(ray.dir);
    const a = 0.5 * (unitDir.y + 1.0);
    const topColor = new Vec3(0.5, 0.7, 1.0);
    const botColor = new Vec3(1, 1, 1);

    return topColor.mul(a).add(botColor.mul(1 - a));
  }
}

function writePpmColor(color: Vec3) {
  const intensity = new Interval(0, 0.999);
  let ir = Math.floor(255.999 * intensity.clamp(color.x));
  let ig = Math.floor(255.999 * intensity.clamp(color.y));
  let ib = Math.floor(255.999 * intensity.clamp(color.z));

  process.stdout.write(`${ir} ${ig} ${ib}\n`);
}
