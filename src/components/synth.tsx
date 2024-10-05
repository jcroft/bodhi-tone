"use client";

import AmpEnvelopeModule from "@/components/AmpEnvelope";
import FilterWithEnvelopeModule from "@/components/FilterEnvelope";
import OscillatorModule from "@/components/Oscillator";
import React, { useContext, useEffect } from "react";
import * as Tone from "tone";
import styled from "styled-components";
import { WebMidi } from "webmidi";
import Select from "@/components/Input/Select";
import { SynthContext, DEFAULT_DUO_SYNTH_OPTIONS } from "@/app/page";
import { useLocalStorageState } from "@/hooks/useLocalStorageState";
import Keyboard from "./Keyboard/Keyboard";
import VoiceModule from "./VoiceControl";
import MIDIInputSelect from "./MIDI/MIDIInputSelect";
import PowerButton from "./PowerButton";

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
  gap: 0.5rem;
`;

const StyledMenuBar = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 1rem;
  background-color: #f0f0f0;
  font-size: 0.75rem;
  padding: 0.25rem;
  margin-bottom: 0.5rem;

  [class^="Select__StyledSelectWrapper"] {
    flex-direction: row;
    gap: 0.5rem;
  }
`;

const Synthesizer: React.FC = () => {
  // power: Tone.js requires a user interaction to enable the synth, so we'll have a power button
  const [power, setPower] = React.useState(false);

  // We need to store the active notes so they can be displayed on the keyboard
  const [activeNotes, setActiveNotes] = React.useState<(string | number)[]>([]);

  // synth: The Tone.PolySynth instantiated by SynthContext
  const { synth, synthOptions, saveSynthOptions } = useContext(SynthContext);

  // Set the default synth options
  synth.set({
    ...(DEFAULT_DUO_SYNTH_OPTIONS as Tone.PolySynthOptions<Tone.DuoSynthOptions>),
  });

  // Send the output of the synth to the primary output
  synth.toDestination();

  // turn the synth on when the user presses the power button
  useEffect(() => {
    if (power && Tone.context.state !== "running") {
      console.log("Powering on");
      Tone.start();
    }
  }, [power, synth]);

  // Handle incoming MIDI noteOn messages
  const onNoteOn = (
    notes: (string | number)[],
    velocity?: number,
    duration?: Tone.Unit.Time
  ) => {
    // console.log("onNoteOn: Received notes:", notes);
    if (duration) {
      setActiveNotes((prevList) => [...prevList, ...notes]);
      synth.triggerAttackRelease(notes, duration, Tone.now(), velocity);
      return;
    } else {
      setActiveNotes((prevList) => [...prevList, ...notes]);
      synth.triggerAttack(notes, Tone.now(), velocity);
    }
  };

  // Handle incoming MIDI noteOff messages
  const onNoteOff = (notes: (string | number)[]) => {
    // console.log("onNoteOff: Received notes:", notes);
    setActiveNotes(activeNotes.filter((note) => !notes.includes(note)));
    synth.triggerRelease(notes, Tone.now());
  };

  // If there is no synthOptions in local storage, set the default options
  useEffect(() => {
    if (!synthOptions) {
      console.log("No synth options found, setting defaults");
      saveSynthOptions(DEFAULT_DUO_SYNTH_OPTIONS);
    } else {
      console.log("Synth options found, setting them", synthOptions);
      synth.set(synthOptions);
    }
  }, [synthOptions]);

  return (
    <>
      <StyledMenuBar>
        <PowerButton isOn={power} onClick={() => setPower(!power)} />
        <MIDIInputSelect
          label="MIDI Input"
          componentKey="midiInput"
          onNoteOn={onNoteOn}
          onNoteOff={onNoteOff}
        />
      </StyledMenuBar>

      <StyledSynthesizer $isOn={power}>
        <StyledModuleContainer>
          <VoiceModule
            name="Control"
            componentKey="voiceControl"
            voiceKeys={["voice0", "voice1"]}
          />
          <OscillatorModule
            name="Osc 1"
            componentKey="osc1"
            voiceKeys={["voice0"]}
          />
          <OscillatorModule
            name="Osc 2"
            componentKey="osc2"
            voiceKeys={["voice1"]}
          />
          <FilterWithEnvelopeModule
            componentKey="filterEnvelope"
            name="Filter"
            voiceKeys={["voice0", "voice1"]}
          />
          <AmpEnvelopeModule
            componentKey="envelope"
            name="Amp"
            voiceKeys={["voice0", "voice1"]}
          />
        </StyledModuleContainer>

        <Keyboard
          activeNotes={activeNotes}
          name="keyboard"
          componentKey="keyboard"
        />
      </StyledSynthesizer>
    </>
  );
};

export default Synthesizer;
