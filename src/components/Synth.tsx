"use client";

import AmpEnvelopeModule from "@/components/Modules/AmpEnvelopeModule";
import FilterModule from "@/components/Modules/FilterModule";
import OscillatorModule from "@/components/Modules/Oscillator/OscillatorModule";
import MasterBusModule from "@/components/Modules/MasterBusModule";
import React from "react";
import * as Tone from "tone";
import { styled, useTheme } from "@mui/material/styles";
import Keyboard from "./Keyboard/Keyboard";
import MIDIInputSelect from "./MIDI/MIDIInputSelect";
import PowerButton from "./PowerButton";
import ReverbModule from "./Modules/ReverbModule";
import DelayModule from "./Modules/DelayModule";
import ChorusModule from "./Modules/ChorusModule";
import LFOModule from "./Modules/LFOModule";
import {
  DEFAULT_EFFECTS_OPTIONS,
  DEFAULT_SYNTH_OPTIONS,
  SynthProvider,
  useSynth,
} from "@/contexts/SynthContext";
import { RecursivePartial } from "tone/build/esm/core/util/Interface";

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
  const { power, setPower, synth, effects, noteTracker } = useSynth();
  const [visualNotes, setVisualNotes] = React.useState<Tone.Unit.Frequency[]>([]);

  // Initialize synth parameters only once
  const isInitialized = React.useRef(false);
  React.useEffect(() => {
    if (
      !isInitialized.current &&
      synth &&
      effects.chorus &&
      effects.delay &&
      effects.reverb &&
      DEFAULT_EFFECTS_OPTIONS
    ) {
      // Set initial parameters without reconnecting
      synth.set(DEFAULT_SYNTH_OPTIONS);
      effects.chorus.set(
        DEFAULT_EFFECTS_OPTIONS.chorus as RecursivePartial<Tone.ChorusOptions>
      );
      effects.delay.set(
        DEFAULT_EFFECTS_OPTIONS.delay as RecursivePartial<Tone.PingPongDelayOptions>
      );
      effects.reverb.set(
        DEFAULT_EFFECTS_OPTIONS.reverb as RecursivePartial<Tone.JCReverbOptions>
      );
      isInitialized.current = true;
    }
  }, [synth, effects]);

  // Handle power state and audio context
  React.useEffect(() => {
    const handlePowerChange = async () => {
      try {
        if (power) {
          await Tone.start();
          console.log("Audio context started");
        }
      } catch (error) {
        console.error("Failed to start audio context:", error);
        setPower(false);
      }
    };

    handlePowerChange();
  }, [power, setPower]);

  // Subscribe to note tracker changes for visual updates
  React.useEffect(() => {
    const unsubscribe = noteTracker.subscribe(setVisualNotes);
    return () => {
      unsubscribe();
    };
  }, [noteTracker]);

  // Memoize note handlers to prevent unnecessary recreations
  const onNoteOn = React.useCallback(
    (
      notes: Tone.Unit.Frequency[],
      velocity?: number,
      duration?: Tone.Unit.Time
    ) => {
      if (!synth || !power) return;

      const now = Tone.now();
      if (duration) {
        noteTracker.addNotes(notes, velocity);
        synth.triggerAttackRelease(notes, duration, now, velocity);
        
        // Schedule note removal after duration
        const releaseTime = Tone.Time(duration).toMilliseconds();
        setTimeout(() => {
          noteTracker.removeNotes(notes);
        }, releaseTime);
      } else {
        noteTracker.addNotes(notes, velocity);
        synth.triggerAttack(notes, now, velocity);
      }
    },
    [noteTracker, synth, power]
  );

  const onNoteOff = React.useCallback(
    (notes: Tone.Unit.Frequency[]) => {
      if (!synth || !power) return;
      noteTracker.removeNotes(notes);
      synth.triggerRelease(notes, Tone.now());
    },
    [noteTracker, synth, power]
  );

  return (
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
          variant="main"
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
          <OscillatorModule name="Oscillator" />
          <FilterModule name="Filter" />
          <AmpEnvelopeModule name="Amp" />
          <LFOModule name="LFO" />

          <ChorusModule name="Chorus" />
          <DelayModule name="Delay" />
          <ReverbModule name="Reverb" />
          <MasterBusModule name="Master" />
        </StyledModuleContainer>
      </StyledSynthBody>

      <Keyboard
        name="keyboard"
        onNoteOn={onNoteOn}
        onNoteOff={onNoteOff}
        activeNotes={visualNotes}
      />
    </StyledSynthesizer>
  );
};

export default Synthesizer;
