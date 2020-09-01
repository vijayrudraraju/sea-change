import * as Nexus from 'nexusui'

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