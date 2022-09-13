/*
GRAY AREA WORKSHOPS:
1. https://www.youtube.com/watch?v=LSyOUl4J3Do&feature=youtu.be
2. https://www.youtube.com/watch?v=om7OkImeDDE&feature=youtu.be

/*
BASICS:
https://gamedevacademy.org/phaser-3-tutorial/
https://phaser.io/phaser3/contributing/part5
GAME LOOP:
https://phaser.io/phaser3/contributing/part7
ASSETS:
https://www.kenney.nl/assets
UI:
https://rexrainbow.github.io/phaser3-rex-notes/docs/site/ui-textbox/
TWEENS:
https://rexrainbow.github.io/phaser3-rex-notes/docs/site/ease-function/
https://labs.phaser.io/edit.html?src=src\tweens\multiple%20targets%20multiple%20properties.js
https://github.com/photonstorm/phaser/blob/v3.22.0/src/tweens/builders/NumberTweenBuilder.js
GROUPS:
https://phaser.io/examples/v3/view/game-objects/group/sprite-pool
FOLLOWERS:
https://phaser.io/examples/v3/view/paths/followers/basic-follower
ANIMATION:
https://phaser.io/examples/v3/view/animation/texture-atlas-animation
PHYSICS:
https://phaser.io/examples/v3/view/physics/matterjs/chain
https://phaser.io/examples/v3/view/physics/matterjs/thrust
*/

require("./index.html");

import * as Phaser from "phaser";
import * as Music from "./music";
import RootScene from "./scenes/root";
import GameScene from "./scenes/game";

let BAR = 0;
let BEAT = 0;
let SIXT = 0;

const GAME_CONFIG = {
  title: "Sea Change",

  type: Phaser.AUTO,

  width: 720,
  height: 900,

  // http://labs.phaser.io/view.html?src=src/physics/matterjs/debug%20options.js
  physics: {
    default: "matter",
    matter: {
      gravity: {
        y: -0.3,
      },
      debug: {
        showBody: false,
        showStaticBody: false,
      },
    },
  },

  parent: "game",
  backgroundColor: Phaser.Display.Color.GetColor(20, 30, 140),

  scene: [RootScene, GameScene],
};

export const game = new Phaser.Game(GAME_CONFIG);

document.getElementById("arena-ca").addEventListener("click", () => {
  console.log("arena-ca");
  window.location.href = `${window.location.pathname}?location=arena-ca`;
});
document.getElementById("diego-ca").addEventListener("click", () => {
  console.log("diego-ca");
  window.location.href = `${window.location.pathname}?location=diego-ca`;
});
document.getElementById("neah").addEventListener("click", () => {
  console.log("neah");
  window.location.href = `${window.location.pathname}?location=neah`;
});
document.getElementById("king").addEventListener("click", () => {
  console.log("king");
  window.location.href = `${window.location.pathname}?location=king`;
});
