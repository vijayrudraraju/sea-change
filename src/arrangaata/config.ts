import { colorGeneratorFactory } from "./lib/color";
import * as Types from "./lib/types";

const { innerWidth: windowWidth, innerHeight: windowHeight } = window;
const PIXEL_RADIUS = 4;
const GRID_RADIUS = 3;

export const entitiesConfig = {
  maEntity: {
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
  littleEntity: {
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
};

export const cardsConfig: Types.Card[] = [
  {
    key: "Welcome to no thing",
    text: ["Nooo... no thing! No thing."],
    entities: [entitiesConfig.maEntity, entitiesConfig.littleEntity],
  },
  {
    key: "I and you",
    text: ["I and you and you and I"],
    entities: [entitiesConfig.maEntity, entitiesConfig.littleEntity],
  },
  {
    key: "A thing",
    entities: [],
  },
  {
    key: "I have a thing",
    entities: [],
  },
];

export const screenConfig: Types.Screen = {
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
};

export const gameConfig: Types.Game = {
  key: "Nothing",
  cards: cardsConfig,
  screen: screenConfig,
};

export const consoleConfig: Types.Console = {
  key: "Arrangaata",
  joystick: { circle: null, width: 260 },
  buttons: { rectangle: null, width: 230 },
  game: gameConfig,
};
