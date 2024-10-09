import { OmniOscillatorType } from "tone/build/esm/source/oscillator/OscillatorInterface";

export const OSCILLATOR_TYPES: OmniOscillatorType[] = [
  "sine",
  "square",
  "sawtooth",
  "triangle",
  "fmsine",
  "fmsquare",
  "fmsawtooth",
  "fmtriangle",
  "amsine",
  "amsquare",
  "amsawtooth",
  "amtriangle",
  "fatsine",
  "fatsquare",
  "fatsawtooth",
  "fattriangle",
  "pulse",
];

export const MIN_OCTAVE = -4;
export const MAX_OCTAVE = 4;
export const OCTAVE_STEP = 1;

export const MIN_SEMITONES = -12;
export const MAX_SEMITONES = 12;
export const SEMITONES_STEP = 1;

export const MIN_DETUNE = -100;
export const MAX_DETUNE = 100;
export const DETUNE_STEP = 1;

export const MIN_FINE_DETUNE = -100;
export const MAX_FINE_DETUNE = 100;
export const FINE_DETUNE_STEP = 1;
