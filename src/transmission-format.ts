import type { V3Tuple } from "./vec3";
import type { Color3Tuple } from "./color3";

export type TfWorld = {
  entities: TfEntity[];
};

export type TfMaterial = TfLambertian | TfDielectric | TfMetal;

export type TfLambertian = {
  type: "lambertian";
  albedo: Color3Tuple;
};

export type TfDielectric = {
  type: "dielectric";
  refractionIndex: number;
};
export type TfMetal = {
  type: "metal";
  albedo: Color3Tuple;
  fuzz: number;
};

// Note: TfEntity is only sphere for now, but TfEntity should be a union of all
// implemented shapes when more are added.
export type TfEntity = TfSphere;

export type TfSphere = {
  type: "sphere";
  center: V3Tuple;
  radius: number;
  material: TfMaterial;
};
