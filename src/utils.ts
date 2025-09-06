export function degreesToRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/** Generates a random number r where min <= r < max */
export function randomRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}
