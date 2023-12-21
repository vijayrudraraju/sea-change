require("../arrangaata.html");

import * as Phaser from "phaser";

const { innerWidth: windowWidth, innerHeight: windowHeight } = window;

interface Screen {
  width: number;
  height: number;
  pixels: Phaser.GameObjects.Ellipse[][];
  numPixelColumns: number;
  numPixelRows: number;
  pixelRadius: number;
  gridRadius: number;
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
  const r = Phaser.Math.Between(10, 25);
  const g = Phaser.Math.Between(70, 85);
  const b = Phaser.Math.Between(140, 155);

  return Phaser.Display.Color.GetColor(r, g, b);
}

function generateCircleColor() {
  const r = Phaser.Math.Between(140, 155);
  const g = Phaser.Math.Between(70, 85);
  const b = Phaser.Math.Between(140, 155);

  return Phaser.Display.Color.GetColor(r, g, b);
}

function generateEllipseColor() {
  const r = Phaser.Math.Between(70, 85);
  const g = Phaser.Math.Between(140, 155);
  const b = Phaser.Math.Between(140, 155);

  return Phaser.Display.Color.GetColor(r, g, b);
}

export default class Demo extends Phaser.Scene {
  console: Console = {
    screen: {
      width: windowWidth - 520,
      height: windowHeight - 20,
      pixels: [],
      numPixelColumns: 0,
      numPixelRows: 0,
      pixelRadius: 4,
      gridRadius: 3,
      rectangle: null,
    },
    joystick: { circle: null, width: 260 },
    buttons: { rectangle: null, width: 220 },
    game: { entities: [] },
  };

  constructor() {
    super("demo");
  }

  preload() {}

  generateCoordsForPixel(i: number, j: number) {
    const { gridRadius, width } = this.console.screen;

    const x =
      windowWidth / 2 -
      width / 2 +
      i * gridRadius * 2 +
      gridRadius +
      Phaser.Math.Between(-1, 1);
    const y = gridRadius + j * gridRadius * 2 + Phaser.Math.Between(-1, 1);

    return { x, y };
  }

  create() {
    // Buttons
    const { width: buttonWidth } = this.console.buttons;
    this.console.buttons.rectangle = this.add.rectangle(
      windowWidth - buttonWidth / 2 - 40,
      windowHeight / 2,
      buttonWidth,
      windowHeight - 40,
      0x6666ff
    );

    // Joystick
    const { width: joystickWidth } = this.console.joystick;
    this.console.joystick.circle = this.add.ellipse(
      joystickWidth / 2,
      windowHeight - joystickWidth / 2 - 20,
      joystickWidth,
      joystickWidth,
      0xc175ac
    );

    // Screen
    const { width: screenWidth, height: screenHeight } = this.console.screen;
    this.console.screen.rectangle = this.add.rectangle(
      windowWidth / 2,
      screenHeight / 2,
      screenWidth,
      screenHeight,
      Phaser.Display.Color.GetColor(10, 70, 140)
    );

    // Pixel config
    const { pixelRadius, gridRadius } = this.console.screen;
    this.console.screen.numPixelColumns = screenWidth / (gridRadius * 2);
    this.console.screen.numPixelRows = screenHeight / (gridRadius * 2);

    // Initialize pixels
    for (let j = 0; j < this.console.screen.numPixelRows; j++) {
      this.console.screen.pixels.push([]);
      for (let i = 0; i < this.console.screen.numPixelColumns; i++) {
        const { x, y } = this.generateCoordsForPixel(i, j);
        const newPixel = this.add.ellipse(
          x,
          y,
          pixelRadius * 2,
          pixelRadius * 2,
          0xffffff
        );
        // newPixel.setData({ })
        this.console.screen.pixels[j].push(newPixel);
      }
    }

    // Initialize

    // Debug Axis
    this.add.line(
      windowWidth / 2,
      windowHeight / 2,
      0,
      0,
      windowWidth,
      0,
      0x000000
    );
    this.add.line(
      windowWidth / 2,
      windowHeight / 2,
      0,
      0,
      0,
      windowHeight,
      0x000000
    );
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
console.log(`arrangaata`, { width: windowWidth, height: windowHeight });

const config = {
  type: Phaser.AUTO,
  backgroundColor: 0x005157,
  width: windowWidth - 20,
  height: windowHeight - 20,
  scene: Demo,
  fps: {
    target: 10,
    forceSetTimeOut: true,
  },
};

new Phaser.Game(config);
