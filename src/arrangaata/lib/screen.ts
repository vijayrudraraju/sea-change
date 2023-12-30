import * as Color from "./color";
import * as Types from "./types";

const { innerWidth: windowWidth } = window;

export function generateCoordsForPixel(
  i: number,
  j: number,
  console: Types.Console
) {
  const { gridRadius, width } = console.screen;

  const x =
    windowWidth / 2 -
    width / 2 +
    i * gridRadius * 2 +
    gridRadius +
    Phaser.Math.Between(-1, 1);
  const y = gridRadius + j * gridRadius * 2 + Phaser.Math.Between(-1, 1);

  return { x, y };
}

export function initializeScreenPixels(
  console: Types.Console,
  scene: Phaser.Scene
) {
  const { pixelRadius } = console.screen;

  for (let j = 0; j < console.screen.numPixelRows; j++) {
    console.screen.pixels.push([]);
    for (let i = 0; i < console.screen.numPixelColumns; i++) {
      const { x, y } = generateCoordsForPixel(i, j, console);
      const newPixel = scene.add.ellipse(
        x,
        y,
        pixelRadius * 2,
        pixelRadius * 2,
        0xffffff
      );
      console.screen.pixels[j].push(newPixel);
    }
  }
}

export function updateScreenPixels(console: Types.Console) {
  const randomSets: Types.Pixel[][] = [[], []];

  // Iterate through all pixels
  for (let j = 0; j < console.screen.numPixelRows; j++) {
    for (let i = 0; i < console.screen.numPixelColumns; i++) {
      console.screen.pixels[j][i].setFillStyle(Color.generateBackgroundColor());

      const { x, y } = generateCoordsForPixel(i, j, console);
      console.screen.pixels[j][i].setPosition(x, y);

      // if ((i * j) % 40 === 0) randomSet.push(this.screen.pixels[j][i]);
      if (Phaser.Math.Between(0, 25) % 25 === 0) {
        randomSets[0].push(console.screen.pixels[j][i]);

        console.screen.pixels[j][i].setFillStyle(Color.generateCircleColor());
      } else if (Phaser.Math.Between(0, 15) % 15 === 0) {
        randomSets[1].push(console.screen.pixels[j][i]);

        console.screen.pixels[j][i].setFillStyle(Color.generateEllipseColor());
      }
    }
  }

  return randomSets;
}
