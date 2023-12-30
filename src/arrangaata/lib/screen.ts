import { GameObjects } from "phaser";
import * as Types from "./types";

const { innerWidth: windowWidth } = window;

export function addPixels(
  num: number,
  pixelRadius: number,
  scene: Phaser.Scene
) {
  const pixels: Types.Pixel[] = [];

  for (let i = 0; i < num; i++) {
    const newPixel = scene.add.ellipse(
      0,
      0,
      pixelRadius * 2,
      pixelRadius * 2,
      0xffffff
    );

    pixels.push(newPixel);
  }

  return pixels;
}

export function generateCoordsForPixel(
  i: number,
  j: number,
  console: Types.Console
) {
  const { gridRadius, width } = console.game.screen;

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
  const { pixelRadius } = console.game.screen;

  for (let j = 0; j < console.game.screen.numPixelRows; j++) {
    console.game.screen.pixels.push([]);
    for (let i = 0; i < console.game.screen.numPixelColumns; i++) {
      const { x, y } = generateCoordsForPixel(i, j, console);
      const newPixel = scene.add.ellipse(
        x,
        y,
        pixelRadius * 2,
        pixelRadius * 2,
        0xffffff
      );
      console.game.screen.pixels[j].push(newPixel);
    }
  }
}

export function updateScreenPixels(console: Types.Console) {
  const randomSets: Types.Pixel[][] = [[], []];

  // Iterate through all pixels
  for (let j = 0; j < console.game.screen.numPixelRows; j++) {
    for (let i = 0; i < console.game.screen.numPixelColumns; i++) {
      // Randomly choose a color for each pixel, from a configured set of colors
      console.game.screen.pixels[j][i].setFillStyle(
        console.game.screen.pixelColorizer()
      );

      // Randomly nudge pixels
      const { x, y } = generateCoordsForPixel(i, j, console);
      console.game.screen.pixels[j][i].setPosition(x, y);
    }
  }

  return randomSets;
}

export function updateEntity(
  entity: Types.Entity,
  pixelRadius: number,
  scene: Phaser.Scene
) {
  if (!entity.pixels || !entity.pixels.length) {
    entity.pixels = addPixels(1200, pixelRadius, scene);
  }

  entity.pixels.forEach((pixel) => {
    pixel.setFillStyle(entity.pixelColorizer());
  });

  const pixels = entity.pixels as GameObjects.GameObject[];

  entity.pixelShapes.forEach((shape) => {
    // console.log("DEBUG", entity.key, shape.type === Phaser.Geom.ELLIPSE);
    switch (shape.type) {
      case Phaser.Geom.CIRCLE:
        Phaser.Actions.RandomCircle(pixels, shape as Phaser.Geom.Circle);
        break;
      case Phaser.Geom.ELLIPSE:
        Phaser.Actions.RandomEllipse(pixels, shape as Phaser.Geom.Ellipse);
        break;
      case Phaser.Geom.RECTANGLE:
        Phaser.Actions.RandomRectangle(pixels, shape as Phaser.Geom.Rectangle);
        break;
      case Phaser.Geom.LINE:
        Phaser.Actions.RandomLine(pixels, shape as Phaser.Geom.Line);
        break;
      case Phaser.Geom.TRIANGLE:
        Phaser.Actions.RandomTriangle(pixels, shape as Phaser.Geom.Triangle);
        break;
      default:
        break;
    }
  });
}

export function updateText(console: Types.Console, text: string) {
  console.game.screen.text?.setText(text);
}
