import { EntityList } from "./entity-list";
import { Vec3, type Vec2 } from "./vec";
import {
  type Color3,
  c3Add,
  c3LinearToGamma,
  c3Mul,
  c3MulScalar,
  c3To256Components,
} from "./color3";
import { Ray } from "./ray";
import { Interval } from "./interval";
import { type RenderUpdatedCallback } from "./renderer";
import { degreesToRadians } from "./utils";

type RenderContext = {
  width: number;
  height: number;
  pixel00Loc: Vec3;
  pixelDeltaU: Vec3;
  pixelDeltaV: Vec3;
  pixelSamplesScale: number;
  u: Vec3;
  v: Vec3;
  w: Vec3;
  defocusDiskU: Vec3;
  defocusDiskV: Vec3;
};

export class Camera {
  cameraCenter = new Vec3(0, 0, 0);
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
  render(
    renderTarget: ImageData,
    world: EntityList,
    onUpdated: RenderUpdatedCallback,
  ) {
    Object.freeze(this.cameraCenter);
    const renderContext = this.#createRenderContext(renderTarget);
    const totalPixels = renderContext.width * renderContext.height;
    const pixelGen = this.renderPixels(renderContext, world);

    const renderPixel = () => {
      const pixelData = pixelGen.next();
      if (pixelData.done) {
        return;
      }

      const pos = pixelData.value.position;
      writeImageDataColor(renderTarget, pos, pixelData.value.color);
      onUpdated(
        renderTarget,
        (pos[0] + renderContext.width * pos[1]) / totalPixels,
      );

      setTimeout(renderPixel);
    };
    setTimeout(renderPixel);
  }

  *renderPixels(
    renderContext: RenderContext,
    world: EntityList,
  ): Generator<{ position: Vec2; color: Color3 }> {
    for (let j = 0; j < renderContext.height; ++j) {
      for (let i = 0; i < renderContext.width; ++i) {
        let pixelColor: Color3 = [0, 0, 0];
        for (let sample = 0; sample < this.samplesPerPixel; ++sample) {
          const ray = this.#getRay(renderContext, i, j);
          pixelColor = c3Add(
            pixelColor,
            this.#rayColor(ray, this.maxDepth, world),
          );
        }
        yield {
          position: [i, j],
          color: c3MulScalar(pixelColor, renderContext.pixelSamplesScale),
        };
      }
    }
  }

  #createRenderContext(renderTarget: ImageData): RenderContext {
    const width = renderTarget.width;
    const height = renderTarget.height;

    this.cameraCenter = Object.freeze(this.lookFrom.clone());

    // Camera  x: right, y: up, z: forward
    const theta = degreesToRadians(this.vertFov);
    const h = Math.tan(theta / 2);
    const viewportHeight = 2 * h * this.focusDist;
    const viewportWidth = (viewportHeight * width) / height;

    const w = Object.freeze(Vec3.sub(this.lookFrom, this.lookAt).normalize());
    const u = Object.freeze(Vec3.cross(this.viewUp, w).normalize());
    const v = Object.freeze(Vec3.cross(w, u));

    // Viewport: u: right, v: down
    // Vectors across the horizontal and down the vertical viewport edges
    const viewportUVec = Vec3.mul(u, viewportWidth);
    const viewportVVec = Vec3.negate(v).mul(viewportHeight);

    // Horizontal and vertical delta vectors from pixel to pixel
    const pixelDeltaU = Object.freeze(Vec3.div(viewportUVec, width));
    const pixelDeltaV = Object.freeze(Vec3.div(viewportVVec, height));

    // Location of upper left pixel
    const viewportUpperLeft = Vec3.sub(
      this.cameraCenter,
      Vec3.mul(w, this.focusDist),
    )
      .sub(Vec3.div(viewportUVec, 2))
      .sub(Vec3.div(viewportVVec, 2));

    const defocusRadius =
      this.focusDist * Math.tan(degreesToRadians(this.defocusAngle / 2));
    const defocusDiskU = Object.freeze(Vec3.mul(u, defocusRadius));
    const defocusDiskV = Object.freeze(Vec3.mul(v, defocusRadius));

    // this.#pixel00Loc = Vec3.add(this.#pixelDeltaU, this.#pixelDeltaV)
    const pixel00Loc = Vec3.add(pixelDeltaU, pixelDeltaV)
      .mul(0.5)
      .add(viewportUpperLeft);

    return {
      width,
      height,
      pixel00Loc,
      pixelDeltaU,
      pixelDeltaV,
      pixelSamplesScale: 1 / this.samplesPerPixel,
      u,
      v,
      w,
      defocusDiskU,
      defocusDiskV,
    };
  }

  /** Generates a sample Ray inside the pixel square at i, j */
  #getRay(context: RenderContext, i: number, j: number): Ray {
    const offset = this.#sampleSquare();
    const u = Vec3.mul(context.pixelDeltaU, i + offset.x);
    const v = Vec3.mul(context.pixelDeltaV, j + offset.y);
    const pixelSample = Vec3.add(context.pixel00Loc, u).add(v);

    const rayOrigin =
      this.defocusAngle <= 0
        ? this.cameraCenter
        : this.#defocusDiskSample(context);
    const rayDirection = pixelSample.sub(rayOrigin);

    return new Ray(rayOrigin, rayDirection);
  }

  /** Random point on camera defocus disk */
  #defocusDiskSample(context: RenderContext) {
    const p = Vec3.randomInUnitDisk();
    return Vec3.mul(context.defocusDiskU, p.x)
      .add(Vec3.mul(context.defocusDiskV, p.y))
      .add(this.cameraCenter);
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
      return [0, 0, 0];
    }
    const hit = world.hit(ray, new Interval(0.001, Infinity));
    if (hit !== null) {
      const [wasScattered, attenuation, scattered] = hit.material.tryScatter(
        ray,
        hit,
      );
      if (!wasScattered) {
        return [0, 0, 0];
      }

      const reflectedColor = this.#rayColor(scattered, depth - 1, world);
      return c3Mul(attenuation, reflectedColor);
    }

    // Nothing was hit. Render sky gradient
    const unitDir = Vec3.unit(ray.direction);
    const a = 0.5 * (unitDir.y + 1.0);
    const topColor: Color3 = [0.5, 0.7, 1.0];
    const botColor: Color3 = [1, 1, 1];

    return c3Add(c3MulScalar(topColor, a), c3MulScalar(botColor, 1 - a));
  }
}

function writeImageDataColor(
  imageData: ImageData,
  position: Vec2,
  color: Color3,
) {
  const gammaColor = c3LinearToGamma(color);
  const intensity = new Interval(0, 0.999);
  const [ir, ig, ib] = c3To256Components(gammaColor, intensity);
  const i = (position[1] * imageData.width + position[0]) * 4;

  imageData.data[i + 0] = ir;
  imageData.data[i + 1] = ig;
  imageData.data[i + 2] = ib;
  imageData.data[i + 3] = 255;
}
