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

export type SynthOptions = {
  power: boolean;
  oscillator: {
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
  filter: {
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
  oscillator: {
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
  filter: {
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
  const [midiInput, setMidiInput] = React.useState("none");
  const [midiInputOptions, setMidiInputOptions] = React.useState([
    { label: "Loading...", value: "none" },
  ]);

  // Create the synthesizer components
  // const oscillator = new Tone.Oscillator(
  //   synthOptions.oscillator.frequency,
  //   synthOptions.oscillator.type
  // );
  // oscillator.volume.value = synthOptions.oscillator.volume;

  // const filter1 = new Tone.Filter(
  //   synthOptions.filter.frequency,
  //   "lowpass",
  //   -24
  // );
  // filter1.Q.value = synthOptions.filter.q;

  // const filterEnvelope = new Tone.FrequencyEnvelope(
  //   synthOptions.filterEnvelope
  // );

  // const ampEnvelope = new Tone.AmplitudeEnvelope(synthOptions.ampEnvelope);

  const synth = new Tone.PolySynth<Tone.MonoSynth>().toDestination();
  synth.set({
    oscillator: {
      type: "sawtooth",
    },
    envelope: {
      attack: 0.25,
      decay: 0.5,
      sustain: 0.5,
      release: 0.25,
    },
  });

  // Connect synth components and manage their on/off states and routing
  useEffect(() => {
    // if (synthOptions.power) {
    //   if (synthOptions.oscillator.isOn && osc1.state !== "started") {
    //     console.log("Starting Osc1");
    //     osc1.start();
    //     osc1.mute = false;
    //   } else if (!synthOptions.oscillator.isOn && osc1.state === "started") {
    //     console.log("Stopping Osc1");
    //     osc1.stop();
    //   }

    //   if (synthOptions.filterEnvelope.isOn) {
    //     console.log("Connecting Filter Env to Filter 1");
    //     filterEnvelope.connect(filter1.frequency);
    //     osc1.chain(filter1, ampEnvelope, Tone.Destination);
    //   } else {
    //     console.log("Disconnecting Filter Env from Filter 1");
    //     filterEnvelope.disconnect(filter1.frequency);
    //     osc1.chain(ampEnvelope, Tone.Destination);
    //   }

    //   if (synthOptions.ampEnvelope.isOn) {
    //     console.log("Connecting Amp Env");
    //     ampEnvelope.connect(Tone.Destination);
    //     osc1.chain(filter1, ampEnvelope, Tone.Destination);
    //   } else {
    //     console.log("Disconnecting Amp Env");
    //     ampEnvelope.disconnect(Tone.Destination);
    //     osc1.chain(filter1, Tone.Destination);
    //   }
    // } else {
    //   console.log("Powering off");
    //   osc1.mute = true;
    // }

    if (synthOptions.power && Tone.context.state !== "running") {
      console.log("Powering on");
      Tone.start();
    }
  }, [
    synthOptions.filterEnvelope.isOn,
    synthOptions.ampEnvelope.isOn,
    synthOptions.oscillator.isOn,
    synthOptions.filter.isOn,
    synthOptions.power,
  ]);

  const generateNotes = (
    notes: string[] | number[],
    velocity: number,
    duration?: Tone.Unit.Time
  ) => {
    onNoteOn(notes, velocity, duration);
  };

  const onNoteOn = (
    notes: string[] | number[],
    velocity: number,
    duration?: Tone.Unit.Time
  ) => {
    if (duration) {
      synth.triggerAttackRelease(notes, duration, Tone.now(), velocity);
      return;
    } else {
      synth.triggerAttack(notes, Tone.now(), velocity);
    }
  };

  const onNoteOff = (notes: string[] | number[]) => {
    synth.triggerRelease(notes, Tone.now());
  };

  const onMidiEnabled = () => {
    console.log("MIDI enabled", WebMidi.inputs);
    const MIDIInputOptions = WebMidi.inputs.map((input) => ({
      label: input.name,
      value: input.id,
    }));
    MIDIInputOptions.unshift({ label: "None", value: "none" });
    setMidiInputOptions(MIDIInputOptions);
  };

  // endable webmidi
  useEffect(() => {
    WebMidi.enable()
      .then(onMidiEnabled)
      .catch((err) => alert(err));
  }, []);

  useEffect(() => {
    if (midiInput === "none") {
      return;
    }

    const selectedInput = WebMidi.getInputById(midiInput);
    if (!selectedInput) {
      return;
    }

    selectedInput.addListener("noteon", (e) => {
      const noteString = Tone.Midi(e.data[1]).toNote();
      console.log(`Received noteOn from ${selectedInput.name}: `, noteString);
      onNoteOn([noteString], e.velocity);
    });

    selectedInput.addListener("noteoff", (e) => {
      const noteString = Tone.Midi(e.data[1]).toNote();
      console.log("Received noteoff", e);
      onNoteOff([noteString]);
    });

    return () => {
      selectedInput.removeListener("noteon");
      selectedInput.removeListener("noteoff");
    };
  }, [midiInput]);

  return (
    <SynthOptionsContext.Provider value={{ synthOptions, setSynthOptions }}>
      <StyledSynthesizer $isOn={synthOptions.power}>
        <StyledModuleContainer>
          {/* <OscillatorModule
            name="OSC 1"
            oscillator={osc1}
            componentKey="osc1"
            isOn={synthOptions.osc1.isOn}
          /> */}
          {/* <FilterWithEnvelopeModule
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
          /> */}
        </StyledModuleContainer>
        <StyledDevUtilityContainer>
          <button
            onClick={() => {
              setSynthOptions({ ...synthOptions, power: !synthOptions.power });
            }}
          >
            Power Button ({synthOptions.power ? "On" : "Off"})
          </button>

          <button onClick={() => generateNotes([60], 0.5, "4n")}>A note</button>

          <button
            onClick={() => {
              generateNotes([62], 0.5, "4n");
            }}
          >
            A different note
          </button>

          <Select
            componentKey="midi-input"
            defaultOption="none"
            value={midiInput}
            label="Midi Input"
            options={midiInputOptions}
            onChange={(event) => {
              setMidiInput(event.target.value);
            }}
          />
        </StyledDevUtilityContainer>
      </StyledSynthesizer>
    </SynthOptionsContext.Provider>
  );
};

export default Synthesizer;
