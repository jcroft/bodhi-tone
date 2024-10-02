"use client";

import AmpEnvelopeModule from "@/components/ampEnvelope";
import FilterWithEnvelopeModule from "@/components/filterEnvelope";
import OscillatorModule from "@/components/oscillator";
import React, { useContext, useEffect } from "react";
import * as Tone from "tone";
import { Frequency, Time } from "tone/build/esm/core/type/Units";
import styled from "styled-components";
import { WebMidi } from "webmidi";
import Select from "@/components/input/select";
import { SynthContext } from "@/app/page";
import { useLocalStorageState } from "@/hooks/useLocalStorageState";
import Keyboard from "./Keyboard";
import { act } from "react-dom/test-utils";

const DEFAULT_SYNTH_OPTIONS = {
  volume: -12,
  oscillator: {
    type: "sawtooth" as OscillatorType,
    frequency: 440 as Frequency,
  },
  envelope: {
    attack: 0,
    decay: 0.5,
    sustain: 0.5,
    release: 0.25,
  },
  filter: {
    type: "lowpass" as BiquadFilterType,
    Q: 6,
    rolloff: -24 as Tone.FilterRollOff,
  },
  filterEnvelope: {
    attack: 0,
    decay: 0.5,
    sustain: 0.5,
    release: 0.25,
    baseFrequency: 100,
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

const Synthesizer: React.FC = () => {
  // power: Tone.js requires a user interaction to enable the synth, so we'll have a power button
  const [power, setPower] = React.useState(false);

  // midiInput: The currently selected MIDI input
  const [midiInput, setMidiInput] = useLocalStorageState(
    "selectedMidiInput",
    "none"
  );

  // midiInputOptions: The available MIDI ports as dropdown menu options
  const [midiInputOptions, setMidiInputOptions] = React.useState([
    { label: "Loading...", value: "none" },
  ]);

  // We need to store the active notes so they can be displayed on the keyboard
  const [activeNotes, setActiveNotes] = React.useState<(string | number)[]>([]);

  // synth: The Tone.PolySynth instantiated by SynthContext
  const { synth } = useContext(SynthContext);

  // Set the default synth options
  synth.set({
    ...DEFAULT_SYNTH_OPTIONS,
  });

  // Send the output of the synth to the primary output
  synth.toDestination();

  console.log("CURRENT SYNTH:", synth, synth.get());
  console.log("TONE STATE:", synth.context.state);

  // turn the synth on when the user presses the power button
  useEffect(() => {
    if (power && Tone.context.state !== "running") {
      console.log("Powering on");
      Tone.start();
    }
  }, [power, synth]);

  // A wrapper to onNoteOn for generated notes via user interaction (NOTE: May be unnecessary?)
  const generateNotes = (
    notes: (string | number)[],
    velocity: number,
    duration?: Tone.Unit.Time
  ) => {
    onNoteOn(notes, velocity, duration);
  };

  // Handle incoming MIDI noteOn messages
  const onNoteOn = (
    notes: (string | number)[],
    velocity?: number,
    duration?: Tone.Unit.Time
  ) => {
    console.log("onNoteOn: Received notes:", notes);
    if (duration) {
      synth.triggerAttackRelease(notes, duration, Tone.now(), velocity);
      return;
    } else {
      synth.triggerAttack(notes, Tone.now(), velocity);
    }
  };

  // Handle incoming MIDI noteOff messages
  const onNoteOff = (notes: (string | number)[]) => {
    console.log("onNoteOff: Received notes:", notes);
    synth.triggerRelease(notes, Tone.now());
  };

  // Handle enabling of MIDI
  const onMidiEnabled = () => {
    console.log("MIDI enabled", WebMidi.inputs);
    const MIDIInputOptions = WebMidi.inputs.map((input) => ({
      label: input.name,
      value: input.id,
    }));
    MIDIInputOptions.unshift({ label: "None", value: "none" });
    setMidiInputOptions(MIDIInputOptions);
  };

  // Enable the webMIDI APIs upon load
  useEffect(() => {
    WebMidi.enable()
      .then(onMidiEnabled)
      .catch((err) => alert(err));
  }, []);

  // Add listeners for incoming MIDI messages
  useEffect(() => {
    if (midiInput === "none" || !WebMidi.enabled) {
      return;
    }

    const selectedInput = WebMidi.getInputById(midiInput);
    if (!selectedInput) {
      return;
    }

    console.log("Adding note on/off listeners...");

    selectedInput.addListener("noteon", (e) => {
      const noteString = Tone.Midi(e.data[1]).toNote();
      console.log(`Received noteOn from ${selectedInput.name}: `, noteString);
      onNoteOn([noteString]);
    });

    selectedInput.addListener("noteoff", (e) => {
      const noteString = Tone.Midi(e.data[1]).toNote();
      console.log(`Received noteOn from ${selectedInput.name}: `, e);
      onNoteOff([noteString]);
    });

    return () => {
      selectedInput.removeListener("noteon");
      selectedInput.removeListener("noteoff");
    };
  }, [midiInput, WebMidi.enabled]);

  console.log(synth.get(), "synth.get()");

  return (
    <StyledSynthesizer $isOn={power}>
      <StyledModuleContainer>
        <OscillatorModule name="Oscillator" componentKey="oscillator" />
        <FilterWithEnvelopeModule componentKey="filterEnvelope" name="Filter" />
        <AmpEnvelopeModule componentKey="envelope" name="Amp" />
      </StyledModuleContainer>

      <Keyboard
        activeNotes={activeNotes}
        name="keyboard"
        componentKey="keyboard"
      />

      <StyledDevUtilityContainer>
        <button
          onClick={() => {
            setPower(!power);
          }}
        >
          Power Button ({power ? "On" : "Off"})
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
  );
};

export default Synthesizer;
