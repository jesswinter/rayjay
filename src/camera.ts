import { Vec3 } from "./vec";

export class Camera {
  cameraCenter = new Vec3(0, 0, 0);
  samplesPerPixel = 10;
  maxDepth = 10;

  vertFov = 90;
  lookFrom = new Vec3(0, 0, 0);
  lookAt = new Vec3(0, 0, -1);
  viewUp = new Vec3(0, 1, 0);

  defocusAngle = 0;
  focusDist = 10;
}
