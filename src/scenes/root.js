import * as Phaser from "phaser";
import * as NOAA from "../weather/noaa";
import * as Audio from "../audio";

export default class RootScene extends Phaser.Scene {
  constructor() {
    console.log("RootScene", "constructor()");
    super({ key: "Boot" });

    this.lastUpdateTime = 0;
    this.initialText = "Loading...";
  }

  preload() {
    console.log("RootScene", "preload()");

    // LOADING TEXT
    this.loadingText = this.make.text({
      text: this.initialText,
      x: 360,
      y: 450,
      style: {
        font: "30px monospace",
        fill: "#ffffff",
      },
    });
    this.loadingText.setOrigin(0.5, 0.5);

    // ANIMALS
    this.load.image("striper", "sprites/fish/striper_small.png");
    this.load.image("plankton", "sprites/plankton/plankton_small_white.png");
    this.load.image("kelpBall", "sprites/kelp/green_ball.png");
    this.load.image("urchin", "sprites/urchin/urchin_small.png");

    // LOCATION
    const dropTitleEl = document.getElementById("dropTitle");
    this.load.on("complete", async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const location = urlParams.get("location");
      console.log("GameScene", "preload()", { location });

      const curr = "Location: ";
      let LOCATION;
      switch (location) {
        case "arena-ca":
          LOCATION = `${curr}Arena Cove, CA`;
          break;
        case "diego-ca":
          LOCATION = `${curr}San Diego Bay, CA`;
          break;
        case "neah":
          LOCATION = `${curr}Neah Bay, WA`;
          break;
        case "king":
          LOCATION = `${curr}King Cove, AK`;
          break;
        default:
          LOCATION = `${curr}Arena Cove, CA`;
      }
      dropTitleEl.innerText = LOCATION;

      const WEATHER_DATA = await NOAA.getGeoPosition(location);
      await Audio.initialize(WEATHER_DATA);
      console.log("GameScene", "preload()", {
        WEATHER_DATA: this.WEATHER_DATA,
      });

      this.scene.start("Game", WEATHER_DATA);
    });
    this.load.start();
  }
}
