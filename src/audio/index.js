// Magenta.js
// Groove
// https://magenta.tensorflow.org/datasets/groove

// Tone.js
// https://github.com/Tonejs/Tone.js/wiki/Time

import * as Tone from 'tone'

import * as Parts from './parts'
import * as CustomMagenta from './magenta'
import * as Patterns from './patterns'

let MAIN_AUDIO_LOOP

let LEAD_NOTES, LEAD_MAP
let BASS_NOTES, BASS_MAP
let METAL_NOTES, METAL_MAP
let FM_NOTES, FM_MAP

let SCENE = null
let AUDIO_CALLBACK = null

export const setScene = (scene, audioEvent) => {
    SCENE = scene
    AUDIO_CALLBACK = audioEvent
}

export const initialize = async (WEATHER_DATA) => {
    const { waterLevel, waterTemperature } = WEATHER_DATA

    const weatherBpm = Number(((waterLevel / 5.0) * 100.0).toFixed(1))
    const weatherTemp = Number(((waterTemperature / 55.0) * 1.2).toFixed(2))

    console.log('Audio', 'initialize()', { weatherData: WEATHER_DATA, weatherBpm, weatherTemp })

    Tone.Transport.bpm.value = weatherBpm
    MAIN_AUDIO_LOOP = new Tone.Loop((time) => {
        const transportPos = Parts.quantizeTime(Tone.Transport.seconds)
        const splits = transportPos.split(':')
        const BAR = parseInt(splits[0])
        const BEAT = parseInt(splits[1])
        const SIXT = parseInt(splits[2])

        SCENE.setMusicalCount(BAR, BEAT, SIXT)

        const normalizedStep = ((BAR * 16) + (BEAT * 4) + SIXT) % 128
        const lead = LEAD_MAP[normalizedStep]
        const bass = BASS_MAP[normalizedStep]
        const metal = METAL_MAP[normalizedStep]
        const fm = FM_MAP[normalizedStep]

        /*
        console.log('Audio', 'Loop()',
            BAR,
            BEAT,
            SIXT,
            {
                lead,
                bass,
                metal,
                fm,
            },
            normalizedStep,
        )
        */

        Tone.Draw.schedule(() => {
            if (!SCENE || !AUDIO_CALLBACK) return

            AUDIO_CALLBACK(SCENE, lead, bass, metal, fm)
        }, time);
    }, '16n')

    Parts.startAllParts(WEATHER_DATA)

    // MAGENTA
    // CustomMagenta.musicRNNContinueNoteSequence(sequencer)
    // CustomMagenta.musicVAEHumanizeDrumTransform(Patterns.drumPattern, drumPart)

    LEAD_NOTES = await CustomMagenta.musicVAEChordProgressionTransform({
        pattern: Patterns.leadPatterns[0],
        chordProgression: Patterns.chordProgs[2],
        debugLabel: 'lead',
        temperature: weatherTemp
    })
    LEAD_MAP = CustomMagenta.magentaNotesToTimeMap(LEAD_NOTES)

    BASS_NOTES = await CustomMagenta.musicVAEChordProgressionTransform({
        pattern: Patterns.bassPatterns[0],
        chordProgression: Patterns.chordProgs[2],
        debugLabel: 'bass',
        temperature: weatherTemp
    })
    BASS_MAP = CustomMagenta.magentaNotesToTimeMap(BASS_NOTES)

    METAL_NOTES = await CustomMagenta.musicVAEChordProgressionTransform({
        pattern: Patterns.metalPatterns[0],
        chordProgression: Patterns.chordProgs[2],
        debugLabel: 'metal',
        temperature: weatherTemp
    })
    METAL_MAP = CustomMagenta.magentaNotesToTimeMap(METAL_NOTES)
    FM_NOTES = CustomMagenta.tonePatternToMagentaNotes(Patterns.fmPatterns[0])
    FM_MAP = CustomMagenta.magentaNotesToTimeMap(FM_NOTES)

    console.log('Audio', 'initialize()', { LEAD_NOTES, BASS_NOTES, METAL_NOTES, FM_NOTES })

    Parts.updateParts({ leadNotes: LEAD_NOTES, bassNotes: BASS_NOTES, metalNotes: METAL_NOTES })
}

let FIRST_START = false
export const start = async () => {
    console.log('audio', 'start()', Tone.Transport.seconds, Tone.now())
    if (!FIRST_START) {
        await Tone.start()
        FIRST_START = true
        MAIN_AUDIO_LOOP.start()
    }
    Tone.Transport.start()
}

export const pause = async () => {
    console.log('audio', 'pause()', Tone.Transport.seconds, Tone.now())
    Tone.Transport.pause()
}
