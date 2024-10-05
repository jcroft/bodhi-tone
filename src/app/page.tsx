"use client";

import React from "react";
import * as Tone from "tone";
import { ToneOscillatorType } from "tone";
import styled from "styled-components";
import Synthesizer from "@/components/Synth";
import { useLocalStorageState } from "@/hooks/useLocalStorageState";

export const DEFAULT_DUO_SYNTH_OPTIONS: Tone.DuoSynthOptions = {
  harmonicity: 1,
  volume: -18,
  vibratoAmount: 0,
  vibratoRate: 5,
  maxPolyphony: 64,
  voice0: {
    portamento: 0,
    oscillator: {
      type: "sawtooth" as ToneOscillatorType,
    },
    filter: {
      Q: 6,
      type: "lowpass",
      rolloff: -24,
    },
    envelope: {
      attack: 0.01,
      decay: 0.25,
      sustain: 0.5,
      release: 1,
    },
    filterEnvelope: {
      attack: 0.01,
      decay: 0.25,
      sustain: 0.5,
      release: 1,
      baseFrequency: 200,
      octaves: 7,
      exponent: 2,
    },
  },
  voice1: {
    portamento: 0,
    oscillator: {
      type: "square" as ToneOscillatorType,
    },
    filter: {
      Q: 6,
      type: "lowpass",
      rolloff: -24,
    },
    envelope: {
      attack: 0.01,
      decay: 0.25,
      sustain: 0.5,
      release: 1,
    },
    filterEnvelope: {
      attack: 0.01,
      decay: 0.25,
      sustain: 0.5,
      release: 1,
      baseFrequency: 200,
      octaves: 7,
      exponent: 2,
    },
  },
};

const StyledSynthPage = styled.div<{ $isOn?: boolean }>`
  padding: 1rem;
`;

export const SynthContext = React.createContext({
  synth: new Tone.PolySynth<Tone.DuoSynth>({
    maxPolyphony: 64,
    voice: Tone.DuoSynth,
  }),
  synthOptions: DEFAULT_DUO_SYNTH_OPTIONS,
  saveSynthOptions: (options: Tone.DuoSynthOptions) => {},
});

const SynthesizerPage: React.FC = () => {
  const [synthOptions, setSynthOptions] = useLocalStorageState<string>(
    "synthOptions",
    JSON.stringify(DEFAULT_DUO_SYNTH_OPTIONS)
  );

  return (
    <SynthContext.Provider
      value={{
        synth: new Tone.PolySynth<Tone.DuoSynth>({
          maxPolyphony: 64,
          voice: Tone.DuoSynth,
        }),
        synthOptions: JSON.parse(synthOptions),
        saveSynthOptions: (options: Tone.DuoSynthOptions) => {
          console.log("saving options", options);
          setSynthOptions(JSON.stringify(options));
        },
      }}
    >
      <StyledSynthPage>
        <Synthesizer />
      </StyledSynthPage>
    </SynthContext.Provider>
  );
};

export default SynthesizerPage;
