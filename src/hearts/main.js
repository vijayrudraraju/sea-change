/*
AESPRITE:
https://saricden.github.io/aseprite-sprites-in-phaser3-5
*/

require('../hearts.html')

import * as Phaser from 'phaser'

class GameScene extends Phaser.Scene {
    constructor() {
        console.log('GameScene', 'constructor()')
        super('scene-game');
    }

    create() {
        console.log('GameScene', 'create()')

        this.landmass = this.add.sprite(200, 200, 'landmass');
        this.landmass.scaleX = 4
        this.landmass.scaleY = 4
        this.landmass.play({ key: 'main', repeat: -1, yoyo: true });

        this.blob = this.add.sprite(400, 400, 'blob');
        this.blob.play({ key: 'down', repeat: -1 })
        //this.blob.play({ key: 'down', repeat: -1 });
    }
}


export class RootScene extends Phaser.Scene {
    constructor() {
        console.log('RootScene', 'constructor()')
        super({ key: 'Boot' })
    }

    preload() {
        console.log('RootScene', 'preload()')

        // LOADING TEXT
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

        // AESPRITE
        this.load.aseprite('landmass', 'sprites/stained_glass/landmass.png', 'sprites/stained_glass/landmass.json')
        this.load.aseprite('blob', 'sprites/blob.png', 'sprites/blob.json')
    }

    create() {
        this.anims.createFromAseprite('landmass')
        this.anims.createFromAseprite('blob')
        this.scene.start('scene-game')

        console.log('RootScene', 'create()')
    }
}


const gameConfig = {
    title: 'Hearts',

    type: Phaser.AUTO,

    width: 720,
    height: 900,

    pixelArt: true,

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
