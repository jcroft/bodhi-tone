/**
 * AdditionalOscillatorFaders.tsx
 * Provides additional parameter controls specific to each oscillator type.
 * Different oscillator types (FM, AM, Fat, Pulse) have their own unique parameters
 * that affect the timbre and character of the sound.
 */

import React from "react";
import Fader from "../../Input/Fader";
import { AdditionalOscillatorFadersProps } from "./oscillatorTypes";

/**
 * AdditionalOscillatorFaders Component
 * Renders different sets of faders based on the selected oscillator type:
 * - FM: Modulation Index and Harmonicity
 * - AM: Harmonicity
 * - Fat: Spread and Count (for detuned unison)
 * - Pulse: Width (pulse width modulation)
 */
const AdditionalOscillatorFaders: React.FC<AdditionalOscillatorFadersProps> = ({
  synthState,
  updateSynthSettings,
  oscillatorType,
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
        orientation: "horizontal",
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

  /**
   * FM Oscillator Controls
   * - Modulation Index: Depth of frequency modulation
   * - Harmonicity: Ratio between carrier and modulator frequencies
   */
  const getFMFaders = () => [
    createFader(
      "modulationIndex",
      "Mod Index",
      0,
      100,
      1,
      (synthState?.oscillator as any)?.modulationIndex || 0,
      (newValue) =>
        updateSynthSettings({ oscillator: { modulationIndex: newValue } })
    ),
    createFader(
      "harmonicity",
      "Harmonicity",
      0,
      10,
      0.1,
      (synthState?.oscillator as any)?.harmonicity || 1,
      (newValue) =>
        updateSynthSettings({ oscillator: { harmonicity: newValue } })
    ),
  ];

  /**
   * AM Oscillator Controls
   * - Harmonicity: Ratio between carrier and modulator frequencies
   */
  const getAMFaders = () => [
    createFader(
      "harmonicity",
      "Harmonicity",
      0,
      10,
      0.1,
      (synthState?.oscillator as any)?.harmonicity || 1,
      (newValue) =>
        updateSynthSettings({ oscillator: { harmonicity: newValue } })
    ),
  ];

  /**
   * Fat Oscillator Controls
   * - Spread: Detune spread between unison voices
   * - Count: Number of detuned voices
   */
  const getFatFaders = () => [
    createFader(
      "spread",
      "Spread",
      0,
      100,
      1,
      (synthState?.oscillator as any)?.spread || 0,
      (newValue) => updateSynthSettings({ oscillator: { spread: newValue } })
    ),
    createFader(
      "count",
      "Count",
      1,
      8,
      1,
      (synthState?.oscillator as any)?.count || 1,
      (newValue) => updateSynthSettings({ oscillator: { count: newValue } })
    ),
  ];

  /**
   * Pulse Oscillator Controls
   * - Width: Pulse width (duty cycle) of the waveform
   */
  const getPulseFaders = () => [
    createFader(
      "width",
      "Width",
      0,
      1,
      0.01,
      (synthState?.oscillator as any)?.width || 0.5,
      (newValue) => updateSynthSettings({ oscillator: { width: newValue } })
    ),
  ];

  /**
   * Returns the appropriate set of faders based on oscillator type
   */
  const getAdditionalFaders = () => {
    if (oscillatorType.startsWith("fm")) return getFMFaders();
    if (oscillatorType.startsWith("am")) return getAMFaders();
    if (oscillatorType.startsWith("fat")) return getFatFaders();
    if (oscillatorType === "pulse") return getPulseFaders();
    return null;
  };

  const additionalFaders = getAdditionalFaders();

  return additionalFaders ? <>{additionalFaders}</> : null;
};

export default AdditionalOscillatorFaders;
