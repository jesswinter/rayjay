import { Vec3, tupleToVec3, type Vec2 } from "./vec";
import { EntityList } from "./entity-list";
import { Sphere } from "./sphere";
import { Camera } from "./camera";
import { Lambertian, Metal, Dielectric, type Material } from "./material";
import type { TfWorld, TfMaterial } from "./transmission-format";
import { createTfDemoScene } from "./scenes";
import { degreesToRadians } from "./utils";
import {
  c3Add,
  c3LinearToGamma,
  c3Mul,
  c3MulScalar,
  c3To256Components,
  type Color3,
} from "./color3";
import { Interval } from "./interval";
import { Ray } from "./ray";

export type RenderUpdatedCallback = (
  renderedData: ImageData,
  progress: number,
) => void;

function createWorldFromTf(tf: TfWorld): EntityList {
  const world = new EntityList();
  for (const obj of tf.entities) {
    world.add(
      new Sphere(
        tupleToVec3(obj.center),
        obj.radius,
        tfToMaterial(obj.material),
      ),
    );
  }

  return world;

  function tfToMaterial(tfMaterial: TfMaterial): Material {
    switch (tfMaterial.type) {
      case "lambertian":
        return new Lambertian(tfMaterial.albedo);

      case "metal":
        return new Metal(tfMaterial.albedo, tfMaterial.fuzz);

      case "dielectric":
        return new Dielectric(tfMaterial.refractionIndex);
    }
  }
}

type RenderContext = {
  /** Width of the render target */
  width: number;

  /** Height of the render target */
  height: number;

  cameraCenter: Vec3;
  defocusAngle: number;
  pixel00Loc: Vec3;
  pixelDeltaU: Vec3;
  pixelDeltaV: Vec3;
  samplesPerPixel: number;
  pixelSamplesScale: number;
  maxDepth: number;
  u: Vec3;
  v: Vec3;
  w: Vec3;
  defocusDiskU: Vec3;
  defocusDiskV: Vec3;
};

export function render(
  renderTarget: ImageData,
  onUpdated: RenderUpdatedCallback,
) {
  const tfWorld = createTfDemoScene();
  const job = new RenderJob(renderTarget, tfWorld);
  job.render(onUpdated);
}

class RenderJob {
  renderTarget: ImageData;
  tfWorld: TfWorld;

  constructor(renderTarget: ImageData, tfWorld: TfWorld) {
    this.renderTarget = renderTarget;
    this.tfWorld = tfWorld;
  }

  /**
   * Render world to an image
   */
  render(
    // renderTarget: ImageData,
    // world: EntityList,
    onUpdated: RenderUpdatedCallback,
  ) {
    //const tfWorld = createTfDemoScene();
    const world = createWorldFromTf(this.tfWorld);

    const camera = new Camera();
    camera.samplesPerPixel = 100;
    camera.maxDepth = 50;

    camera.vertFov = 20; // 90
    camera.lookFrom = new Vec3(13, 2, 3);
    camera.lookAt = new Vec3(0, 0, 0);
    camera.viewUp = new Vec3(0, 1, 0);

    camera.defocusAngle = 0.6;
    camera.focusDist = 10;

    const renderContext = createRenderContext(this.renderTarget, camera);
    const totalPixels = renderContext.width * renderContext.height;
    const pixelGen = this.renderPixels(renderContext, world);

    const renderPixel = () => {
      const pixelData = pixelGen.next();
      if (pixelData.done) {
        return;
      }

      const pos = pixelData.value.position;
      writeImageDataColor(this.renderTarget, pos, pixelData.value.color);
      onUpdated(
        this.renderTarget,
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
        for (let sample = 0; sample < renderContext.samplesPerPixel; ++sample) {
          const ray = getRay(renderContext, i, j);
          pixelColor = c3Add(
            pixelColor,
            rayColor(ray, renderContext.maxDepth, world),
          );
        }
        yield {
          position: [i, j],
          color: c3MulScalar(pixelColor, renderContext.pixelSamplesScale),
        };
      }
    }
  }
}

function createRenderContext(
  renderTarget: ImageData,
  camera: Camera,
): RenderContext {
  const width = renderTarget.width;
  const height = renderTarget.height;

  camera.cameraCenter = Object.freeze(camera.lookFrom.clone());

  // Camera  x: right, y: up, z: forward
  const theta = degreesToRadians(camera.vertFov);
  const h = Math.tan(theta / 2);
  const viewportHeight = 2 * h * camera.focusDist;
  const viewportWidth = (viewportHeight * width) / height;

  const w = Object.freeze(Vec3.sub(camera.lookFrom, camera.lookAt).normalize());
  const u = Object.freeze(Vec3.cross(camera.viewUp, w).normalize());
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
    camera.cameraCenter,
    Vec3.mul(w, camera.focusDist),
  )
    .sub(Vec3.div(viewportUVec, 2))
    .sub(Vec3.div(viewportVVec, 2));

  const defocusRadius =
    camera.focusDist * Math.tan(degreesToRadians(camera.defocusAngle / 2));
  const defocusDiskU = Object.freeze(Vec3.mul(u, defocusRadius));
  const defocusDiskV = Object.freeze(Vec3.mul(v, defocusRadius));

  // this.#pixel00Loc = Vec3.add(this.#pixelDeltaU, this.#pixelDeltaV)
  const pixel00Loc = Vec3.add(pixelDeltaU, pixelDeltaV)
    .mul(0.5)
    .add(viewportUpperLeft);

  return Object.freeze({
    width,
    height,
    pixel00Loc,
    pixelDeltaU,
    pixelDeltaV,
    samplesPerPixel: camera.samplesPerPixel,
    pixelSamplesScale: 1 / camera.samplesPerPixel,
    maxDepth: camera.maxDepth,
    cameraCenter: camera.cameraCenter,
    defocusAngle: camera.defocusAngle,
    u,
    v,
    w,
    defocusDiskU,
    defocusDiskV,
  });
}

/** Generates a sample Ray inside the pixel square at i, j */
function getRay(context: RenderContext, i: number, j: number): Ray {
  const offset = sampleSquare();
  const u = Vec3.mul(context.pixelDeltaU, i + offset.x);
  const v = Vec3.mul(context.pixelDeltaV, j + offset.y);
  const pixelSample = Vec3.add(context.pixel00Loc, u).add(v);

  const rayOrigin =
    context.defocusAngle <= 0
      ? context.cameraCenter
      : defocusDiskSample(context);
  const rayDirection = pixelSample.sub(rayOrigin);

  return new Ray(rayOrigin, rayDirection);
}

/** Random point on camera defocus disk */
function defocusDiskSample(context: RenderContext) {
  const p = Vec3.randomInUnitDisk();
  return Vec3.mul(context.defocusDiskU, p.x)
    .add(Vec3.mul(context.defocusDiskV, p.y))
    .add(context.cameraCenter);
}

/** Generates a random sample point within [-.5,-.5]-[+.5,+.5] unit square */
// TODO(jw): sampleDisk
function sampleSquare(): Vec3 {
  return new Vec3(Math.random() - 0.5, Math.random() - 0.5, 0);
}

/**
 * Cast a ray into the world and return color
 * @param ray the ray to cast
 * @param depth current depth. reflections will stop when this reaches 0
 * @returns r, g, b color
 */
function rayColor(ray: Ray, depth: number, world: EntityList): Color3 {
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

    const reflectedColor = rayColor(scattered, depth - 1, world);
    return c3Mul(attenuation, reflectedColor);
  }

  // Nothing was hit. Render sky gradient
  const unitDir = Vec3.unit(ray.direction);
  const a = 0.5 * (unitDir.y + 1.0);
  const topColor: Color3 = [0.5, 0.7, 1.0];
  const botColor: Color3 = [1, 1, 1];

  return c3Add(c3MulScalar(topColor, a), c3MulScalar(botColor, 1 - a));
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
