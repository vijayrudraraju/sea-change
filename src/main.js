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

require('./index.html')

import * as Phaser from 'phaser'
import * as Audio from './audio'
import * as NOAA from './weather/noaa'

const COLOR_PRIMARY = 0x4e342e
const COLOR_LIGHT = 0x7b5e57
const COLOR_DARK = 0x260e04
const COLOR_RED = 0xff0000
const COLOR_GREEN = 0x00ff00

const GetValue = Phaser.Utils.Objects.GetValue

let BAR = 0
let BEAT = 0
let SIXT = 0
let HOUR = 12
let LOCATION = 'Location: Arena Cove, CA'

export class GameScene extends Phaser.Scene {
    constructor() {
        console.log('GameScene', 'constructor()')
        const sceneConfig = {
            active: false,
            visible: false,
            key: 'Game',
        }

        super(sceneConfig)

        this.CANVAS_WIDTH = 720
        this.CANVAS_HEIGHT = 900

        this.updateCount = 0
        this.playing = false

        this.skyOdd = []
        this.skyEven = []

        // Animals
        this.stripers = null
        this.planktons = null
        this.kelp = []
        this.urchins = []

        // GLOBAL
        this.WEATHER_DATA = { wind: { knots: null, direction: null } }

        // Tweens
        this.lastUrchin = null
        this.lastUrchinIndex = 0
        this.lastUrchinTween = null
        this.lastKelpIndex = 0

        // Waves
        this.waves = null
        this.waveTweens = null
    }

    init(initData) {
        this.WEATHER_DATA = initData
    }

    preload() {
        this.CANVAS_WIDTH = this.scale.width
        this.CANVAS_HEIGHT = this.scale.height

        console.log('GameScene', 'preload()', { canvasWidth: this.CANVAS_WIDTH, canvasHeight: this.CANVAS_HEIGHT })

        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });
        this.load.plugin(
            'rexhexagonplugin',
            'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexhexagonplugin.min.js',
            true
        );
    }

    async create() {
        console.log('GameScene', 'create()')

        Audio.setScene(game)

        console.log('GameScene', {
            textures: this.textures,
            cache: this.cache,
            width: this.scale.width,
            height: this.scale.height
        })

        this.graphics = this.add.graphics()

        // NATURE
        this.createWorld()
    }

    createWorld() {
        this.createSky()
        this.createWaves()

        // UI
        this.createStatusBox()

        // ANIMALS
        this.createStripers()
        this.createPlanktons()
        this.createKelp()
        this.createUrchins()

        // this.createPaths()
    }

    audioEvent(bar, beat, sixt, lead, bass, metal, fm) {
        BAR = bar
        BEAT = beat
        SIXT = sixt

        this.btn.setText(this.createTextString(this.playing))

        if (bass) {
            if (this.lastUrchinTween && this.lastUrchinTween.stop) {
                this.lastUrchinTween.stop()
                this.lastUrchin.scale = 0.5
            }
            this.lastUrchin = this.urchins[this.lastUrchinIndex % this.urchins.length]
            this.lastUrchinTween = this.tweens.add({
                targets: this.lastUrchin,
                ease: 'Sine',
                duration: 100,
                repeat: 0,
                scale: 1.8,
                yoyo: true,
                delay: 0
            })
            this.lastUrchinIndex++
        }

        if (lead) {
            this.kelp[this.lastKelpIndex % this.kelp.length][(BAR % 8) + 2].thrust(0.017)
            this.lastKelpIndex++
        }

        if (fm) {
            if (this.waveTweens) {
                this.waveTweens.forEach(val => {
                    val.seek(0)
                })
            }

            if (!this.waveTweens) {
                this.waveTweens = []
                const waveSwell = this.WEATHER_DATA.wind.knots
                this.waves.forEach(val => {
                    this.waveTweens.push(this.tweens.add({
                        targets: val,
                        x: (val.x + this.CANVAS_WIDTH * 1.6),
                        y: 320,
                        ease: 'Sine',
                        duration: 4000 - (waveSwell * 10),
                        yoyo: false,
                        repeat: 0,
                        delay: 0
                    }));
                })
            }
        }

        const oddCycle = [
            0x5595af,
            0x66a4bf,
            0x759f99,
            0x336faa,
        ]

        if (SIXT === 0) {
            this.skyOdd.forEach((val, idx) => {
                this.skyOdd[idx]
                    .fillStyle(oddCycle[BEAT % 4])
                this.skyOdd[idx].fillPath()
            })

            this.skyEven.forEach((val, idx) => {
                this.skyEven[idx]
                    .fillStyle(oddCycle[(BEAT + 2) % 4])
                this.skyEven[idx].fillPath()
            })
        }
    }

    createButton(text) {
        const COLOR_LIGHT = 0x7b5e57
        const COLOR_DARK = 0x260e04

        return this.rexUI.add.label({
            background: this.rexUI.add.roundRectangle(0, 0, 0, 0, 10).setStrokeStyle(2, COLOR_LIGHT),
            icon: this.add.circle(0, 0, 10).setStrokeStyle(1, COLOR_DARK).setFillStyle(COLOR_RED),
            text: this.add.text(0, 0, text, {
                fontSize: 18
            }),
            space: {
                left: 10, right: 10, top: 10, bottom: 10,
                icon: 10
            },
            align: 'center',
            name: text,
            width: 300
        });
    }

    createStatusBox() {
        const today = new Date();
        const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        HOUR = today.getHours()
        const time = HOUR + ":" + today.getMinutes();
        const dateTime = date + ' ' + time;
        const contents = [
            `${LOCATION}\n`,
            `${dateTime}\n`,
            `Water Level\t\t${this.WEATHER_DATA.waterLevel} ft`,
            `Water Temp\t\t\t${this.WEATHER_DATA.waterTemperature} F`,
            //`Air Pressure\t${this.WEATHER_DATA.airPressure} mbar`,
            //`Air Temp\t\t\t\t\t${this.WEATHER_DATA.airTemperature} F`,
            `Wind\t\t\t\t\t\t\t\t\t${this.WEATHER_DATA.wind.knots} knots ${this.WEATHER_DATA.wind.direction}`
        ]
        const content = contents.join('\n')
        const textbox = this.createTextBox(10, 10, {
            wrapWidth: 500,
            icon: null,
            iconMask: false
        }).start(content, 10)
        this.add.existing(textbox)

        const COLOR_PRIMARY = 0x4e342e
        const background = this.rexUI.add.roundRectangle(0, 0, 0, 0, 10, COLOR_PRIMARY)
        this.btn = this.createButton(this.createTextString(false))
        var buttons = this.rexUI.add.fixWidthButtons({
            x: 550, y: 30,
            width: 300,
            background: background,
            buttons: [this.btn],
            space: {
                line: 10, item: 10
            }
        })
            .layout()
        buttons.on('button.click', () => {
            console.log('CLICK', this)
            if (!this.playing) {
                Audio.start()
                this.playing = true
                this.btn.setText(
                    this.createTextString(true)
                ).getElement('icon').setFillStyle(COLOR_GREEN)
            } else {
                Audio.pause()
                this.playing = false
                this.btn.setText(
                    this.createTextString(false)
                ).getElement('icon').setFillStyle(COLOR_RED)
            }
        });
    }

    createTextString(playing) {
        return playing ?
            `Playing\t\t${BAR}\t:\t${BEAT}\t:\t${SIXT}` :
            `Paused\t\t\t${BAR}\t:\t${BEAT}\t:\t${SIXT}`
    }

    createSky() {
        const HEX_RADIUS = 30

        const createHexagon = (x, y) => {
            let hexagon = this.plugins.get('rexhexagonplugin').add({
                x: (x * HEX_RADIUS * Math.sqrt(3)),
                y: (y * HEX_RADIUS * 3),
                size: HEX_RADIUS,
                orientationType: 0
            })
            let points = hexagon.points
            // draw shape on a Graphics object
            var graphics = this.add.graphics()
                .fillStyle(0x55a5ff)
                .fillPoints(points, true)
                .lineStyle(2, 0xffffff)
                .strokePoints(points, true)
                // set hit area
                .setInteractive(hexagon, Phaser.Geom.Polygon.Contains);

            return graphics
        }

        const createOffsetHexagon = (x, y) => {
            let hexagon = this.plugins.get('rexhexagonplugin').add({
                x: (HEX_RADIUS * Math.sqrt(3) / 2) + (x * HEX_RADIUS * Math.sqrt(3)),
                y: (HEX_RADIUS * 3 / 2) + (y * HEX_RADIUS * 3),
                size: HEX_RADIUS,
                orientationType: 0
            })
            let points = hexagon.points
            // draw shape on a Graphics object
            var graphics = this.add.graphics()
                .fillStyle(0x75a5ff)
                .fillPoints(points, true)
                .lineStyle(2, 0xffffff)
                .strokePoints(points, true)
                // set hit area
                .setInteractive(hexagon, Phaser.Geom.Polygon.Contains);
            return graphics
        }

        this.skyOdd = []
        this.skyEven = []
        for (let j = 0; j < 3; j++) {
            for (let i = 0; i < this.CANVAS_WIDTH / HEX_RADIUS; i++) {
                this.skyOdd.push(createHexagon(i, j))
            }
        }

        for (let j = 0; j < 3; j++) {
            for (let i = 0; i < this.CANVAS_WIDTH / HEX_RADIUS; i++) {
                this.skyEven.push(createOffsetHexagon(i, j))
            }
        }
    }

    createWaves() {
        var NUM_WAVES = 10
        // console.log(NUM_WAVES)
        const directionBool = Phaser.Math.Between(0, 1)
        const direction = directionBool == 0 ? -1 : 1
        this.waves = []
        this.wavesX = []
        for (let i = 1; i < NUM_WAVES; i++) {
            let waveX = (Math.random() + 1) * 3
            let waveY = 3
            this.waves.push(this.createWave(waveX, 3, direction))
        }
    }

    createWave(x, y, direction) {
        //console.log(x)
        //console.log(waveSwell)
        let xStart = -400 * Math.random()
        this.wavesX.push(xStart)
        let height = 160
        var triangle = this.add.triangle(
            xStart, 250, // origin x, y
            -350, height, // bottom left pt
            100, height, // bottom right pt
            0, 0, // top left pt
            Phaser.Display.Color.GetColor(0, 0, 100));
        return triangle
    }

    createTextBox(x, y, config) {
        const wrapWidth = GetValue(config, 'wrapWidth', 0);
        const fixedWidth = GetValue(config, 'fixedWidth', 0);
        const fixedHeight = GetValue(config, 'fixedHeight', 0);

        const textBox = this.rexUI.add.textBox({
            x: x,
            y: y,
            background: this.rexUI.add.roundRectangle(0, 0, 2, 2, 20, COLOR_PRIMARY)
                .setStrokeStyle(2, COLOR_LIGHT),
            icon: null,
            text: this.getBuiltInText(wrapWidth, fixedWidth, fixedHeight),
            space: {
                left: 20,
                right: 20,
                top: 20,
                bottom: 20,
                icon: 10,
                text: 10,
            }
        })
            .setOrigin(0)
            .layout();

        return textBox;
    }

    getBuiltInText(wrapWidth, fixedWidth, fixedHeight) {
        return this.add.text(0, 0, '', {
            fontSize: '16px',
            wordWrap: {
                width: wrapWidth
            },
            maxLines: 10
        })
            .setFixedSize(fixedWidth, fixedHeight);
    }

    /*
    createPaths() {
        let randomStartY = 200 + (600 * Math.random())
        var fishStartX = -500
        var fishEndX = this.scale.width + 500
 
        this.path = new Phaser.Curves.Path(fishStartX, randomStartY);
        var maxSteps = 8;
        let lastYStep = randomStartY
        let fishX = 0
        for (var i = 0; i < maxSteps; i++) {
            let randomHeightStep = 20 * Math.random()
            fishX += 200 * Math.random()
            this.path.lineTo(fishX, randomHeightStep + lastYStep)
        }
        this.path.lineTo(fishEndX, lastYStep);
        console.log('createPaths()', 'this.path', this.path)
    }
    */

    createStripers() {
        const striperFreneticism = (this.WEATHER_DATA.waterLevel * 1)
        const NUM_STRIPERS = Number(((this.WEATHER_DATA.waterTemperature / 100) + 5).toFixed())
        // console.log(striperFreneticism)
        // console.log(NUM_WAVES, waveSwell)


        let width = this.scale.width
        let height = this.scale.height
        //  Create the path stripers
        // Groups can be initialized with a GroupConfig OR GroupCreateConfig
        this.stripers = this.add.group({
            defaultKey: 'striper',
            //repeat: NUM_STRIPERS,
            maxSize: NUM_STRIPERS,
            createCallback: (striper) => {
                striper.setData('normalizedSpeed', 0.001)
                striper.setData('initX', striper.x)
                striper.setData('initY', striper.y)
                striper.scale = 0.6

                const directionBool = Phaser.Math.Between(0, 1)
                console.log('directionBool', directionBool)
                const direction = directionBool == 0 ? -1 : 1
                striper.flipX = directionBool == 0 ? true : false

                this.tweens.add({
                    targets: striper,
                    x: (10 * striperFreneticism) * direction,
                    duration: 3000 + (100 * striperFreneticism),
                    ease: 'Sine',
                    hold: Phaser.Math.Between(0, 5 * striperFreneticism),
                    yoyo: true,
                    flipX: true,
                    repeat: -1,
                    delay: 100 * striperFreneticism / 100
                })
            },
            removeCallback: () => { },
        })

        // Keep maxSize number of Stripers on the screen
        this.time.addEvent({
            delay: 200,
            loop: true,
            callback: () => {
                this.stripers.get(
                    Phaser.Math.Between(10, this.CANVAS_WIDTH - 10),
                    Phaser.Math.Between(300, this.CANVAS_HEIGHT - 100)
                )
            }
        })
    }

    createPlanktons() {
        const NUM_PLANKTONS = 100
        this.planktons = this.add.group({
            defaultKey: 'plankton',
            maxSize: NUM_PLANKTONS,
            createCallback: (plankton) => {
                plankton.setData('normalizedSpeed', 0.001)
                plankton.setData('initX', plankton.x)
                plankton.setData('initY', plankton.y)
                plankton.setTint(Phaser.Display.Color.RandomRGB().color)
                plankton.scale = 0.1
                this.tweens.add({
                    targets: plankton,
                    x: plankton.x + 10,
                    y: plankton.y + 10,
                    scale: -0.1,
                    duration: 2000,
                    ease: 'Power2',
                    yoyo: true,
                    repeat: -1,
                    delay: 100
                });
            },
            removeCallback: () => { },
        })

        // Keep maxSize number of Stripers on the screen
        this.time.addEvent({
            delay: 100,
            loop: true,
            callback: () => {
                this.planktons.get(
                    Phaser.Math.Between(10, this.CANVAS_WIDTH - 10),
                    Phaser.Math.Between(300, this.CANVAS_HEIGHT - 100)
                )
            }
        })
    }

    createKelp() {
        const NUM_KELP = 5
        const KELP_SEGMENT_LENGTH = 60
        const KELP_SEGMENT_NUM = 10

        this.kelp = []

        console.log('createKelp()')

        let x = 0

        for (let j = 0; j < NUM_KELP; j++) {
            // New Kelp Chain
            this.kelp.push([])

            let y = 0
            x = ((j * (this.CANVAS_WIDTH / NUM_KELP)) + Phaser.Math.Between(0, (this.CANVAS_WIDTH / NUM_KELP)))
            const thisKelp = this.kelp[j]
            thisKelp.push(this.matter.add.image(x, 900, 'kelpBall', null, {
                shape: 'circle',
                ignoreGravity: true,
                friction: 100,
                frictionStatic: 200000,
                density: 10000
            }))

            y += KELP_SEGMENT_LENGTH
            let prev = thisKelp[0]
            for (let i = 0; i < KELP_SEGMENT_NUM; i++) {
                thisKelp.push(this.matter.add.image(x, 900 - y, 'kelpBall', null, {
                    shape: 'circle',
                    mass: 1
                }))
                this.matter.add.joint(prev, thisKelp[i + 1], KELP_SEGMENT_LENGTH, 0.4, {
                    render: {
                        lineColor: 0x009f33
                    }
                })
                prev = thisKelp[i + 1]
                y += KELP_SEGMENT_LENGTH
            }
        }

        // this.matter.add.mouseSpring();
    }

    createUrchins() {
        const NUM_URCHINS = 5
        this.urchins = []

        let x = 0
        const y = this.CANVAS_HEIGHT - 10;

        for (let i = 0; i < NUM_URCHINS; i++) {
            x = ((i * (this.CANVAS_WIDTH / NUM_URCHINS)) + Phaser.Math.Between(0, (this.CANVAS_WIDTH / NUM_URCHINS)))
            this.urchins.push(this.add.image(x, y, 'urchin'))
            this.urchins[i].scale = 0.5
            /*
            this.tweens.add({
                targets: this.urchins[i],
                ease: 'Sine',
                duration: 2000,
                repeat: -1,
                scale: 1,
                yoyo: true,
                delay: i * 500
            })
            */
        }
    }
}

export class RootScene extends Phaser.Scene {
    constructor() {
        console.log('RootScene', 'constructor()')
        super({ key: 'Boot' })
    }

    preload() {
        console.log('RootScene', 'preload()')

        const loadingText = this.make.text({
            text: 'Loading...',
            x: 360,
            y: 450,
            style: {
                font: '30px monospace',
                fill: '#ffffff'
            }
        })
        loadingText.setOrigin(0.5, 0.5)

        // ANIMALS
        this.load.image('striper', 'sprites/fish/striper_small.png')
        this.load.image('plankton', 'sprites/plankton_small_white.png')
        this.load.image('kelpBall', 'https://labs.phaser.io/assets/sprites/green_ball.png')
        this.load.image('urchin', 'sprites/urchin_small.png')


        this.load.image('nextPage', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/assets/images/arrow-down-left.png')

        const dropTitleEl = document.getElementById('dropTitle')
        this.load.on('complete', async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const location = urlParams.get('location');
            console.log('GameScene', 'preload()', { location })

            const curr = 'Location: '
            switch (location) {
                case 'arena-ca':
                    LOCATION = `${curr}Arena Cove, CA`
                    break
                case 'diego-ca':
                    LOCATION = `${curr}San Diego Bay, CA`
                    break
                case 'neah':
                    LOCATION = `${curr}Neah Bay, WA`
                    break
                case 'king':
                    LOCATION = `${curr}King Cove, AK`
                    break
                default:
                    LOCATION = `${curr}Arena Cove, CA`
            }
            dropTitleEl.innerText = LOCATION

            const WEATHER_DATA = await NOAA.getGeoPosition(location)
            await Audio.initialize(WEATHER_DATA)
            console.log('GameScene', 'preload()', { WEATHER_DATA: this.WEATHER_DATA })

            this.scene.start('Game', WEATHER_DATA)
        })
        this.load.start()
    }
}

const gameConfig = {
    title: 'Sample',

    type: Phaser.AUTO,

    width: 720,
    height: 900,

    /*
    scale: {
        width: 720 || window.innerWidth,
        height: 950 || window.innerHeight,
    },
    */

    physics: {
        default: 'matter',
        matter: {
            gravity: {
                y: -0.3
            },
            debug: {
                showBody: true,
                showStaticBody: true
            },
        },
    },

    parent: 'game',
    backgroundColor: Phaser.Display.Color.GetColor(0, 0, 100),

    scene: [RootScene, GameScene],
};

export const game = new Phaser.Game(gameConfig);

document.getElementById('arena-ca').addEventListener('click', () => {
    console.log('arena-ca')
    window.location.href = `${window.location.pathname}?location=arena-ca`
})
document.getElementById('diego-ca').addEventListener('click', () => {
    console.log('diego-ca')
    window.location.href = `${window.location.pathname}?location=diego-ca`
})
document.getElementById('neah').addEventListener('click', () => {
    console.log('neah')
    window.location.href = `${window.location.pathname}?location=neah`
})
document.getElementById('king').addEventListener('click', () => {
    console.log('king')
    window.location.href = `${window.location.pathname}?location=king`
})
