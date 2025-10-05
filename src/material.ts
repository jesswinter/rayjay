import { Ray } from "./ray";
import { Hit } from "./hit";
import { type Color3 } from "./color3";
import { Vec3 } from "./vec3";

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
    const reflected = Vec3.reflect(ray.direction, hit.normal);
    reflected.normalize().add(Vec3.randomUnit().mul(this.fuzz));
    const scatteredRay = new Ray(hit.contact, reflected);
    const wasScattered = Vec3.dot(scatteredRay.direction, hit.normal) > 0;
    return [wasScattered, this.albedo, scatteredRay];
  }
}

/** Dielectric surface */
export class Dielectric implements Material {
  /** Refractive index in vacuum or air, or the ratio of the material's
   * refractive index over the refractive index of the enclosing media
   */
  #refractionIndex: number;

  constructor(refractionIndex: number) {
    this.#refractionIndex = refractionIndex;
  }

  tryScatter(ray: Ray, hit: Hit): [boolean, Color3, Ray] {
    const ri = hit.isFrontFace
      ? 1 / this.#refractionIndex
      : this.#refractionIndex;
    const unitDirection = Vec3.unit(ray.direction);
    const cosTheta = Math.min(
      Vec3.dot(Vec3.negate(unitDirection), hit.normal),
      1,
    );
    const sinTheta = Math.sqrt(1 - cosTheta * cosTheta);

    let direction;
    const cannotRefract = ri * sinTheta > 1;
    if (
      cannotRefract ||
      Dielectric.#reflectance(cosTheta, ri) > Math.random()
    ) {
      // cannot refract, so reflect
      direction = Vec3.reflect(unitDirection, hit.normal);
    } else {
      // refract
      direction = Vec3.refract(unitDirection, hit.normal, ri);
    }

    return [true, [1, 1, 1], new Ray(hit.contact, direction)];
  }

  static #reflectance(cosine: number, refractionIndex: number) {
    // Use Schlick's approximation for reflectance.
    let r0 = (1 - refractionIndex) / (1 + refractionIndex);
    r0 = r0 * r0;
    return r0 + (1 - r0) * Math.pow(1 - cosine, 5);
  }
}
