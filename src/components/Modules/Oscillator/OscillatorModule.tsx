/**
 * OscillatorModule.tsx
 * Main oscillator control module for the synthesizer.
 * Provides a complete interface for controlling the synthesizer's oscillator parameters,
 * including type selection, tuning, and additional parameters based on oscillator type.
 */

import React from "react";
import BaseModule from "../BaseModule";
import { useSynth } from "@/contexts/SynthContext";
import OscillatorTypeSelect from "./OscillatorTypeSelect";
import { OscillatorModuleProps } from "./oscillatorTypes";
import * as Tone from "tone";
import BasicOscillatorFaders from "./BasicOscillatorFaders";
import AdditionalOscillatorFaders from "./AdditionalOscillatorFaders";
import { RecursivePartial } from "tone/build/esm/core/util/Interface";

/**
 * OscillatorModule Component
 * Combines all oscillator controls into a single module interface.
 * Includes:
 * - Oscillator type selection (sine, square, sawtooth, etc.)
 * - Additional parameters specific to the selected oscillator type
 * - Basic tuning controls (octave, coarse, fine)
 */
const OscillatorModule: React.FC<OscillatorModuleProps> = ({
  name = "Oscillator",
}) => {
  const { synth } = useSynth();
  const synthState = synth?.get() as Tone.MonoSynthOptions;

  // Callback to update synth settings while maintaining type safety
  const updateSynthSettings = React.useCallback(
    (options: RecursivePartial<Tone.MonoSynthOptions>) => {
      synth?.set(options);
    },
    [synth]
  );

  const oscillatorType = synthState?.oscillator?.type as OscillatorType;

  return (
    <BaseModule name={name}>
      {/* Oscillator type selection and type-specific parameters */}
      <form className="column">
        <div className="control-group transparent">
          <OscillatorTypeSelect
            synthState={synthState}
            updateSynthSettings={updateSynthSettings}
          />
          <AdditionalOscillatorFaders
            synthState={synthState}
            updateSynthSettings={updateSynthSettings}
            oscillatorType={oscillatorType}
          />
        </div>
      </form>
      {/* Basic tuning controls */}
      <form>
        <div className="control-group">
          <h3>Tuning</h3>
          <BasicOscillatorFaders
            synthState={synthState}
            updateSynthSettings={updateSynthSettings}
          />
        </div>
      </form>
    </BaseModule>
  );
};

export default OscillatorModule;
