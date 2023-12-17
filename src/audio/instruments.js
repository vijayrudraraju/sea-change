import * as Tone from "tone";

export const initInstruments = (weatherData) => {
  console.log("instruments", "createSources(weatherData)", weatherData);

  let drumPlayers = new Tone.Players({
    kick: "https://teropa.info/ext-assets/drumkit/kick.mp3",
    hatClosed: "https://teropa.info/ext-assets/drumkit/hatClosed.mp3",
    hatOpen: "https://teropa.info/ext-assets/drumkit/hatOpen2.mp3",
    snare: "https://teropa.info/ext-assets/drumkit/snare3.mp3",
    tomLow: "https://teropa.info/ext-assets/drumkit/tomLow.mp3",
    tomMid: "https://teropa.info/ext-assets/drumkit/tomMid.mp3",
    tomHigh: "https://teropa.info/ext-assets/drumkit/tomHigh.mp3",
    ride: "https://teropa.info/ext-assets/drumkit/ride.mp3",
    crash: "https://teropa.info/ext-assets/drumkit/hatOpen.mp3",
  }).toDestination();

  let bassSynth = new Tone.Synth({
    oscillator: { type: "sawtooth" },
    volume: -5,
  });
  let bassFilter = new Tone.Filter({ type: "lowpass", frequency: 400 });
  bassSynth.connect(bassFilter);
  bassFilter.toDestination();

  let leadSampler = new Tone.Sampler({
    urls: {
      D4: "audio/splice/leads/SOULSURPLUS_murkywaters_one_shot_rhodes_Dmaj7.wav",
    },
    volume: -4,
  });
  //let leadDelay = new Tone.PingPongDelay('8n.', 0.1);
  //leadSampler.connect(leadDelay);
  let leadReverb = new Tone.Reverb({ decay: 3, wet: 0.5 });
  leadSampler.connect(leadReverb);
  let autoFilterSampler = new Tone.AutoFilter("4n").toDestination();
  leadReverb.connect(autoFilterSampler);
  autoFilterSampler.toDestination();

  let bassSampler = new Tone.Sampler({
    urls: {
      "C#1": "audio/splice/bass/SUPAH_MARIO_808_kick_pitched_Csharp.wav",
    },
    volume: -12,
  });
  bassSampler.toDestination();

  let oceanSampler = new Tone.Sampler({
    urls: {
      C3: "audio/splice/ocean/at_ambience_seagulls.wav",
    },
    volume: -15,
  });
  oceanSampler.toDestination();

  let shakeSampler = new Tone.Sampler({
    urls: {
      C3: "audio/splice/ocean/glass_beach_grain_pour_04.wav",
    },
    volume: -1,
  });
  shakeSampler.toDestination();

  let metalSampler = new Tone.Sampler({
    urls: {
      E3: "audio/splice/leads/EX_ATSM_Metal_Tonal_Percussion_Sansula_Dissonant_E.wav",
    },
    volume: -4,
  });
  metalSampler.toDestination();

  let fmSampler = new Tone.FMSynth({
    detune: -20,
    harmonicity: 2,
    modulationIndex: 1,
    portamento: 4,
    volume: -3,
  });
  let fmDelay = new Tone.PingPongDelay("16n.", 0.1);
  fmSampler.connect(fmDelay);
  let fmReverb = new Tone.Reverb({ decay: 3, wet: 0.5 });
  fmDelay.connect(fmReverb);
  let autoFilter = new Tone.AutoFilter("4n").toDestination();
  fmReverb.connect(autoFilter);
  autoFilter.toDestination();

  return {
    drumPlayers,
    bassSampler,
    bassSynth,
    leadSampler,
    oceanSampler,
    shakeSampler,
    metalSampler,
    fmSampler,
  };
};
