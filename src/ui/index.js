import * as Nexus from 'nexusui'
import * as Phaser from 'phaser'

const COLOR_PRIMARY = 0x4e342e
const COLOR_LIGHT = 0x7b5e57
const COLOR_DARK = 0x260e04
const COLOR_RED = 0xff0000
const COLOR_GREEN = 0x00ff00

export const createTextString = (playing, { BAR, BEAT, SIXT }) => {
    return playing ?
        `Playing\t\t${BAR}\t:\t${BEAT}\t:\t${SIXT}` :
        `Paused\t\t\t${BAR}\t:\t${BEAT}\t:\t${SIXT}`
}

export const createButton = (scene, text) => {
    const COLOR_LIGHT = 0x7b5e57
    const COLOR_DARK = 0x260e04

    return scene.rexUI.add.label({
        background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 10).setStrokeStyle(2, COLOR_LIGHT),
        icon: scene.add.circle(0, 0, 10).setStrokeStyle(1, COLOR_DARK).setFillStyle(COLOR_RED),
        text: scene.add.text(0, 0, text, {
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

export const createWeatherTextString = (scene, LOCATION) => {
    const today = new Date();
    const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    const time = today.getHours() + ":" + today.getMinutes();
    const dateTime = date + ' ' + time;

    const contents = [
        `${LOCATION}\n`,
        `${dateTime}\n`,
        `Water Level\t\t${scene.WEATHER_DATA.waterLevel} ft`,
        `Water Temp\t\t\t${scene.WEATHER_DATA.waterTemperature} F`,
        //`Air Pressure\t${scene.WEATHER_DATA.airPressure} mbar`,
        //`Air Temp\t\t\t\t\t${scene.WEATHER_DATA.airTemperature} F`,
        `Wind\t\t\t\t\t\t\t\t\t${scene.WEATHER_DATA.wind.knots} knots ${scene.WEATHER_DATA.wind.direction}`
    ]
    return contents.join('\n')
}

export const createTextBox = (scene, x, y, config) => {
    const GetValue = Phaser.Utils.Objects.GetValue
    const wrapWidth = GetValue(config, 'wrapWidth', 0);
    const fixedWidth = GetValue(config, 'fixedWidth', 0);
    const fixedHeight = GetValue(config, 'fixedHeight', 0);

    const getBuiltInText = (scene, wrapWidth, fixedWidth, fixedHeight) => {
        return scene.add.text(0, 0, '', {
            fontSize: '16px',
            wordWrap: {
                width: wrapWidth
            },
            maxLines: 10
        }).setFixedSize(fixedWidth, fixedHeight);
    }

    const textBox = scene.rexUI.add.textBox({
        x: x,
        y: y,
        background: scene.rexUI.add.roundRectangle(0, 0, 2, 2, 20, COLOR_PRIMARY)
            .setStrokeStyle(2, COLOR_LIGHT),
        icon: null,
        text: getBuiltInText(scene, wrapWidth, fixedWidth, fixedHeight),
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

export const createStatusBox = (scene, Audio, LOCATION) => {
    const weatherStr = createWeatherTextString(scene, LOCATION)

    const textbox = createTextBox(scene, 10, 10, {
        wrapWidth: 500,
        icon: null,
        iconMask: false
    }).start(weatherStr, 10)
    scene.add.existing(textbox)

    const background = scene.rexUI.add.roundRectangle(0, 0, 0, 0, 10, COLOR_PRIMARY)

    scene.btn = createButton(scene, createTextString(false, scene.getMusicalCount()))

    var buttons = scene.rexUI.add.fixWidthButtons({
        x: 550,
        y: 30,
        width: 300,
        background,
        buttons: [scene.btn],
        space: {
            line: 10, item: 10
        }
    }).layout()

    buttons.on('button.click', () => {
        console.log('CLICK', scene, scene.getMusicalCount())
        if (!scene.playing) {
            Audio.start()
            scene.playing = true
            scene.btn.setText(
                createTextString(true, scene.getMusicalCount())
            ).getElement('icon').setFillStyle(COLOR_GREEN)
        } else {
            Audio.pause()
            scene.playing = false
            scene.btn.setText(
                createTextString(false, scene.getMusicalCount())
            ).getElement('icon').setFillStyle(COLOR_RED)
        }
    });
}



export const createSequencer = (thisScene) => {
    // Interaction
    let sequencer = new Nexus.Sequencer('#sequencer', {
        columns: 32,
        rows: 12,
        size: [thisScene.CANVAS_WIDTH - 80, 400]
    })
    const updateSequencer = async (val) => {
        // console.log('updateSequencer()', val)
    }
    sequencer.on('change', updateSequencer)
    return sequencer
}

export const createBpmSlider = () => {
    const slider = new Nexus.Slider('#bpm', { size: [120, 20], min: 30, max: 160, value: 60, step: 1 })
    return slider
}

export const createSlider = (id, min, max, value, step) => {
    const slider = new Nexus.Slider(id, { size: [120, 20], min, max, value, step })
    return slider
}