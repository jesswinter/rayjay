import { Vec3 } from "./vec3.js";
import { EntityList } from "./entity-list.js";
import { Sphere } from "./sphere.js";
import { Camera } from "./camera.js";
import { Lambertian, Metal, Dielectric } from "./material.js";
import { Color3 } from "./color3.js";

// Materials
const groundMaterial = new Lambertian(new Color3(0.8, 0.8, 0));
const centerMaterial = new Lambertian(new Color3(0.1, 0.2, 0.5));
const leftMaterial = new Dielectric(1.5);
const bubbleMaterial = new Dielectric(1 / 1.5);
const rightMaterial = new Metal(new Color3(0.8, 0.6, 0.2), 1.0);

// World
const world = new EntityList();
world.add(new Sphere(new Vec3(0, -100.5, -1), 100, groundMaterial));
world.add(new Sphere(new Vec3(0, 0, -1.2), 0.5, centerMaterial));
world.add(new Sphere(new Vec3(-1, 0, -1), 0.5, leftMaterial));
world.add(new Sphere(new Vec3(-1, 0, -1), 0.4, bubbleMaterial));
world.add(new Sphere(new Vec3(1, 0, -1), 0.5, rightMaterial));

// Camera
const camera = new Camera();

camera.aspectRatio = 16.0 / 9.0;
camera.imageWidth = 400;
camera.samplesPerPixel = 100;
camera.maxDepth = 50;

// camera.vertFov = 90;
camera.vertFov = 20;
camera.lookFrom = new Vec3(-2, 2, 1);
camera.lookAt = new Vec3(0, 0, -1);
camera.viewUp = new Vec3(0, 1, 0);

camera.defocusAngle = 10;
camera.focusDist = 3.4;

camera.render(world);
