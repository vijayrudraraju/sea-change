require("../arrangaata.html");

import * as Phaser from "phaser";
import * as Screen from "./lib/screen";
import * as Types from "./lib/types";
import * as UI from "./lib/ui";
import { consoleConfig } from "./config";

const { innerWidth: windowWidth, innerHeight: windowHeight } = window;

export default class Main extends Phaser.Scene {
  cardIndex: number = 0;

  console: Types.Console = consoleConfig;

  constructor() {
    super("demo");
  }

  preload() {}

  getCurrentCard() {
    return this.console.game.cards[this.cardIndex];
  }

  getEntities() {
    return this.getCurrentCard().entities;
  }

  clearEntities() {
    this.getCurrentCard().entities.forEach((entity) => {
      entity.pixels?.forEach((pixel) => pixel.destroy());
      entity.pixels = [];
    });
  }

  clicker() {
    console.log("clicker");
    this.clearEntities();
    this.cardIndex = (this.cardIndex + 1) % this.console.game.cards.length;
    console.log("cardIndex", this.cardIndex);
  }

  create() {
    // Initialize Console UI
    UI.initializeConsoleUI(this.console, this, () => this.clicker());

    // Initialize pixel GameObjects
    Screen.initializeScreenPixels(this.console, this);

    // Prose
    this.console.game.screen.text = this.add.text(100, 200, "", {
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
    Screen.updateText(this.console, this.getCurrentCard().text);
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
