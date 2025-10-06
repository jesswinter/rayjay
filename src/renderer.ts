import { Vec3, tupleToVec3 } from "./vec";
import { EntityList } from "./entity-list";
import { Sphere } from "./sphere";
import { Camera } from "./camera";
import { Lambertian, Metal, Dielectric, type Material } from "./material";
import type { TfWorld, TfMaterial } from "./transmission-format";
import { createTfDemoScene } from "./scenes";

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

export function render(
  renderTarget: ImageData,
  onUpdated: RenderUpdatedCallback,
) {
  const tfWorld = createTfDemoScene();
  const world = createWorldFromTf(tfWorld);

  const camera = new Camera();
  camera.samplesPerPixel = 100;
  camera.maxDepth = 50;

  camera.vertFov = 20; // 90
  camera.lookFrom = new Vec3(13, 2, 3);
  camera.lookAt = new Vec3(0, 0, 0);
  camera.viewUp = new Vec3(0, 1, 0);

  camera.defocusAngle = 0.6;
  camera.focusDist = 10;

  camera.render(renderTarget, world, onUpdated);
}
