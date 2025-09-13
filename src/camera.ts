import { EntityList } from "./entity-list.js";
import { Vec3 } from "./vec3.js";
import { Color3 } from "./color3.js";
import { Ray } from "./ray.js";
import { Interval } from "./interval.js";
import { degreesToRadians } from "./utils.js";

export class Camera {
  aspectRatio = 16.0 / 9.0;
  imageWidth = 400;
  samplesPerPixel = 10;
  maxDepth = 10;

  vertFov = 90;
  lookFrom = new Vec3(0, 0, 0);
  lookAt = new Vec3(0, 0, -1);
  viewUp = new Vec3(0, 1, 0);

  defocusAngle = 0;
  focusDist = 10;

  /**
   * Render world to an image
   */
  render(world: EntityList) {
    Object.freeze(this.#cameraCenter);
    this.#initialize();

    process.stderr.write("Rayjay gonna do what Rayjay does!\n");

    process.stdout.write(`P3\n${this.imageWidth} ${this.#imageHeight}\n255\n`);

    for (let j = 0; j < this.#imageHeight; ++j) {
      process.stderr.write(
        `\rScanlines remaining: ${this.#imageHeight - j}               `,
      );

      for (let i = 0; i < this.imageWidth; ++i) {
        let pixelColor = new Color3(0, 0, 0);
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
  #cameraCenter: Vec3;
  #pixel00Loc: Vec3;
  #pixelDeltaU: Vec3;
  #pixelDeltaV: Vec3;
  #pixelSamplesScale: number;
  #u: Vec3;
  #v: Vec3;
  #w: Vec3;
  #defocusDiskU: Vec3;
  #defocusDiskV: Vec3;

  #initialize(): void {
    // Image
    this.#imageHeight =
      this.imageWidth / this.aspectRatio < 1
        ? 1
        : Math.floor(this.imageWidth / this.aspectRatio);

    this.#cameraCenter = Object.freeze(this.lookFrom.clone());

    // Camera  x: right, y: up, z: forward
    const theta = degreesToRadians(this.vertFov);
    const h = Math.tan(theta / 2);
    const viewportHeight = 2 * h * this.focusDist;
    const viewportWidth =
      (viewportHeight * this.imageWidth) / this.#imageHeight;

    this.#w = Object.freeze(Vec3.sub(this.lookFrom, this.lookAt).normalize());
    this.#u = Object.freeze(Vec3.cross(this.viewUp, this.#w).normalize());
    this.#v = Object.freeze(Vec3.cross(this.#w, this.#u));

    // Viewport: u: right, v: down
    // Vectors across the horizontal and down the vertical viewport edges
    const viewportUVec = Vec3.mul(this.#u, viewportWidth);
    const viewportVVec = Vec3.negate(this.#v).mul(viewportHeight);

    // Horizontal and vertical delta vectors from pixel to pixel
    this.#pixelDeltaU = Object.freeze(Vec3.div(viewportUVec, this.imageWidth));
    this.#pixelDeltaV = Object.freeze(
      Vec3.div(viewportVVec, this.#imageHeight),
    );

    // Location of upper left pixel
    const viewportUpperLeft = Vec3.sub(
      this.#cameraCenter,
      Vec3.mul(this.#w, this.focusDist),
    )
      .sub(Vec3.div(viewportUVec, 2))
      .sub(Vec3.div(viewportVVec, 2));

    const defocusRadius =
      this.focusDist * Math.tan(degreesToRadians(this.defocusAngle / 2));
    this.#defocusDiskU = Object.freeze(Vec3.mul(this.#u, defocusRadius));
    this.#defocusDiskV = Object.freeze(Vec3.mul(this.#v, defocusRadius));

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

    const rayOrigin =
      this.defocusAngle <= 0 ? this.#cameraCenter : this.#defocusDiskSample();
    const rayDirection = pixelSample.sub(rayOrigin);

    return new Ray(rayOrigin, rayDirection);
  }

  /** Random point on camera defocus disk */
  #defocusDiskSample() {
    let p = Vec3.randomInUnitDisk();
    return Vec3.mul(this.#defocusDiskU, p.x)
      .add(Vec3.mul(this.#defocusDiskV, p.y))
      .add(this.#cameraCenter);
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
  #rayColor(ray: Ray, depth: number, world: EntityList): Color3 {
    if (depth <= 0) {
      return new Color3(0, 0, 0);
    }
    const hit = world.hit(ray, new Interval(0.001, Infinity));
    if (hit !== null) {
      const [wasScattered, attenuation, scattered] = hit.material.tryScatter(
        ray,
        hit,
      );
      if (!wasScattered) {
        return new Color3(0, 0, 0);
      }

      const reflectedColor = this.#rayColor(scattered, depth - 1, world);
      return Color3.mul(attenuation, reflectedColor);
    }

    // Nothing was hit. Render sky gradient
    const unitDir = Vec3.unit(ray.direction);
    const a = 0.5 * (unitDir.y + 1.0);
    const topColor = new Color3(0.5, 0.7, 1.0);
    const botColor = new Color3(1, 1, 1);

    return topColor.mul(a).add(botColor.mul(1 - a));
  }
}

function writePpmColor(color: Color3) {
  const gammaColor = Color3.linearToGamma(color);
  const intensity = new Interval(0, 0.999);
  const [ir, ig, ib] = gammaColor.to256Components(intensity);
  process.stdout.write(`${ir} ${ig} ${ib}\n`);
}
