import { Vec3 } from "./vec3.js";
import { HittableList } from "./hittable-list.js";
import { Sphere } from "./sphere.js";
import { Camera } from "./camera.js";

// World
const world = new HittableList();
world.add(new Sphere(new Vec3(0, 0, -1), 0.5));
world.add(new Sphere(new Vec3(0, -100.5, -1), 100));

const camera = new Camera();
camera.render(world);
