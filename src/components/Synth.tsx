/**
 * Synth.tsx
 * Main synthesizer component that integrates all audio modules and controls.
 * Provides the visual interface and handles audio initialization, note triggering,
 * and MIDI input management.
 */

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

// UI Constants
const OPACITY_POWERED_OFF = 0.25;
const TRANSITION_DURATION = "0.3s";

/**
 * Styled Components
 * Define the layout and appearance of the synthesizer interface
 */
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

/**
 * Main Synthesizer Component
 * Integrates all synth modules and manages audio state
 */
const Synthesizer: React.FC = () => {
  // Get synth context and initialize state
  const { power, setPower, synth, effects, noteTracker } = useSynth();
  const [visualNotes, setVisualNotes] = React.useState<Tone.Unit.Frequency[]>([]);

  /**
   * Initialize synth parameters
   * Sets up default values for synth and effects when component mounts
   */
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

  /**
   * Power state management
   * Handles audio context initialization when synth is powered on
   */
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

  /**
   * Note tracker subscription
   * Updates visual feedback when notes change
   */
  React.useEffect(() => {
    const unsubscribe = noteTracker.subscribe(setVisualNotes);
    return () => {
      unsubscribe();
    };
  }, [noteTracker]);

  /**
   * Note handling functions
   * Manages note triggering and release for both keyboard and MIDI input
   */
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
      {/* Control Bar - Power and MIDI Input */}
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

      {/* Main Synth Interface */}
      <StyledSynthBody
        sx={{
          opacity: power ? 1 : OPACITY_POWERED_OFF,
          transition: `opacity ${TRANSITION_DURATION} ease-in-out`,
        }}
      >
        {/* Module Grid - Sound Generation and Effects */}
        <StyledModuleContainer
          sx={{
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          {/* Sound Generation Modules */}
          <OscillatorModule name="Oscillator" />
          <FilterModule name="Filter" />
          <AmpEnvelopeModule name="Amp" />
          <LFOModule name="LFO" />

          {/* Effects Chain Modules */}
          <ChorusModule name="Chorus" />
          <DelayModule name="Delay" />
          <ReverbModule name="Reverb" />
          <MasterBusModule name="Master" />
        </StyledModuleContainer>
      </StyledSynthBody>

      {/* Virtual Keyboard */}
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
