import { Vec3 } from "./vec3.js";
import { Ray } from "./ray.js";
import { HittableList } from "./hittablelist.js";
import { Sphere } from "./sphere.js";

function degreesToRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

/**
 * Cast a ray into the world and return color
 * @param {Ray} ray the ray to cast
 * @param {HittableList} world
 * @returns {Vec3} r, g, b color
 */
function rayColor(ray, world) {
  const h = world.hit(ray, 0, Infinity);
  if (h !== null) {
    return new Vec3(1, 1, 1).add(h.normal).mul(0.5);
  }

  // const t = hitSphere(new Vec3(0, 0, -1), 0.5, ray);
  // if (t > 0.0) {
  //   const normal = ray.at(t).sub(new Vec3(0, 0, -1)).normalize();
  //   return new Vec3(1, 1, 1).add(normal).mul(0.5);
  // }

  const unitDir = Vec3.unit(ray.dir);
  const a = 0.5 * (unitDir.y + 1.0);
  const topColor = new Vec3(0.5, 0.7, 1.0);
  const botColor = new Vec3(1, 1, 1);

  return topColor.mul(a).add(botColor.mul(1 - a));
}

// Image
const aspectRatio = 16.0 / 9.0;
const imageWidth = 400;
const imageHeight =
  imageWidth / aspectRatio < 1 ? 1 : Math.floor(imageWidth / aspectRatio);

// Camera  x: right, y: up, z: forward
const focalLength = 1.0;
const viewportHeight = 2.0;
const viewportWidth = (viewportHeight * imageWidth) / imageHeight;
const cameraCenter = new Vec3(0, 0, 0);

// Viewport: u: right, v: down
// Vectors across the horizontal and down the vertical viewport edges
const viewportUVec = new Vec3(viewportWidth, 0, 0);
const viewportVVec = new Vec3(0, -viewportHeight, 0);

// Horizontal and vertical delta vectors from pixel to pixel
const pixelDeltaU = Vec3.div(viewportUVec, imageWidth);
const pixelDelatV = Vec3.div(viewportVVec, imageHeight);

// Location of upper left pixel
const viewportUpperLeft = Vec3.sub(cameraCenter, new Vec3(0, 0, focalLength))
  .sub(Vec3.div(viewportUVec, 2))
  .sub(Vec3.div(viewportVVec, 2));
const pixel00Loc = Vec3.add(pixelDeltaU, pixelDelatV)
  .mul(0.5)
  .add(viewportUpperLeft);

// World
const world = new HittableList();
world.add(new Sphere(new Vec3(0, 0, -1), 0.5));
world.add(new Sphere(new Vec3(0, -100.5, -1), 100));

process.stderr.write("Rayjay gonna do what Rayjay does!\n");

process.stdout.write(`P3\n${imageWidth} ${imageHeight}\n255\n`);

for (let j = 0; j < imageHeight; ++j) {
  process.stderr.write(`\rScanlines remaining: ${imageHeight - j}`);

  for (let i = 0; i < imageWidth; ++i) {
    const pixelCenter = Vec3.mul(pixelDeltaU, i)
      .add(Vec3.mul(pixelDelatV, j))
      .add(pixel00Loc);
    const rayDir = Vec3.sub(pixelCenter, cameraCenter);
    const ray = new Ray(cameraCenter, rayDir);

    const pixelColor = rayColor(ray, world);

    // const pixel = new Vec3(i / (imageWidth - 1), j / (imageHeight - 1), 0);

    process.stdout.write(`${pixelColor.toColorString()}\n`);
  }
}

process.stderr.write("\rFin.                    \n");
