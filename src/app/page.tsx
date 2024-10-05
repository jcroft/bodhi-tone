"use client";

import React from "react";
import * as Tone from "tone";
import styled from "styled-components";
import Synthesizer, {
  DEFAULT_SYNTH_OPTIONS,
  SynthContext,
} from "@/components/Synth";
import { useLocalStorageState } from "@/hooks/useLocalStorageState";

const StyledSynthPage = styled.div<{ $isOn?: boolean }>`
  padding: 1rem;
`;

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
