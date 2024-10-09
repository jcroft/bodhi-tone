import * as Tone from "tone";
import { RecursivePartial } from "tone/build/esm/core/util/Interface";

export type OscillatorType =
  | "sine"
  | "square"
  | "sawtooth"
  | "triangle"
  | "fmsine"
  | "fmsquare"
  | "fmsawtooth"
  | "fmtriangle"
  | "amsine"
  | "amsquare"
  | "amsawtooth"
  | "amtriangle"
  | "fatsine"
  | "fatsquare"
  | "fatsawtooth"
  | "fattriangle"
  | "pulse"
  | "custom";
export interface OscillatorModuleProps {
  name?: string;
}

export interface OscillatorTypeSelectProps {
  synthState: Tone.MonoSynthOptions;
  updateSynthSettings: (options: RecursivePartial<Tone.MonoSynthOptions>) => void;
}

export interface OscillatorFadersProps {
  synthState: Tone.MonoSynthOptions;
  updateSynthSettings: (options: Partial<Tone.MonoSynthOptions>) => void;
}

export interface BasicOscillatorFadersProps {
  synthState: Tone.MonoSynthOptions;
  updateSynthSettings: (options: Partial<Tone.MonoSynthOptions>) => void;
}

export interface AdditionalOscillatorFadersProps {
  synthState: Tone.MonoSynthOptions;
  updateSynthSettings: (options: RecursivePartial<Tone.MonoSynthOptions>) => void;
  oscillatorType: OscillatorType;
}