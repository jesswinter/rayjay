import { Ray } from "./ray.js";
import { Hit } from "./hit.js";
import { Color3 } from "./color3.js";
import { Vec3 } from "./vec3.js";

export interface Material {
  scatter(ray: Ray, hit: Hit): [Color3, Ray];
}

export class Lambertian implements Material {
  albedo: Color3;

  constructor(albedo: Color3) {
    this.albedo = albedo;
  }

  scatter(ray: Ray, hit: Hit): [Color3, Ray] {
    let scatterDirection = Vec3.randomUnit().add(hit.normal);

    if (scatterDirection.isNearZero()) scatterDirection = hit.normal;

    return [this.albedo, new Ray(hit.contact, scatterDirection)];
  }
}

export class Metal implements Material {
  albedo: Color3;

  constructor(albedo: Color3) {
    this.albedo = albedo;
  }

  scatter(ray: Ray, hit: Hit): [Color3, Ray] {
    let reflected = Vec3.reflect(ray.direction, hit.normal);
    return [this.albedo, new Ray(hit.contact, reflected)];
  }
}
