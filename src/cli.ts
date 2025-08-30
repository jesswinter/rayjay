import { Vec3 } from "./vec3.js";
import { EntityList } from "./entity-list.js";
import { Sphere } from "./sphere.js";
import { Camera } from "./camera.js";

// World
const world = new EntityList();
world.add(new Sphere(new Vec3(0, 0, -1), 0.5));
world.add(new Sphere(new Vec3(0, -100.5, -1), 100));

const camera = new Camera();
camera.samplesPerPixel = 100;
camera.maxDepth = 50;
camera.render(world);
