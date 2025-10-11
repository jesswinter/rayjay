import { type Vec3 } from "./vec";

export class Camera {
  cameraCenter: Vec3 = [0, 0, 0];
  samplesPerPixel = 10;
  maxDepth = 10;

  vertFov = 90;
  lookFrom: Vec3 = [0, 0, 0];
  lookAt: Vec3 = [0, 0, -1];
  viewUp: Vec3 = [0, 1, 0];

  defocusAngle = 0;
  focusDist = 10;
}
