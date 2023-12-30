require("../arrangaata.html");

import * as Phaser from "phaser";
import * as Screen from "./lib/screen";
import * as Types from "./lib/types";
import {
  // addDebugAxisLines,
  generateButtonsContainer,
  generateJoystickContainer,
  generateScreenContainer,
} from "./lib/ui";

const { innerWidth: windowWidth, innerHeight: windowHeight } = window;

export default class Main extends Phaser.Scene {
  console: Types.Console = {
    screen: {
      width: windowWidth - 520,
      height: windowHeight - 20,
      pixels: [],
      numPixelColumns: (windowWidth - 520) / (3 * 2),
      numPixelRows: (windowHeight - 20) / (3 * 2),
      pixelRadius: 4,
      gridRadius: 3,
      rectangle: null,
    },
    joystick: { circle: null, width: 260 },
    buttons: { rectangle: null, width: 230 },
    game: { entities: [] },
  };

  constructor() {
    super("demo");
  }

  preload() {}

  addEntity(entity: Types.Entity) {
    this.console.game.entities.push(entity);
  }

  buildEntityFromConfig() {}

  create() {
    // Buttons
    this.console.buttons.rectangle = generateButtonsContainer(
      this.console,
      this
    );

    // Joystick
    this.console.joystick.circle = generateJoystickContainer(
      this.console,
      this
    );

    // Screen
    this.console.screen.rectangle = generateScreenContainer(this.console, this);

    // Initialize pixel GameObjects
    Screen.initializeScreenPixels(this.console, this);

    // Debug Axis
    // addDebugAxisLines(this);
  }

  update(time: number, delta: number): void {
    const randomSets = Screen.updateScreenPixels(this.console);

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
