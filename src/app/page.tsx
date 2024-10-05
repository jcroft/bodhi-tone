"use client";

import React from "react";
import * as Tone from "tone";
import styled from "styled-components";
import Synthesizer from "@/components/Synth";
import { useLocalStorageState } from "@/hooks/useLocalStorageState";
import { OmniOscillatorSynthOptions } from "tone/build/esm/source/oscillator/OscillatorInterface";

export const DEFAULT_SYNTH_OPTIONS: Partial<
  Tone.PolySynthOptions<Tone.MonoSynth>
> = {
  maxPolyphony: 16,
  voice: Tone.MonoSynth,
  volume: -18,
  options: {
    portamento: 0,
    oscillator: {
      type: "sawtooth",
    },
    envelope: {
      attack: 0.01,
      decay: 0.1,
      sustain: 0.5,
      release: 0.5,
    },
    filter: {
      Q: 1,
      type: "lowpass",
      rolloff: -12,
    },
    filterEnvelope: {
      attack: 0.01,
      decay: 0.1,
      sustain: 0.5,
      release: 0.5,
      baseFrequency: 200,
      octaves: 7,
      exponent: 2,
    },
  } as Tone.MonoSynthOptions,
};

const StyledSynthPage = styled.div<{ $isOn?: boolean }>`
  padding: 1rem;
`;

export const SynthContext = React.createContext({
  synth: new Tone.PolySynth<Tone.MonoSynth>(DEFAULT_SYNTH_OPTIONS),
  synthOptions: DEFAULT_SYNTH_OPTIONS,
  saveSynthOptions: (options: Partial<Tone.MonoSynthOptions>) => {},
  effects: {
    chorus: new Tone.Chorus(4, 2.5, 0.5).toDestination(),
    delay: new Tone.PingPongDelay("4n", 0.1).toDestination(),
    reverb: new Tone.Reverb(0.5).toDestination(),
  },
});

const SynthesizerPage: React.FC = () => {
  const [synthOptions, setSynthOptions] = useLocalStorageState<string>(
    "synthOptions",
    JSON.stringify(DEFAULT_SYNTH_OPTIONS)
  );

  const chorus = React.useMemo(
    () => new Tone.Chorus(4, 2.5, 0.5).toDestination(),
    []
  );

  const delay = React.useMemo(
    () => new Tone.PingPongDelay("4n", 0.1).toDestination(),
    []
  );
  delay.wet.value = 0.05;

  const reverb = React.useMemo(() => new Tone.Reverb(0.5).toDestination(), []);
  reverb.wet.value = 0.5;

  return (
    <SynthContext.Provider
      value={{
        synth: new Tone.PolySynth<Tone.MonoSynth>(DEFAULT_SYNTH_OPTIONS),
        synthOptions: JSON.parse(synthOptions),
        saveSynthOptions: (options: Partial<Tone.MonoSynthOptions>) => {
          console.log("saving options", options);
          setSynthOptions(JSON.stringify(options));
        },
        effects: {
          chorus,
          delay,
          reverb,
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
