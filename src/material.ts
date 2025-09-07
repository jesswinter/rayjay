import { Ray } from "./ray.js";
import { Hit } from "./hit.js";
import { Color3 } from "./color3.js";
import { Vec3 } from "./vec3.js";

/**
 * Surface material of an object
 */
export interface Material {
  /**
   * Tries to reflect and scatter a ray off of this surface
   * @param ray The ray that hit the surface
   * @param hit Hit record of where the surface was hit
   * @returns Tuple containing [wasScattered, attenuation color, reflected ray]
   */
  tryScatter(ray: Ray, hit: Hit): [boolean, Color3, Ray];
}

/**
 * Lambertian surface
 */
export class Lambertian implements Material {
  /** Color of the surface */
  albedo: Color3;

  /**
   * @param albedo Color of the surface
   */
  constructor(albedo: Color3) {
    this.albedo = albedo;
  }

  tryScatter(ray: Ray, hit: Hit): [boolean, Color3, Ray] {
    let scatterDirection = Vec3.randomUnit().add(hit.normal);

    if (scatterDirection.isNearZero()) scatterDirection = hit.normal;

    return [true, this.albedo, new Ray(hit.contact, scatterDirection)];
  }
}

/**
 * Metal surface
 */
export class Metal implements Material {
  /** Surface color */
  albedo: Color3;

  /** Fuzzyness of Reflections */
  fuzz: number;

  /**
   * @param albedo The color of the surface
   * @param fuzz Fuzzyness of Reflections
   */
  constructor(albedo: Color3, fuzz: number) {
    this.albedo = albedo;
    this.fuzz = fuzz;
  }

  tryScatter(ray: Ray, hit: Hit): [boolean, Color3, Ray] {
    let reflected = Vec3.reflect(ray.direction, hit.normal);
    reflected.normalize().add(Vec3.randomUnit().mul(this.fuzz));
    const scatteredRay = new Ray(hit.contact, reflected);
    const wasScattered = Vec3.dot(scatteredRay.direction, hit.normal) > 0;
    return [wasScattered, this.albedo, scatteredRay];
  }
}
