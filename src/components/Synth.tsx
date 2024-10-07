"use client";

import AmpEnvelopeModule from "@/components/Modules/AmpEnvelopeModule";
import FilterWithEnvelopeModule from "@/components/Modules/FilterEnvelope";
import OscillatorModule from "@/components/Modules/OscillatorModule";
import React from "react";
import * as Tone from "tone";
import { styled, useTheme } from "@mui/material/styles";
import Keyboard from "./Keyboard/Keyboard";
import MIDIInputSelect from "./MIDI/MIDIInputSelect";
import PowerButton from "./PowerButton";
import ReverbModule from "./Modules/ReverbModule";
import DelayModule from "./Modules/DelayModule";
import ChorusModule from "./Modules/ChorusModule";
import GlobalControlModule from "./Modules/GlobalControlModule";
import { SynthProvider, useSynth } from "@/contexts/SynthContext";

const StyledSynthesizer = styled("div")`
  display: flex;
  flex-direction: column;
  transition: opacity 0.3s ease-in-out;
  max-width: 845px;
  gap: 0.5rem;
`;

const StyledSynthBody = styled("div")`
  background-color: #222;
  padding: 0.5rem;
  border-radius: 0.5rem;
`;

const StyledModuleContainer = styled("div")`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const StyledMenuBar = styled("div")`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 1rem;
  font-size: 0.75rem;

  [class^="Select__StyledSelectWrapper"] {
    flex-direction: row;
    gap: 0.5rem;
  }
`;

const Synthesizer: React.FC = () => {
  const { power, setPower, synth, effects, activeNotes, setActiveNotes } =
    useSynth();

  // Connect the synth to the effects
  synth?.chain(effects.chorus, effects.delay, effects.reverb);

  // Send the output of the synth to the primary output
  synth?.toDestination();

  // Handle incoming MIDI noteOn messages
  const onNoteOn = (
    notes: (string | number)[],
    velocity?: number,
    duration?: Tone.Unit.Time
  ) => {
    if (duration) {
      setActiveNotes((prevList) => [...prevList, ...notes]);
      synth?.triggerAttackRelease(notes, duration, Tone.now(), velocity);
      setTimeout(() => {
        setActiveNotes((prevList) =>
          prevList.filter((note) => !notes.includes(note))
        );
      }, Tone.Time(duration).toMilliseconds());
      return;
    } else {
      setActiveNotes((prevList) => [...prevList, ...notes]);
      synth?.triggerAttack(notes, Tone.now(), velocity);
    }
  };

  // Handle incoming MIDI noteOff messages
  const onNoteOff = (notes: (string | number)[]) => {
    setActiveNotes(activeNotes.filter((note) => !notes.includes(note)));
    synth?.triggerRelease(notes, Tone.now());
  };

  const theme = useTheme();

  return (
    <SynthProvider>
      <StyledSynthesizer
        sx={{
          justifyContent: { xxs: "flex-sart", sm: "center" },
        }}
      >
        <StyledMenuBar>
          <PowerButton isOn={power} onClick={() => setPower(!power)} />
          <MIDIInputSelect
            label="MIDI Input"
            onNoteOn={onNoteOn}
            onNoteOff={onNoteOff}
          />
        </StyledMenuBar>
        <StyledSynthBody sx={{ opacity: power ? 1 : 0.25 }}>
          <StyledModuleContainer
            sx={{
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            <GlobalControlModule name="Main" />
            <OscillatorModule name="Oscillator" />
            <FilterWithEnvelopeModule name="Filter" />
            <AmpEnvelopeModule name="Amp" />

            <ChorusModule name="Chorus" />
            <DelayModule name="Delay" />
            <ReverbModule name="Reverb" />
          </StyledModuleContainer>
        </StyledSynthBody>

        <Keyboard
          name="keyboard"
          onNoteOn={onNoteOn}
          onNoteOff={onNoteOff}
          activeNotes={activeNotes}
        />
      </StyledSynthesizer>
    </SynthProvider>
  );
};

export default Synthesizer;
