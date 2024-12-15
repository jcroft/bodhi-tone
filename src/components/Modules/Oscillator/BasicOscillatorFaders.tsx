/**
 * BasicOscillatorFaders.tsx
 * Provides the basic tuning controls for the oscillator.
 * Includes octave, coarse (semitones), and fine (cents) tuning controls.
 */

import React from "react";
import Fader from "../../Input/Fader";
import { BasicOscillatorFadersProps } from "./oscillatorTypes";
import {
  MIN_OCTAVE,
  MAX_OCTAVE,
  OCTAVE_STEP,
  MIN_SEMITONES,
  MAX_SEMITONES,
  SEMITONES_STEP,
  MIN_DETUNE,
  MAX_DETUNE,
  DETUNE_STEP,
} from "./oscillatorConstants";

/**
 * BasicOscillatorFaders Component
 * Renders three vertical faders for pitch control:
 * - Octave: Coarse pitch adjustment in 12-semitone steps
 * - Coarse: Semitone adjustment within an octave
 * - Fine: Cents adjustment for precise tuning
 */
const BasicOscillatorFaders: React.FC<BasicOscillatorFadersProps> = ({
  synthState,
  updateSynthSettings,
}) => {
  /**
   * Helper function to create a standardized fader control
   * @param id - Unique identifier for the fader
   * @param label - Display label
   * @param min - Minimum value
   * @param max - Maximum value
   * @param step - Step size between values
   * @param value - Current value
   * @param onChange - Value change handler
   */
  const createFader = (
    id: string,
    label: string,
    min: number,
    max: number,
    step: number,
    value: number,
    onChange: (newValue: number) => void
  ) => (
    <Fader
      key={id}
      id={id}
      label={label}
      value={value}
      sliderProps={{
        valueLabelDisplay: "auto",
        orientation: "vertical",
        min,
        max,
        step,
        track: false,
        onChange: (_, newValue) => {
          if (typeof newValue === "number") {
            onChange(newValue);
          }
        },
      }}
    />
  );

  return (
    <>
      {/* Octave control: Adjusts pitch in 12-semitone steps */}
      {createFader(
        "octave",
        "Octave",
        MIN_OCTAVE,
        MAX_OCTAVE,
        OCTAVE_STEP,
        parseFloat(synthState?.detune.toString()) / 1200,
        (newValue) => updateSynthSettings({ detune: newValue * 1200 })
      )}
      {/* Coarse tuning: Adjusts pitch in semitone steps */}
      {createFader(
        "semitones",
        "Coarse",
        MIN_SEMITONES,
        MAX_SEMITONES,
        SEMITONES_STEP,
        (parseFloat(synthState?.detune.toString()) % 1200) / 100,
        (newValue) =>
          updateSynthSettings({
            detune:
              Math.floor(synthState?.detune / 1200) * 1200 + newValue * 100,
          })
      )}
      {/* Fine tuning: Adjusts pitch in cents */}
      {createFader(
        "detune",
        "Fine",
        MIN_DETUNE,
        MAX_DETUNE,
        DETUNE_STEP,
        parseFloat(synthState?.detune.toString()) % 100,
        (newValue) =>
          updateSynthSettings({
            detune: Math.floor(synthState?.detune / 100) * 100 + newValue,
          })
      )}
    </>
  );
};

export default BasicOscillatorFaders;
