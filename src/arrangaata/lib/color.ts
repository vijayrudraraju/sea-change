import { RgbRange } from "./types";

export function colorGeneratorFactory(rgbRange: RgbRange) {
  return function () {
    const r = Phaser.Math.Between(rgbRange.r.low, rgbRange.r.high);
    const g = Phaser.Math.Between(rgbRange.g.low, rgbRange.g.high);
    const b = Phaser.Math.Between(rgbRange.b.low, rgbRange.b.high);

    return Phaser.Display.Color.GetColor(r, g, b);
  };
}
