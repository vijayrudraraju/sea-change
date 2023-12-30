require("../arrangaata.html");

import * as Phaser from "phaser";
import * as Screen from "./lib/screen";
import * as Types from "./lib/types";
import * as UI from "./lib/ui";
import { colorGeneratorFactory } from "./lib/color";

const { innerWidth: windowWidth, innerHeight: windowHeight } = window;
const PIXEL_RADIUS = 4;
const GRID_RADIUS = 3;

export default class Main extends Phaser.Scene {
  cardIndex: number = 0;

  console: Types.Console = {
    joystick: { circle: null, width: 260 },
    buttons: { rectangle: null, width: 230 },
    game: {
      name: "Arrangaata",
      cards: [
        {
          name: "Welcome to no thing",
          entities: [
            {
              gameObjects: [],
              key: "maEntity",
              pixelLayout: Types.PixelLayout.RANDOM,
              pixelJitterAmount: 2,
              pixels: [],
              pixelShapes: [new Phaser.Geom.Ellipse(600, 400, 200, 230)],
              pixelColorizer: colorGeneratorFactory({
                r: { low: 70, high: 85 },
                g: { low: 140, high: 155 },
                b: { low: 140, high: 155 },
              }),
            },
            {
              gameObjects: [],
              key: "littleEntity",
              pixelLayout: Types.PixelLayout.RANDOM,
              pixelJitterAmount: 2,
              pixels: [],
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
          entities: [],
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
      },
    },
  };

  constructor() {
    super("demo");
  }

  preload() {}

  addEntities(entities: Types.Entity[]) {
    this.console.game.cards[this.cardIndex].entities.push(...entities);
  }

  getEntities() {
    return this.console.game.cards[this.cardIndex].entities;
  }

  create() {
    // Initialize Console UI
    UI.initializeConsoleUI(this.console, this);

    // Initialize pixel GameObjects
    Screen.initializeScreenPixels(this.console, this);

    // Prose
    this.add.text(100, 200, "Nooo... no thing! No thing.", {
      fontFamily: "Arial",
      fontSize: 32,
      color: "#30af80",
    });
  }

  update(time: number, delta: number): void {
    Screen.updateScreenPixels(this.console);
    this.getEntities().forEach((entity) => {
      Screen.updateEntity(entity, this.console.game.screen.pixelRadius, this);
    });
  }
}

// Bootstrapping

console.log(`Phaser.VERSION: ${Phaser.VERSION}`);
console.log(`arrangaata`, { width: windowWidth, height: windowHeight });

const config = {
  type: Phaser.AUTO,
  backgroundColor: Phaser.Display.Color.GetColor(0, 80, 85),
  width: windowWidth - 20,
  height: windowHeight - 20,
  scene: Main,
  fps: {
    target: 8,
    forceSetTimeOut: true,
  },
};

new Phaser.Game(config);
