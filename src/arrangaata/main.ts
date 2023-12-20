require("../arrangaata.html");

import * as Phaser from "phaser";

const { innerWidth: width, innerHeight: height } = window;

export default class Demo extends Phaser.Scene {
  pixels: Phaser.GameObjects.Ellipse[][] = [];
  numPixelColumns = 0;
  numPixelRows = 0;
  pixelRadius = 0;
  screenWidth = 0;
  screenHeight = 0;

  constructor() {
    super("demo");

    // this.graphics = this.add.graphics();
  }

  preload() {
    /*
    this.load.image("logo", "assets/phaser3-logo.png");
    this.load.image("libs", "assets/libs.png");
    this.load.glsl("bundle", "assets/plasma-bundle.glsl.js");
    this.load.glsl("stars", "assets/starfields.glsl.js");
    */
  }

  create() {
    // this.graphics = this.add.graphics();

    // this.add.triangle(200, 200, 0, 148, 148, 148, 74, 0, 0x6666ff);

    // Origin is the center of the object
    /*
    this.add.triangle(
      200,
      200, // origin x, y
      0,
      100, // bottom left pt
      100,
      100, // bottom right pt
      0,
      500, // top left pt
      Phaser.Display.Color.GetColor(20, 30, 140)
    );
    */

    // Buttons
    const buttonWidth = 220;
    this.add.rectangle(
      width - buttonWidth / 2 - 40,
      height / 2,
      buttonWidth,
      height - 40,
      0x6666ff
    );

    // Joystick
    const joystickWidth = 260;
    this.add.ellipse(
      joystickWidth / 2,
      height - joystickWidth / 2 - 20,
      joystickWidth,
      joystickWidth,
      0xc175ac
    );

    // Screen
    const screenWidth = width - 520;
    const screenHeight = height - 20;
    this.screenWidth = screenWidth;
    this.screenHeight = screenHeight;
    this.add.rectangle(
      width / 2,
      screenHeight / 2,
      screenWidth,
      screenHeight,
      0x262829
    );

    // Pixels
    const circleRadius = 4;
    this.pixelRadius = circleRadius;
    this.numPixelColumns = screenWidth / (circleRadius * 2);
    this.numPixelRows = screenHeight / (circleRadius * 2);

    for (let j = 0; j < this.numPixelRows; j++) {
      this.pixels.push([]);
      for (let i = 0; i < this.numPixelColumns; i++) {
        const x =
          width / 2 - screenWidth / 2 + i * circleRadius * 2 + circleRadius;
        const y = circleRadius + j * circleRadius * 2;
        this.pixels[j].push(
          this.add.ellipse(x, y, circleRadius * 2, circleRadius * 2, 0xffffff)
        );
      }
    }

    // Axis
    this.add.line(width / 2, height / 2, 0, 0, width, 0, 0x000000);
    this.add.line(width / 2, height / 2, 0, 0, 0, height, 0x000000);

    // this.add.shader("RGB Shift Field", 0, 0, 800, 600).setOrigin(0);
    // this.add.shader("Plasma", 0, 412, 800, 172).setOrigin(0);
    // this.add.image(400, 300, "libs");
    // const logo = this.add.image(400, 70, "logo");
    /*
    this.tweens.add({
      targets: logo,
      y: 350,
      duration: 1500,
      ease: "Sine.inOut",
      yoyo: true,
      repeat: -1,
    });
    */
  }

  update(time: number, delta: number): void {
    // if (time % 5000 < 10) console.log(`update`, { time, delta });

    // if (time % 1000 < 900) return;

    for (let j = 0; j < this.numPixelRows; j++) {
      for (let i = 0; i < this.numPixelColumns; i++) {
        const r = Phaser.Math.Between(0, 35);
        const g = Phaser.Math.Between(0, 35);
        const b = Phaser.Math.Between(0, 135);

        const color = Phaser.Display.Color.GetColor(r, g, b);
        this.pixels[j][i].setFillStyle(color);

        const x =
          width / 2 -
          this.screenWidth / 2 +
          i * this.pixelRadius * 2 +
          this.pixelRadius +
          Phaser.Math.Between(-4, 4);
        const y =
          this.pixelRadius +
          j * this.pixelRadius * 2 +
          Phaser.Math.Between(-4, 4);
        this.pixels[j][i].setPosition(x, y);
      }
    }
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
    target: 15,
    forceSetTimeOut: true,
  },
};

new Phaser.Game(config);
