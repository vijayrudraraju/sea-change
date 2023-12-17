import * as Tone from 'tone'
import * as Magenta from '@magenta/music'

const sequencerRows = ['B3', 'G#3', 'E3', 'C#3', 'B2', 'G#2', 'E2', 'C#2', 'B1', 'G#1', 'E1', 'C#1']

export const tonePatternToMagentaNotes = (tonePart) => tonePart.map(([time, note]) => ({
    pitch: Tone.Frequency(note).toMidi(),
    quantizedStartStep: (Tone.Time(time).toTicks() / Tone.Time('16n').toTicks()),
    quantizedEndStep: (Tone.Time(time).toTicks() / Tone.Time('16n').toTicks()) + 1
}))

export const magentaNotesToTimeMap = (magentaNotes) => {
    const timeMap = {}
    magentaNotes.forEach(({ pitch, quantizedStartStep }) => {
        timeMap[quantizedStartStep] = pitch
    })
    return timeMap
}

// YOUTUBE: https://youtu.be/om7OkImeDDE?t=6002
/*
let melodyRnn = new Magenta.MusicRNN('https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/chord_pitches_improv');
export const musicRNNContinueNoteSequence = ({
    pattern,
    temperature = 1.2,
    chordProgression
}) => {
    const run = async () => {
        if (!melodyRnn.initialized) {
            let melChordsLoaded = melodyRnn.initialize()
            await melChordsLoaded
        }

        const notes = tonePatternToMagentaNotes(pattern) || [];

        console.log('musicRNNContinueNoteSequence()', 'run()', { notes })

        let seed = {
            notes,
            totalQuantizedSteps: 4,
            quantizationInfo: { stepsPerQuarter: 4 }
        };

        // Variables
        let steps = 28
        let result = await melodyRnn.continueSequence(seed, steps, temperature, chordProgression)

        console.log('musicRNNContinueNoteSequence()', 'run()', { seed, result })

        let combined = Magenta.sequences.concatenate([seed, result])

        return combined.notes
    }

    return run()
}
*/

// YOUTUBE: https://youtu.be/om7OkImeDDE?t=7358
export const musicVAEHumanizeDrumTransform = (drumPattern, drumPart) => {
    const getMidiAndDrumMappings = () => {
        // From: https://magenta.tensorflow.org/datasets/groove
        const midiToDrum = [
            [36, "kick"],
            [37, "snare"],
            [38, "snare"],
            [40, "snare"],
            [42, "hatClosed"],
            [22, "hatClosed"],
            [44, "hatClosed"],
            [46, "hatOpen"],
            [26, "hatOpen"],
            [43, "tomLow"],
            [58, "tomLow"],
            [47, "tomMid"],
            [45, "tomMid"],
            [50, "tomHigh"],
            [48, "tomHigh"],
            [49, "crash"],
            [52, "crash"],
            [55, "crash"],
            [57, "crash"],
            [51, "ride"],
            [53, "ride"],
            [59, "ride"],
        ];
        const midiToDrumMap = new Map(midiToDrum)

        const drumToMidiMap = new Map([...midiToDrum].map((e) => e.reverse()))

        const mappings = { drumToMidiMap, midiToDrumMap }
        return mappings
    }

    // From: https://magenta.tensorflow.org/datasets/groove
    let grooVae = new Magenta.MusicVAE('https://storage.googleapis.com/magentadata/js/checkpoints/music_vae/groovae_2bar_humanize')
    let grooVaeLoaded = grooVae.initialize()

    const run = async () => {
        const bpm = Tone.Transport.bpm.value
        const { midiToDrumMap, drumToMidiMap } = getMidiAndDrumMappings()
        console.log('musicVAEHumanizeDrumTransform()', 'run()', { midiToDrumMap, drumToMidiMap, bpm })
        await grooVaeLoaded

        let sixteenthNoteTicks = Tone.Time('16n').toTicks()
        let original = {
            notes: drumPattern.map(([time, drum]) => ({
                pitch: drumToMidiMap.get(drum),
                quantizedStartStep: Tone.Time(time).toTicks() / sixteenthNoteTicks,
                quantizedEndStep: Tone.Time(time).toTicks() / sixteenthNoteTicks + 1
            })),
            totalQuantizedSteps: 32,
            quantizationInfo: { stepsPerQuarter: 4 }
        };

        let z = await grooVae.encode([original])
        let result = await grooVae.decode(z, 1.4, undefined, 4, bpm)

        console.log('musicVAEHumanizeDrumTransform()', 'run()', { original, groovy: result[0] })

        drumPart.clear();
        for (let note of result[0].notes) {
            drumPart.at(note.startTime, midiToDrumMap.get(note.pitch))
        }
    }
    return run()
}

let melChordsVae = new Magenta.MusicVAE('https://storage.googleapis.com/magentadata/js/checkpoints/music_vae/mel_chords')

// YOUTUBE: https://youtu.be/om7OkImeDDE?t=8564
export const musicVAEChordProgressionTransform = async ({
    pattern = null,
    totalQuantizedSteps = null,
    chordProgression,
    debugLabel,
    temperature = 1.5
}) => {
    const run = async () => {
        if (!melChordsVae.initialized) {
            let melChordsLoaded = melChordsVae.initialize()
            await melChordsLoaded
        }

        const notes = tonePatternToMagentaNotes(pattern) || [];
        let input = {
            notes,
            totalQuantizedSteps: totalQuantizedSteps || 32,
            quantizationInfo: { stepsPerQuarter: 4 }
        }

        if (!chordProgression) {
            console.log('musicVAEChordProgressionTransform()', 'run()', debugLabel, 'NO chordProgression');
            return
        }

        console.log(
            'musicVAEChordProgressionTransform()',
            'run()',
            debugLabel,
            { input, notes, chordProgression },
            melChordsVae
        );

        let z = await melChordsVae.encode([input], { chordProgression: [chordProgression[0]] });

        let one = await melChordsVae.decode(z, temperature, { chordProgression: [chordProgression[0]] });
        let two = await melChordsVae.decode(z, temperature, { chordProgression: [chordProgression[1]] });
        let three = await melChordsVae.decode(z, temperature, { chordProgression: [chordProgression[2]] });
        let four = await melChordsVae.decode(z, temperature, { chordProgression: [chordProgression[3]] });

        console.log('musicVAEChordProgressionTransform()', 'run()', debugLabel, { one, two, three, four });

        let all = Magenta.sequences.concatenate(
            one.concat(two).concat(three).concat(four)
        )

        console.log('musicVAEChordProgressionTransform()', 'all()', debugLabel, { allNotes: all.notes });

        return all.notes
    }
    return await run()
}

// API: https://github.com/magenta/magenta-js/blob/master/music/src/music_vae/model.ts#L1509
export const generateTrio = (chordProgression) => {
    // Doesn't take a chord progression
    const model = new Magenta.MusicVAE('https://storage.googleapis.com/magentadata/js/checkpoints/music_vae/trio_4bar');
    let modelLoaded = model.initialize()

    const run = async () => {
        await modelLoaded
        console.log('generateTrio()', 'run()', chordProgression, model)
        const sample = await model.sample(2, 0.5)
        const instruments = []
        sample[0].notes.forEach((val) => {
            const instrIdx = val.instrument
            if (!instruments[instrIdx]) {
                instruments[instrIdx] = []
            }
            instruments[instrIdx].push(val)
        })
        console.log('generateTrio()', 'run()', sample, instruments)
        return {
            leadTrio: instruments[0],
            bassTrio: instruments[1],
            drumTrio: instruments[2]
        }
    }
    return run()
}