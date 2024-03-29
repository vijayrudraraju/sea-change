import * as Types from "./types";

const DEBUG = 0;

const { innerWidth: windowWidth, innerHeight: windowHeight } = window;

export function initializeConsoleUI(
  console: Types.Console,
  scene: Phaser.Scene,
  callback: () => void
) {
  // Buttons
  console.buttons.rectangle = addButtonsContainer(console, scene);

  // Joystick
  console.joystick.circle = addJoystickContainer(console, scene);

  // Screen
  console.game.screen.rectangle = addScreenContainer(console, scene, callback);

  // Debug Axis
  if (DEBUG) {
    addDebugAxisLines(scene);
  }
}

function addButtonsContainer(console: Types.Console, scene: Phaser.Scene) {
  const { width: buttonWidth } = console.buttons;

  return scene.add.rectangle(
    windowWidth - buttonWidth / 2 - 25,
    windowHeight / 2,
    buttonWidth,
    windowHeight - 40,
    Phaser.Display.Color.GetColor(95, 95, 255)
  );
}

function addJoystickContainer(console: Types.Console, scene: Phaser.Scene) {
  const { width: joystickWidth } = console.joystick;

  return scene.add.ellipse(
    joystickWidth / 2,
    windowHeight - joystickWidth / 2 - 20,
    joystickWidth,
    joystickWidth,
    Phaser.Display.Color.GetColor(195, 110, 175)
  );
}

function addScreenContainer(
  cons: Types.Console,
  scene: Phaser.Scene,
  callback: () => void
) {
  const { width: screenWidth, height: screenHeight } = cons.game.screen;

  const screenContainer = scene.add.rectangle(
    windowWidth / 2,
    windowHeight / 2,
    screenWidth,
    screenHeight,
    Phaser.Display.Color.GetColor(10, 70, 140)
  );

  screenContainer.setInteractive();
  screenContainer.on("pointerdown", () => {
    console.log("pointerdown");
    callback();
  });

  return screenContainer;
}

function addDebugAxisLines(scene: Phaser.Scene) {
  scene.add.line(
    windowWidth / 2,
    windowHeight / 2,
    0,
    0,
    windowWidth,
    0,
    0x000000
  );
  scene.add.line(
    windowWidth / 2,
    windowHeight / 2,
    0,
    0,
    0,
    windowHeight,
    0x000000
  );
}
