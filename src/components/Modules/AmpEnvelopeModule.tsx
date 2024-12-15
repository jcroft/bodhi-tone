/**
 * AmpEnvelopeModule.tsx
 * Amplitude envelope module for shaping the volume contour of each note.
 * Implements the classic ADSR (Attack, Decay, Sustain, Release) envelope
 * with power control for bypassing the envelope when needed.
 */

"use client";

import React from "react";
import BaseModule from "./BaseModule";
import * as Tone from "tone";
import Fader from "../Input/Fader";
import { useSynth } from "@/contexts/SynthContext";
import PowerButton from "../PowerButton";

/**
 * Module Props Interface
 * @property {string} name - Display name of the module
 */
type AmpEnvelopeModuleOptions = {
  name?: string;
};

/**
 * Valid envelope parameters for type safety
 */
type EnvelopeParam = "attack" | "decay" | "sustain" | "release";

/**
 * AmpEnvelopeModule Component
 * Controls the amplitude envelope (ADSR) of the synthesizer.
 * Features:
 * - Four vertical faders for ADSR control
 * - Power button to bypass envelope (instant attack/release)
 * - State persistence when toggling power
 */
const AmpEnvelopeModule: React.FC<AmpEnvelopeModuleOptions> = ({
  name = "Envelope",
}) => {
  const { synth } = useSynth();
  const synthState = synth?.get() as Tone.MonoSynthOptions;
  const [power, setPower] = React.useState(true);

  /**
   * Store envelope settings when bypassed
   * Used to restore settings when re-enabling the envelope
   */
  const previousSettings = React.useRef({
    attack: 0.01,
    decay: 0.1,
    sustain: 0.5,
    release: 0.5
  });

  /**
   * Power state effect handler
   * - When powered off: stores current settings and sets instant response
   * - When powered on: restores previous envelope settings
   */
  React.useEffect(() => {
    if (!synth) return;

    if (power) {
      // Restore previous settings
      synth.set({
        envelope: previousSettings.current
      });
    } else {
      // Store current settings before turning off
      const currentEnvelope = synth.get().envelope;
      previousSettings.current = {
        attack: currentEnvelope.attack,
        decay: currentEnvelope.decay,
        sustain: currentEnvelope.sustain,
        release: currentEnvelope.release
      };
      
      // Set envelope to instant response (no envelope)
      synth.set({
        envelope: {
          attack: 0.001,
          decay: 0.001,
          sustain: 1,
          release: 0.001
        }
      });
    }
  }, [synth, power]);

  /**
   * Updates synth settings and stores new values
   * Only updates if the module is powered on
   */
  const updateSynthSettings = React.useCallback(
    (options: Partial<Tone.MonoSynthOptions>) => {
      if (!synth || !power) return;
      synth.set(options);
      
      // Store the new envelope settings
      if (options.envelope) {
        previousSettings.current = {
          ...previousSettings.current,
          ...options.envelope
        };
      }
    },
    [synth, power]
  );

  /**
   * Creates a standardized fader for envelope parameters
   * @param param - The envelope parameter to control (ADSR)
   * @param label - Display label for the fader
   * @param min - Minimum value
   * @param max - Maximum value
   * @param step - Step size between values
   */
  const createFader = React.useCallback(
    (
      param: EnvelopeParam,
      label: string,
      min: number,
      max: number,
      step: number
    ) => (
      <Fader
        key={param}
        id={param}
        label={label}
        value={previousSettings.current[param]}
        sliderProps={{
          valueLabelDisplay: "auto",
          orientation: "vertical",
          min: min,
          max: max,
          step: step,
          onChange: (event: Event, newValue: number | number[]) => {
            updateSynthSettings({
              envelope: {
                ...synthState?.envelope,
                [param]: newValue,
              } as Omit<Tone.EnvelopeOptions, "context"> | undefined,
            });
          },
        }}
      />
    ),
    [synthState?.envelope, updateSynthSettings]
  );

  /**
   * Memoized array of ADSR faders
   * Prevents unnecessary recreation of fader components
   */
  const faders = React.useMemo(
    () =>
      [
        { param: "attack", label: "A", min: 0, max: 1, step: 0.01 },
        { param: "decay", label: "D", min: 0, max: 1, step: 0.01 },
        { param: "sustain", label: "S", min: 0, max: 1, step: 0.01 },
        { param: "release", label: "R", min: 0, max: 1, step: 0.01 },
      ].map(({ param, label, min, max, step }) =>
        createFader(param as EnvelopeParam, label, min, max, step)
      ),
    [createFader]
  );

  return (
    <BaseModule 
      name={name}
      headerContent={
        <PowerButton
          isOn={power}
          onClick={(checked) => setPower(checked)}
          variant="module"
        />
      }
      power={power}
    >
      <form>
        <div className="control-group">
          <h3>Envelope</h3>
          {faders}
        </div>
      </form>
    </BaseModule>
  );
};

export default AmpEnvelopeModule;
