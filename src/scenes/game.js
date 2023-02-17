import * as Phaser from "phaser";
import * as Audio from "../audio";
import * as UI from "../ui";

const audioEvent = (scene, lead, bass, metal, fm) => {
  const { BAR, BEAT, SIXT } = scene.getMusicalCount();
  scene.btn.setText(UI.createTextString(scene.playing, { BAR, BEAT, SIXT }));

  if (bass) {
    if (scene.lastUrchinTween && scene.lastUrchinTween.stop) {
      scene.lastUrchinTween.stop();
      scene.lastUrchin.scale = 0.5;
    }
    scene.lastUrchin =
      scene.urchins[scene.lastUrchinIndex % scene.urchins.length];
    scene.lastUrchinTween = scene.tweens.add({
      targets: scene.lastUrchin,
      ease: "Sine",
      duration: 100,
      repeat: 0,
      scale: 1.8,
      yoyo: true,
      delay: 0,
    });
    scene.lastUrchinIndex++;
  }

  if (lead) {
    scene.kelp[scene.lastKelpIndex % scene.kelp.length][(BAR % 8) + 2].thrust(
      0.027
    );
    scene.lastKelpIndex++;
  }

  if (metal) {
    const waterLevel = scene.WEATHER_DATA.waterLevel;
    if (scene.striperReverse) {
      scene.striperTweens.forEach((val) => {
        val.stop();
      });
      scene.striperTweens = [];

      scene.stripers.getChildren().forEach((val) => {
        const toX = val.getData("startingX");
        val.flipX = !val.flipX;
        scene.striperTweens.push(
          scene.tweens.add({
            targets: val,
            x: toX,
            duration: 500 + 100 * waterLevel,
            ease: "Sine",
            hold: Phaser.Math.Between(0, 5 * waterLevel),
            yoyo: false,
            flipX: false,
            repeat: 0,
            delay: 0,
          })
        );
      });
      scene.striperReverse = !scene.striperReverse;
    } else {
      scene.striperTweens = [];
      scene.stripers.getChildren().forEach((val) => {
        const toX =
          val.getData("startingX") +
          10 *
            waterLevel *
            val.getData("moveAmount") *
            val.getData("direction");
        val.flipX = !val.flipX;
        scene.striperTweens.push(
          scene.tweens.add({
            targets: val,
            x: toX,
            duration: 500 + 100 * waterLevel,
            ease: "Sine",
            //hold: Phaser.Math.Between(0, 5 * waterLevel),
            yoyo: false,
            flipX: false,
            repeat: 0,
            delay: 0,
          })
        );
      });
      scene.striperReverse = !scene.striperReverse;
    }
  }

  if (fm) {
    if (scene.waveTweens) {
      scene.waveTweens.forEach((val) => {
        val.seek(0);
      });
    }

    if (!scene.waveTweens) {
      scene.waveTweens = [];
      const waveSwell = scene.WEATHER_DATA.wind.knots;
      scene.waves.forEach((val) => {
        scene.waveTweens.push(
          scene.tweens.add({
            targets: val,
            x: val.x + scene.CANVAS_WIDTH * 1.6,
            y: 300,
            ease: "Sine",
            duration: 4000 - waveSwell * 10,
            yoyo: false,
            repeat: 0,
            delay: 0,
          })
        );
      });
    }
  }

  const oddCycle = [0x5595af, 0x66a4bf, 0x759f99, 0x336faa];

  if (SIXT === 0) {
    scene.skyOdd.forEach((val, idx) => {
      scene.skyOdd[idx].fillStyle(oddCycle[BEAT % 4]);
      scene.skyOdd[idx].fillPath();
    });

    scene.skyEven.forEach((val, idx) => {
      scene.skyEven[idx].fillStyle(oddCycle[(BEAT + 2) % 4]);
      scene.skyEven[idx].fillPath();
    });
  }
};

export default class GameScene extends Phaser.Scene {
  constructor() {
    console.log("GameScene", "constructor()");
    const sceneConfig = {
      active: false,
      visible: false,
      key: "Game",
    };

    super(sceneConfig);

    this.CANVAS_WIDTH = 720;
    this.CANVAS_HEIGHT = 900;

    this.updateCount = 0;
    this.playing = false;

    this.skyOdd = [];
    this.skyEven = [];

    // Animals
    this.stripers = null;
    this.planktons = null;
    this.kelp = [];
    this.urchins = [];

    // GLOBAL
    this.WEATHER_DATA = { wind: { knots: null, direction: null } };

    // Tweens
    this.striperTweens = null;
    this.waveTweens = null;
    this.striperReverse = false;

    this.lastUrchin = null;
    this.lastUrchinIndex = 0;
    this.lastUrchinTween = null;
    this.lastKelpIndex = 0;

    // Waves
    this.waves = null;

    this.barIndex = 0;
    this.beatIndex = 0;
    this.sixtIndex = 0;
  }

  init(initData) {
    console.log("GameScene", "init()", { initData });
    this.WEATHER_DATA = initData;
  }

  preload() {
    this.CANVAS_WIDTH = this.scale.width;
    this.CANVAS_HEIGHT = this.scale.height;

    console.log("GameScene", "preload()", {
      canvasWidth: this.CANVAS_WIDTH,
      canvasHeight: this.CANVAS_HEIGHT,
    });

    this.load.scenePlugin({
      key: "rexuiplugin",
      url: "https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js",
      sceneKey: "rexUI",
    });
    this.load.plugin(
      "rexhexagonplugin",
      "https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexhexagonplugin.min.js",
      true
    );
  }

  async create() {
    Audio.setScene(this, audioEvent);

    console.log("GameScene", "create()", {
      textures: this.textures,
      cache: this.cache,
      width: this.scale.width,
      height: this.scale.height,
    });

    this.graphics = this.add.graphics();

    // GRAPHICS
    this.createWorld();

    // UI
    let LOCATION = "Location: Arena Cove, CA";
    UI.createStatusBox(this, Audio, LOCATION);
  }

  getMusicalCount() {
    return {
      BAR: this.barIndex,
      BEAT: this.beatIndex,
      SIXT: this.sixtIndex,
    };
  }

  setMusicalCount(bar, beat, sixt) {
    this.barIndex = bar;
    this.beatIndex = beat;
    this.sixtIndex = sixt;
  }

  createWorld() {
    // ENVIRONMENT
    this.createSky();
    this.createWaves();

    // ANIMALS
    this.createStripers();
    this.createPlanktons();
    this.createKelp();
    this.createUrchins();
  }

  createSky() {
    const HEX_RADIUS = 30;

    const createHexagon = (x, y) => {
      let hexagon = this.plugins.get("rexhexagonplugin").add({
        x: x * HEX_RADIUS * Math.sqrt(3),
        y: y * HEX_RADIUS * 3,
        size: HEX_RADIUS,
        orientationType: 0,
      });
      let points = hexagon.points;
      // draw shape on a Graphics object
      var graphics = this.add
        .graphics()
        .fillStyle(0x55a5ff)
        .fillPoints(points, true)
        .lineStyle(2, 0xffffff)
        .strokePoints(points, true);
      // set hit area
      //.setInteractive(hexagon, Phaser.Geom.Polygon.Contains);

      return graphics;
    };

    const createOffsetHexagon = (x, y) => {
      let hexagon = this.plugins.get("rexhexagonplugin").add({
        x: (HEX_RADIUS * Math.sqrt(3)) / 2 + x * HEX_RADIUS * Math.sqrt(3),
        y: (HEX_RADIUS * 3) / 2 + y * HEX_RADIUS * 3,
        size: HEX_RADIUS,
        orientationType: 0,
      });
      let points = hexagon.points;
      // draw shape on a Graphics object
      var graphics = this.add
        .graphics()
        .fillStyle(0x75a5ff)
        .fillPoints(points, true)
        .lineStyle(2, 0xffffff)
        .strokePoints(points, true);
      // set hit area
      //.setInteractive(hexagon, Phaser.Geom.Polygon.Contains);
      return graphics;
    };

    this.skyOdd = [];
    this.skyEven = [];
    for (let j = 0; j < 3; j++) {
      for (let i = 0; i < this.CANVAS_WIDTH / HEX_RADIUS; i++) {
        this.skyOdd.push(createHexagon(i, j));
      }
    }

    for (let j = 0; j < 3; j++) {
      for (let i = 0; i < this.CANVAS_WIDTH / HEX_RADIUS; i++) {
        this.skyEven.push(createOffsetHexagon(i, j));
      }
    }
  }

  createWaves() {
    var NUM_WAVES = 10;

    this.waves = [];
    this.wavesX = [];

    for (let i = 1; i < NUM_WAVES; i++) {
      let xStart = -400 * Math.random();
      this.wavesX.push(xStart);
      this.waves.push(this.createWave(xStart));
    }
    console.log("createWave()", { wavesX: this.wavesX, NUM_WAVES });
  }

  createWave(xStart) {
    return this.add.triangle(
      xStart,
      200, // origin x, y
      -350,
      100, // bottom left pt
      100,
      100, // bottom right pt
      0,
      0, // top left pt
      Phaser.Display.Color.GetColor(20, 30, 140)
    );
  }

  createStripers() {
    const NUM_STRIPERS = Number(
      (this.WEATHER_DATA.waterTemperature / 100 + 5).toFixed()
    );

    console.log("createStripers()", { NUM_STRIPERS });

    // Groups can be initialized with a GroupConfig OR GroupCreateConfig
    this.stripers = this.add.group({
      defaultKey: "striper",
      //repeat: NUM_STRIPERS,
      maxSize: NUM_STRIPERS,
      createCallback: (striper) => {
        striper.setTint(Phaser.Display.Color.RandomRGB(160, 240).color);
        striper.scale = 0.6;

        //const directionBool = Phaser.Math.Between(0, 1)
        //const direction = directionBool == 0 ? -1 : 1
        //striper.flipX = directionBool == 0 ? true : false
        const randomBool = Phaser.Math.Between(0, 1);
        const direction = randomBool ? -1 : 1;
        striper.flipX = !randomBool;
        striper.setData("direction", direction);
        striper.setData("startingX", striper.x);
        striper.setData("moveAmount", Phaser.Math.Between(3, 7));

        console.log("createStripers()", {
          randomBool,
          direction,
          flipX: striper.flipX,
          x: striper.x,
          y: striper.y,
        });
      },
      removeCallback: () => {},
    });

    // Keep maxSize number of Stripers on the screen
    this.time.addEvent({
      delay: 100,
      repeat: 10,
      loop: false,
      callback: () => {
        this.stripers.get(
          Phaser.Math.Between(10, this.CANVAS_WIDTH - 10),
          Phaser.Math.Between(300, this.CANVAS_HEIGHT - 100)
        );
      },
    });
  }

  createPlanktons() {
    const NUM_PLANKTONS = 100;
    this.planktons = this.add.group({
      defaultKey: "plankton",
      maxSize: NUM_PLANKTONS,
      createCallback: (plankton) => {
        plankton.setTint(Phaser.Display.Color.RandomRGB().color);
        plankton.scale = 0.1;
        this.tweens.add({
          targets: plankton,
          x: plankton.x + 10,
          y: plankton.y + 10,
          scale: -0.1,
          duration: 2000,
          ease: "Power2",
          yoyo: true,
          repeat: -1,
          delay: 100,
        });
      },
      removeCallback: () => {},
    });

    // Keep maxSize number of Stripers on the screen
    this.time.addEvent({
      delay: 100,
      loop: true,
      callback: () => {
        this.planktons.get(
          Phaser.Math.Between(10, this.CANVAS_WIDTH - 10),
          Phaser.Math.Between(300, this.CANVAS_HEIGHT - 100)
        );
      },
    });
  }

  createKelp() {
    const NUM_KELP = 5;
    const KELP_SEGMENT_LENGTH = 60;
    const KELP_SEGMENT_NUM = 10;

    this.kelp = [];

    console.log("createKelp()");

    let x = 0;

    for (let j = 0; j < NUM_KELP; j++) {
      // New Kelp Chain
      this.kelp.push([]);

      let y = 0;
      x =
        j * (this.CANVAS_WIDTH / NUM_KELP) +
        Phaser.Math.Between(0, this.CANVAS_WIDTH / NUM_KELP);
      const thisKelp = this.kelp[j];
      thisKelp.push(
        this.matter.add.image(x, 900, "kelpBall", null, {
          shape: "circle",
          ignoreGravity: true,
          friction: 100,
          frictionStatic: 200000,
          density: 30000,
        })
      );

      y += KELP_SEGMENT_LENGTH;
      let prev = thisKelp[0];
      for (let i = 0; i < KELP_SEGMENT_NUM; i++) {
        thisKelp.push(
          this.matter.add
            .image(x, 900 - y, "kelpBall", null, {
              shape: "circle",
              mass: 1,
            })
            .setAlpha(0.6)
        );
        this.matter.add.joint(prev, thisKelp[i + 1], KELP_SEGMENT_LENGTH, 0.4, {
          render: {
            lineColor: 0x107f53,
            anchorSize: 1,
          },
        });
        prev = thisKelp[i + 1];
        y += KELP_SEGMENT_LENGTH;
      }
    }
  }

  createUrchins() {
    const NUM_URCHINS = 5;
    this.urchins = [];

    let x = 0;
    const y = this.CANVAS_HEIGHT - 10;

    for (let i = 0; i < NUM_URCHINS; i++) {
      x =
        i * (this.CANVAS_WIDTH / NUM_URCHINS) +
        Phaser.Math.Between(0, this.CANVAS_WIDTH / NUM_URCHINS);
      this.urchins.push(this.add.image(x, y, "urchin"));
      this.urchins[i].scale = 0.5;
    }
  }
}
