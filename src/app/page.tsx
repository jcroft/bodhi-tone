"use client";

import AmpEnvelopeModule from "@/components/ampEnvelope";
import FilterWithEnvelopeModule from "@/components/filterEnvelope";
import OscillatorModule from "@/components/oscillator";
import React, { useEffect } from "react";
import * as Tone from "tone";
import { ToneOscillatorType } from "tone";
import { Frequency, Time } from "tone/build/esm/core/type/Units";
import styled from "styled-components";

export type SynthOptions = {
  power: boolean;
  osc1: {
    isOn: boolean;
    type: ToneOscillatorType;
    frequency: Frequency;
    volume: number;
  };
  ampEnvelope: {
    isOn: boolean;
    attack: Time;
    decay: Time;
    sustain: number;
    release: Time;
  };
  filter1: {
    isOn: boolean;
    frequency: Frequency;
    q: number;
  };
  filterEnvelope: {
    isOn: boolean;
    attack: Time;
    decay: Time;
    sustain: number;
    release: Time;
    baseFrequency?: Frequency;
  };
};

const DEFAULT_SYNTH_OPTIONS: SynthOptions = {
  power: false,
  osc1: {
    isOn: true,
    type: "sawtooth",
    frequency: 523.3,
    volume: -6,
  },
  ampEnvelope: {
    isOn: true,
    attack: 0.25,
    decay: 0.5,
    sustain: 0.5,
    release: 0.25,
  },
  filter1: {
    isOn: true,
    frequency: 3000,
    q: 0,
  },
  filterEnvelope: {
    isOn: true,
    attack: 0.25,
    decay: 0.5,
    sustain: 0.5,
    release: 0.25,
    baseFrequency: 3000,
  },
};

const StyledSynthesizer = styled.div<{ $isOn?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  opacity: ${({ $isOn }) => ($isOn ? 1 : 0.5)};
`;

const StyledModuleContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 1rem;
`;

const StyledDevUtilityContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 1rem;
`;

export const SynthOptionsContext = React.createContext<{
  synthOptions: SynthOptions;
  setSynthOptions: React.Dispatch<React.SetStateAction<SynthOptions>>;
}>({
  synthOptions: DEFAULT_SYNTH_OPTIONS,
  setSynthOptions: (synthOptions: React.SetStateAction<SynthOptions>) => {},
});

const Synthesizer: React.FC = () => {
  const [synthOptions, setSynthOptions] = React.useState(DEFAULT_SYNTH_OPTIONS);

  // Create the synthesizer components
  const osc1 = new Tone.Oscillator(
    synthOptions.osc1.frequency,
    synthOptions.osc1.type
  );
  osc1.volume.value = synthOptions.osc1.volume;

  const filter1 = new Tone.Filter(
    synthOptions.filter1.frequency,
    "lowpass",
    -24
  );
  filter1.Q.value = synthOptions.filter1.q;

  const filterEnvelope = new Tone.FrequencyEnvelope(
    synthOptions.filterEnvelope
  );

  const ampEnvelope = new Tone.AmplitudeEnvelope(synthOptions.ampEnvelope);

  // Connect synth components and manage their on/off states and routing
  useEffect(() => {
    if (synthOptions.power) {
      if (synthOptions.osc1.isOn && osc1.state !== "started") {
        console.log("Starting Osc1");
        osc1.start();
      } else if (!synthOptions.osc1.isOn && osc1.state === "started") {
        console.log("Stopping Osc1");
        osc1.stop();
      }

      if (synthOptions.filterEnvelope.isOn) {
        console.log("Connecting Filter Env to Filter 1");
        filterEnvelope.connect(filter1.frequency);
        osc1.chain(filter1, ampEnvelope, Tone.Destination);
      } else {
        console.log("Disconnecting Filter Env from Filter 1");
        filterEnvelope.disconnect(filter1.frequency);
        osc1.chain(ampEnvelope, Tone.Destination);
      }

      if (synthOptions.ampEnvelope.isOn) {
        console.log("Connecting Amp Env");
        ampEnvelope.connect(Tone.Destination);
        osc1.chain(filter1, ampEnvelope, Tone.Destination);
      } else {
        console.log("Disconnecting Amp Env");
        ampEnvelope.disconnect(Tone.Destination);
        osc1.chain(filter1, Tone.Destination);
      }
    } else {
      console.log("Powering off");
      osc1.stop();
    }

    if (synthOptions.power && Tone.context.state !== "running") {
      console.log("Powering on");
      Tone.start();
    }
  }, [
    synthOptions.filterEnvelope.isOn,
    synthOptions.ampEnvelope.isOn,
    synthOptions.osc1.isOn,
    synthOptions.filter1.isOn,
    synthOptions.power,
  ]);

  return (
    <SynthOptionsContext.Provider value={{ synthOptions, setSynthOptions }}>
      <StyledSynthesizer $isOn={synthOptions.power}>
        <StyledModuleContainer>
          <OscillatorModule
            name="OSC 1"
            oscillator={osc1}
            componentKey="osc1"
            isOn={synthOptions.osc1.isOn}
          />
          <FilterWithEnvelopeModule
            componentKey="filterEnvelope"
            name="Filter"
            filter={filter1}
            envelope={filterEnvelope}
            isOn={synthOptions.filterEnvelope.isOn}
          />
          <AmpEnvelopeModule
            componentKey="ampEnvelope"
            name="Amp"
            envelope={ampEnvelope}
            isOn={synthOptions.ampEnvelope.isOn}
          />
        </StyledModuleContainer>
        <StyledDevUtilityContainer>
          <button
            onClick={() => {
              setSynthOptions({ ...synthOptions, power: !synthOptions.power });
            }}
          >
            Power Button ({synthOptions.power ? "On" : "Off"})
          </button>

          <button onClick={() => ampEnvelope.triggerAttackRelease("4n")}>
            Trigger Envelope
          </button>
        </StyledDevUtilityContainer>
      </StyledSynthesizer>
    </SynthOptionsContext.Provider>
  );
};

export default Synthesizer;
