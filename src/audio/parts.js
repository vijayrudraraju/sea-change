import * as Tone from 'tone'

import * as Patterns from './patterns'
import * as Sources from './instruments'

export const quantizeTime = (time) => Tone.Time(Tone.Time(time).quantize("16n")).toBarsBeatsSixteenths()

let drumPart
let bassPart
let leadPart
let oceanPart
let metalPart
let fmPart

const createParts = (weatherData) => {
    const {
        bassSampler,
        bassSynth,
        drumPlayers,
        leadSampler,
        oceanSampler,
        metalSampler,
        shakeSampler,
        fmSampler
    } = Sources.createSources(weatherData)

    drumPart = new Tone.Part((time, drum) => {
        drumPlayers.player(drum).start(time);
    }, Patterns.drumPattern);
    drumPart.loop = true;
    drumPart.loopStart = 0;
    drumPart.loopEnd = '2m';

    // Pattern is generated from seed by magenta
    bassPart = new Tone.Part((time, note) => {
        bassSampler.triggerAttackRelease(note, '2n', time);
    }, []);
    bassPart.loop = true;
    bassPart.loopStart = 0;
    bassPart.loopEnd = '8m';

    // Pattern is generated from seed by magenta
    leadPart = new Tone.Part((time, note) => {
        leadSampler.triggerAttackRelease(note, '4n', time);
    }, []);
    leadPart.loop = true;
    leadPart.loopStart = 0;
    leadPart.loopEnd = '8m';

    oceanPart = new Tone.Part((time, note) => {
        oceanSampler.triggerAttackRelease(note, '2m', time)
    }, [["0:0:0", "C3"]])
    oceanPart.loop = true
    oceanPart.loopStart = 0
    oceanPart.loopEnd = '2m'

    metalPart = new Tone.Part((time, note) => {
        metalSampler.triggerAttackRelease(note, '2m', time)
    }, Patterns.metalPatterns[0])
    metalPart.loop = true
    metalPart.loopStart = 0
    metalPart.loopEnd = '2m'


    fmPart = new Tone.Part((time, note) => {
        fmSampler.triggerAttackRelease(note, '1m', time)
    }, Patterns.fmPatterns[0])
    fmPart.loop = true
    fmPart.loopStart = 0
    fmPart.loopEnd = '8m'

    return {
        drumPart,
        bassPart,
        leadPart,
        oceanPart,
        metalPart,
        fmPart
    }
}

export const startAllParts = (weatherData) => {
    const {
        drumPart,
        bassPart,
        leadPart,
        oceanPart,
        metalPart,
        fmPart
    } = createParts(weatherData)

    // PARTS
    drumPart.start()
    bassPart.start()
    leadPart.start()
    oceanPart.start()
    metalPart.start()
    fmPart.start()
}

export const updateParts = ({
    leadNotes,
    bassNotes,
    metalNotes
}) => {
    if (leadNotes) {
        leadPart.clear();
        for (let note of leadNotes) {
            leadPart.at(
                { '16n': note.quantizedStartStep },
                Tone.Frequency(note.pitch, 'midi').toNote()
            )
        }
    }

    if (bassNotes) {
        bassPart.clear();
        for (let note of bassNotes) {
            bassPart.at(
                { '16n': note.quantizedStartStep },
                Tone.Frequency(note.pitch, 'midi').toNote()
            )
        }
    }

    if (metalNotes) {
        metalPart.clear();
        for (let note of metalNotes) {
            metalPart.at(
                { '16n': note.quantizedStartStep },
                Tone.Frequency(note.pitch, 'midi').toNote()
            )
        }
    }
}
