import type { V3Tuple } from "./vec";
import { v3Length, v3Sub } from "./vec";
import { c3Mul, c3Random, c3RandomComponentRange } from "./color3";
import { randomRange } from "./utils";
import type { TfWorld } from "./transmission-format";

export function createTfDemoScene(): TfWorld {
  const world: TfWorld = {
    entities: [
      {
        type: "sphere",
        center: [0, -1000, 0],
        radius: 1000,
        material: {
          type: "lambertian",
          albedo: [0.8, 0.8, 0],
        },
      },
      {
        type: "sphere",
        center: [0, 1, 0],
        radius: 1,
        material: {
          type: "dielectric",
          refractionIndex: 1.5,
        },
      },
      {
        type: "sphere",
        center: [-4, 1, 0],
        radius: 1,
        material: {
          type: "lambertian",
          albedo: [0.4, 0.2, 0.1],
        },
      },
      {
        type: "sphere",
        center: [4, 1, 0],
        radius: 1,
        material: {
          type: "metal",
          albedo: [0.7, 0.6, 0.5],
          fuzz: 0,
        },
      },
    ],
  };

  const offset: V3Tuple = [4, 0.2, 0];
  for (let a = -11; a < 11; ++a) {
    for (let b = -11; b < 11; ++b) {
      const chooseMat = Math.random();
      const center: V3Tuple = [
        a + 0.9 * Math.random(),
        0.2,
        b + 0.9 * Math.random(),
      ];

      if (v3Length(v3Sub(center, offset)) > 0.9) {
        if (chooseMat < 0.8) {
          const albedo = c3Mul(c3Random(), c3Random());
          world.entities.push({
            type: "sphere",
            center,
            radius: 0.2,
            material: {
              type: "lambertian",
              albedo,
            },
          });
        } else if (chooseMat < 0.95) {
          const albedo = c3RandomComponentRange(0.5, 1);
          world.entities.push({
            type: "sphere",
            center,
            radius: 0.2,
            material: {
              type: "metal",
              albedo,
              fuzz: randomRange(0, 0.5),
            },
          });
        } else {
          world.entities.push({
            type: "sphere",
            center,
            radius: 0.2,
            material: {
              type: "dielectric",
              refractionIndex: 1.5,
            },
          });
        }
      }
    }
  }

  return world;
}
