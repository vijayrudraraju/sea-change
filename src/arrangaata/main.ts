require("../arrangaata.html");

import * as Phaser from "phaser";

const { innerWidth: width, innerHeight: height } = window;

interface Screen {
  width: number;
  height: number;
  pixels: Phaser.GameObjects.Ellipse[][];
  numPixelColumns: number;
  numPixelRows: number;
  pixelRadius: number;
  rectangle: Phaser.GameObjects.Rectangle | null;
}

interface Joystick {
  circle: Phaser.GameObjects.Ellipse | null;
  width: number;
}

interface Buttons {
  rectangle: Phaser.GameObjects.Rectangle | null;
  width: number;
}

interface Entity {
  gameObject: Phaser.GameObjects.GameObject;
  pixels: Phaser.GameObjects.Ellipse[];
}

interface Game {
  entities: Entity[];
}

interface Console {
  screen: Screen;
  joystick: Joystick;
  buttons: Buttons;
  game: Game;
}

function generateBackgroundColor() {
  const r = Phaser.Math.Between(0, 25);
  const g = Phaser.Math.Between(70, 85);
  const b = Phaser.Math.Between(120, 155);

  return Phaser.Display.Color.GetColor(r, g, b);
}

function generateCircleColor() {
  const r = Phaser.Math.Between(120, 155);
  const g = Phaser.Math.Between(70, 85);
  const b = Phaser.Math.Between(120, 155);

  return Phaser.Display.Color.GetColor(r, g, b);
}

function generateEllipseColor() {
  const r = Phaser.Math.Between(70, 85);
  const g = Phaser.Math.Between(120, 155);
  const b = Phaser.Math.Between(120, 155);

  return Phaser.Display.Color.GetColor(r, g, b);
}

export default class Demo extends Phaser.Scene {
  console: Console = {
    screen: {
      width: 0,
      height: 0,
      pixels: [],
      numPixelColumns: 0,
      numPixelRows: 0,
      pixelRadius: 0,
      rectangle: null,
    },
    joystick: { circle: null, width: 0 },
    buttons: { rectangle: null, width: 0 },
    game: { entities: [] },
  };

  constructor() {
    super("demo");
  }

  preload() {}

  generateCoordsForPixel(i: number, j: number) {
    const x =
      width / 2 -
      this.console.screen.width / 2 +
      i * this.console.screen.pixelRadius * 2 +
      this.console.screen.pixelRadius +
      Phaser.Math.Between(-2, 2);
    const y =
      this.console.screen.pixelRadius +
      j * this.console.screen.pixelRadius * 2 +
      Phaser.Math.Between(-2, 2);

    return { x, y };
  }

  create() {
    // Buttons
    const buttonWidth = 220;
    this.console.buttons.width = buttonWidth;
    this.console.buttons.rectangle = this.add.rectangle(
      width - buttonWidth / 2 - 40,
      height / 2,
      buttonWidth,
      height - 40,
      0x6666ff
    );

    // Joystick
    const joystickWidth = 260;
    this.console.joystick.width = joystickWidth;
    this.console.joystick.circle = this.add.ellipse(
      joystickWidth / 2,
      height - joystickWidth / 2 - 20,
      joystickWidth,
      joystickWidth,
      0xc175ac
    );

    // Screen
    const screenWidth = width - 520;
    const screenHeight = height - 20;
    this.console.screen.width = screenWidth;
    this.console.screen.height = screenHeight;
    this.console.screen.rectangle = this.add.rectangle(
      width / 2,
      screenHeight / 2,
      screenWidth,
      screenHeight,
      0x262829
    );

    // Pixel config
    const circleRadius = 4;
    this.console.screen.pixelRadius = circleRadius;
    this.console.screen.numPixelColumns = screenWidth / (circleRadius * 2);
    this.console.screen.numPixelRows = screenHeight / (circleRadius * 2);

    // Initialize pixels
    for (let j = 0; j < this.console.screen.numPixelRows; j++) {
      this.console.screen.pixels.push([]);
      for (let i = 0; i < this.console.screen.numPixelColumns; i++) {
        const { x, y } = this.generateCoordsForPixel(i, j);
        const newPixel = this.add.ellipse(
          x,
          y,
          circleRadius * 2,
          circleRadius * 2,
          0xffffff
        );
        // newPixel.setData({ })
        this.console.screen.pixels[j].push(newPixel);
      }
    }

    // Debug Axis
    this.add.line(width / 2, height / 2, 0, 0, width, 0, 0x000000);
    this.add.line(width / 2, height / 2, 0, 0, 0, height, 0x000000);
  }

  update(time: number, delta: number): void {
    const randomSets: Phaser.GameObjects.Ellipse[][] = [[], []];

    // Iterate through all pixels
    for (let j = 0; j < this.console.screen.numPixelRows; j++) {
      for (let i = 0; i < this.console.screen.numPixelColumns; i++) {
        this.console.screen.pixels[j][i].setFillStyle(
          generateBackgroundColor()
        );

        const { x, y } = this.generateCoordsForPixel(i, j);
        this.console.screen.pixels[j][i].setPosition(x, y);

        // if ((i * j) % 40 === 0) randomSet.push(this.screen.pixels[j][i]);
        if (Phaser.Math.Between(0, 25) % 25 === 0) {
          randomSets[0].push(this.console.screen.pixels[j][i]);

          this.console.screen.pixels[j][i].setFillStyle(generateCircleColor());
        } else if (Phaser.Math.Between(0, 15) % 15 === 0) {
          randomSets[1].push(this.console.screen.pixels[j][i]);

          this.console.screen.pixels[j][i].setFillStyle(generateEllipseColor());
        }
      }
    }

    Phaser.Actions.RandomEllipse(
      randomSets[0],
      new Phaser.Geom.Ellipse(400, 300, 100, 100)
    );

    Phaser.Actions.RandomEllipse(
      randomSets[1],
      new Phaser.Geom.Ellipse(600, 400, 200, 100)
    );
  }
}

console.log(`Phaser.VERSION: ${Phaser.VERSION}`);
console.log(`arrangaata`, { width, height });

const config = {
  type: Phaser.AUTO,
  backgroundColor: 0x005157,
  width: width - 20,
  height: height - 20,
  scene: Demo,
  fps: {
    target: 12,
    forceSetTimeOut: true,
  },
};

new Phaser.Game(config);
