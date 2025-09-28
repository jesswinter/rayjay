import { Vec3 } from "./vec3";
import { EntityList } from "./entity-list";
import { Sphere } from "./sphere";
import { Camera } from "./camera";
import { Lambertian, Metal, Dielectric } from "./material";
import { Color3 } from "./color3";
import { randomRange } from "./utils";

export type RenderStatusCallback = (status: string) => void;

export function render(
  renderTarget: ImageData,
  statusCallback: RenderStatusCallback,
) {
  const groundMaterial = new Lambertian(new Color3(0.8, 0.8, 0));

  // World
  const world = new EntityList();
  world.add(new Sphere(new Vec3(0, -1000, 0), 1000, groundMaterial));

  const offset = new Vec3(4, 0.2, 0);
  for (let a = -11; a < 11; ++a) {
    for (let b = -11; b < 11; ++b) {
      const chooseMat = Math.random();
      const center = new Vec3(
        a + 0.9 * Math.random(),
        0.2,
        b + 0.9 * Math.random(),
      );

      if (Vec3.sub(center, offset).length > 0.9) {
        if (chooseMat < 0.8) {
          const color = Color3.mul(Color3.random(), Color3.random());
          const material = new Lambertian(color);
          world.add(new Sphere(center, 0.2, material));
        } else if (chooseMat < 0.95) {
          const color = Color3.randomComponentRange(0.5, 1);
          const fuzz = randomRange(0, 0.5);
          const material = new Metal(color, fuzz);
          world.add(new Sphere(center, 0.2, material));
        } else {
          const material = new Dielectric(1.5);
          world.add(new Sphere(center, 0.2, material));
        }
      }
    }
  }

  const material1 = new Dielectric(1.5);
  world.add(new Sphere(new Vec3(0, 1, 0), 1.0, material1));

  const material2 = new Lambertian(new Color3(0.4, 0.2, 0.1));
  world.add(new Sphere(new Vec3(-4, 1, 0), 1.0, material2));

  const material3 = new Metal(new Color3(0.7, 0.6, 0.5), 0);
  world.add(new Sphere(new Vec3(4, 1, 0), 1, material3));

  const camera = new Camera();
  camera.samplesPerPixel = 100;
  camera.maxDepth = 50;

  camera.vertFov = 20; // 90
  camera.lookFrom = new Vec3(13, 2, 3);
  camera.lookAt = new Vec3(0, 0, 0);
  camera.viewUp = new Vec3(0, 1, 0);

  camera.defocusAngle = 0.6;
  camera.focusDist = 10;

  camera.render(renderTarget, world, statusCallback);
}
