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

const OPACITY_POWERED_OFF = 0.25;
const TRANSITION_DURATION = "0.3s";

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

  React.useEffect(() => {
    if (synth && effects.chorus && effects.delay && effects.reverb) {
      synth.chain(effects.chorus, effects.delay, effects.reverb);
      synth.toDestination();
    }
  }, [synth, effects]);

  // Handle incoming MIDI noteOn messages
  const onNoteOn = React.useCallback(
    (
      notes: Tone.Unit.Frequency[],
      velocity?: number,
      duration?: Tone.Unit.Time
    ) => {
      if (!synth) return;

      if (duration) {
        setActiveNotes((prevList) => [...prevList, ...notes]);
        synth.triggerAttackRelease(notes, duration, Tone.now(), velocity);
        setTimeout(() => {
          setActiveNotes((prevList) =>
            prevList.filter((note) => !notes.includes(note))
          );
        }, Tone.Time(duration).toMilliseconds());
      } else {
        setActiveNotes((prevList) => [...prevList, ...notes]);
        synth.triggerAttack(notes, Tone.now(), velocity);
      }
    },
    [setActiveNotes, synth]
  );

  // Handle incoming MIDI noteOff messages
  const onNoteOff = React.useCallback(
    (notes: Tone.Unit.Frequency[]) => {
      if (!synth) return;
      setActiveNotes((prevNotes) =>
        prevNotes.filter((note) => !notes.includes(note))
      );
      synth.triggerRelease(notes, Tone.now());
    },
    [setActiveNotes, synth]
  );

  const theme = useTheme();

  return (
    <SynthProvider>
      <StyledSynthesizer
        sx={{
          justifyContent: { xxs: "flex-sart", sm: "center" },
        }}
      >
        <StyledMenuBar>
          <PowerButton
            isOn={power}
            onClick={() => setPower(!power)}
            aria-label={power ? "Turn off synthesizer" : "Turn on synthesizer"}
          />
          <MIDIInputSelect
            label="MIDI Input"
            onNoteOn={onNoteOn}
            onNoteOff={onNoteOff}
          />
        </StyledMenuBar>
        <StyledSynthBody
          sx={{
            opacity: power ? 1 : OPACITY_POWERED_OFF,
            transition: `opacity ${TRANSITION_DURATION} ease-in-out`,
          }}
        >
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
