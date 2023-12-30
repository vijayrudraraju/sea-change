import { colorGeneratorFactory } from "./lib/color";
import * as Types from "./lib/types";

const { innerWidth: windowWidth, innerHeight: windowHeight } = window;
const PIXEL_RADIUS = 4;
const GRID_RADIUS = 3;

export const consoleConfig = {
  joystick: { circle: null, width: 260 },
  buttons: { rectangle: null, width: 230 },
  game: {
    name: "Arrangaata",
    cards: [
      {
        name: "Welcome to no thing",
        text: "Nooo... no thing! No thing.",
        entities: [
          {
            key: "maEntity",
            pixelLayout: Types.PixelLayout.RANDOM,
            pixelJitterAmount: 2,
            pixelShapes: [new Phaser.Geom.Ellipse(600, 400, 200, 230)],
            pixelColorizer: colorGeneratorFactory({
              r: { low: 70, high: 85 },
              g: { low: 140, high: 155 },
              b: { low: 140, high: 155 },
            }),
          },
          {
            key: "littleEntity",
            pixelLayout: Types.PixelLayout.RANDOM,
            pixelJitterAmount: 2,
            pixelShapes: [new Phaser.Geom.Ellipse(400, 300, 100, 100)],
            pixelColorizer: colorGeneratorFactory({
              r: { low: 140, high: 155 },
              g: { low: 70, high: 85 },
              b: { low: 140, high: 155 },
            }),
          },
        ],
      },
      {
        name: "I and you",
        entities: [
          {
            key: "maEntity",
            pixelLayout: Types.PixelLayout.RANDOM,
            pixelJitterAmount: 2,
            pixelShapes: [new Phaser.Geom.Ellipse(600, 400, 100, 230)],
            pixelColorizer: colorGeneratorFactory({
              r: { low: 70, high: 85 },
              g: { low: 140, high: 155 },
              b: { low: 140, high: 155 },
            }),
          },
          {
            key: "littleEntity",
            pixelLayout: Types.PixelLayout.RANDOM,
            pixelJitterAmount: 2,
            pixelShapes: [new Phaser.Geom.Ellipse(400, 300, 100, 100)],
            pixelColorizer: colorGeneratorFactory({
              r: { low: 140, high: 155 },
              g: { low: 70, high: 85 },
              b: { low: 140, high: 155 },
            }),
          },
        ],
      },
      {
        name: "A thing",
        entities: [],
      },
      {
        name: "I have a thing",
        entities: [],
      },
    ],
    screen: {
      width: windowWidth - 520,
      height: windowHeight - 20,
      pixelColorizer: colorGeneratorFactory({
        r: { low: 10, high: 25 },
        g: { low: 70, high: 85 },
        b: { low: 140, high: 155 },
      }),
      pixelRadius: PIXEL_RADIUS,
      pixels: [],
      numPixelColumns: (windowWidth - 520) / (3 * 2),
      numPixelRows: (windowHeight - 20) / (3 * 2),
      gridRadius: GRID_RADIUS,
      rectangle: null,
      text: null,
    },
  },
};
