import { Vec3 } from "./vec3.js";
import { Ray } from "./ray.js";

/**
 * Cast a ray into the world and return color
 * @param {Ray} ray the ray to cast
 * @returns {Vec3} r, g, b color
 */
function rayColor(ray) {
  const t = hitSphere(new Vec3(0, 0, -1), 0.5, ray);
  if (t > 0.0) {
    const normal = ray.at(t).sub(new Vec3(0, 0, -1)).normalize();
    return new Vec3(1, 1, 1).add(normal).mul(0.5);
  }

  const unitDir = Vec3.unit(ray.dir);
  const a = 0.5 * (unitDir.y + 1.0);
  const topColor = new Vec3(0.5, 0.7, 1.0);
  const botColor = new Vec3(1, 1, 1);

  return topColor.mul(a).add(botColor.mul(1 - a));
}

/**
 * Determines if a ray touches a sphere
 * @param {Vec3} center
 * @param {number} radius
 * @param {Ray} ray
 * @returns {number} t where the ray touches the sphere or -1
 */
function hitSphere(center, radius, ray) {
  const oc = Vec3.sub(center, ray.origin);
  const a = Vec3.dot(ray.dir, ray.dir);
  const b = -2 * Vec3.dot(ray.dir, oc);
  const c = Vec3.dot(oc, oc) - radius * radius;
  const discriminant = b * b - 4 * a * c;

  if (discriminant < 0) {
    return -1;
  }

  return (-b - Math.sqrt(discriminant)) / (2 * a);
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

    const pixelColor = rayColor(ray);

    // const pixel = new Vec3(i / (imageWidth - 1), j / (imageHeight - 1), 0);

    process.stdout.write(`${pixelColor.toColorString()}\n`);
  }
}

process.stderr.write("\rFin.                    \n");
