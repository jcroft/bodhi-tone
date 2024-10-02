"use client";

import AmpEnvelopeModule from "@/components/ampEnvelope";
import FilterWithEnvelopeModule from "@/components/filterEnvelope";
import OscillatorModule from "@/components/oscillator";
import React, { useEffect } from "react";
import * as Tone from "tone";
import { ToneOscillatorType } from "tone";
import { Frequency, Time } from "tone/build/esm/core/type/Units";
import styled from "styled-components";
import { WebMidi } from "webmidi";
import Select from "@/components/input/select";
import Synthesizer from "@/components/synth";
import Keyboard from "@/components/Keyboard";

export type SynthOptions = {
  power: boolean;
  volume: number;
  frequency: Frequency;
  oscillator: {
    type: ToneOscillatorType;
    frequency: Frequency;
  };
  envelope: {
    attack: Time;
    decay: Time;
    sustain: number;
    release: Time;
  };
  filter: {
    type: string;
    rolloff: number;
    Q: number;
  };
  filterEnvelope: {
    attack: Time;
    decay: Time;
    sustain: number;
    release: Time;
    baseFrequency: Frequency;
  };
};

const StyledSynthPage = styled.div<{ $isOn?: boolean }>`
  padding: 1rem;
`;

export const SynthContext = React.createContext({
  synth: new Tone.PolySynth<Tone.MonoSynth>({
    maxPolyphony: 8,
    voice: Tone.MonoSynth,
  }),
});

const SynthesizerPage: React.FC = () => {
  return (
    <SynthContext.Provider
      value={{
        synth: new Tone.PolySynth<Tone.MonoSynth>({
          maxPolyphony: 8,
          voice: Tone.MonoSynth,
        }),
      }}
    >
      <StyledSynthPage>
        <Synthesizer />
      </StyledSynthPage>
    </SynthContext.Provider>
  );
};

export default SynthesizerPage;
