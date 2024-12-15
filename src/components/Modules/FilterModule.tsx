/**
 * FilterModule.tsx
 * Audio filter module providing frequency, resonance, and gain control.
 * Supports multiple filter types (lowpass, highpass, etc.) and slopes,
 * with power control for bypassing the filter when needed.
 */

"use client";

import React from "react";
import BaseModule from "./BaseModule";
import * as Tone from "tone";
import Fader from "../Input/Fader";
import { useSynth } from "@/contexts/SynthContext";
import PowerButton from "../PowerButton";
import Select from "../Input/Select";

/**
 * Module Props Interface
 * @property {string} name - Display name of the module
 */
type FilterModuleOptions = {
  name?: string;
};

/**
 * Available filter types from Tone.js
 * Each type shapes the frequency response differently:
 * - lowpass: Allows frequencies below cutoff to pass
 * - highpass: Allows frequencies above cutoff to pass
 * - bandpass: Allows a band of frequencies to pass
 * - etc.
 */
const FILTER_TYPES = [
  "lowpass",
  "highpass",
  "bandpass",
  "lowshelf",
  "highshelf",
  "notch",
  "allpass",
  "peaking"
] as const;

/**
 * Available filter slopes (dB/octave)
 * Higher values create steeper cutoffs
 */
const FILTER_SLOPES = [-12, -24, -48, -96] as const;

/**
 * FilterModule Component
 * Controls the audio filter parameters of the synthesizer.
 * Features:
 * - Filter type selection
 * - Cutoff frequency control (logarithmic)
 * - Resonance (Q) control
 * - Gain control for supported filter types
 * - Filter slope selection
 * - Power button to bypass filter
 */
const FilterModule: React.FC<FilterModuleOptions> = ({
  name = "Filter",
}) => {
  const { effects } = useSynth();
  const { filter } = effects;
  const [power, setPower] = React.useState(true);
  const [filterType, setFilterType] = React.useState<typeof FILTER_TYPES[number]>("lowpass");
  const [filterSlope, setFilterSlope] = React.useState<typeof FILTER_SLOPES[number]>(-12);

  /**
   * Store filter settings when bypassed
   * Used to restore settings when re-enabling the filter
   */
  const previousSettings = React.useRef({
    frequency: 2000,
    Q: 1,
    gain: 0,
    type: "lowpass" as typeof FILTER_TYPES[number],
    slope: -12 as typeof FILTER_SLOPES[number]
  });

  /**
   * Frequency conversion utilities
   * Convert between linear slider values and logarithmic frequency
   * for more natural frequency control
   */
  const freqToSlider = (freq: number) => Math.log2(freq / 20) * 100;
  const sliderToFreq = (value: number) => 20 * Math.pow(2, value / 100);

  /**
   * Power state effect handler
   * - When powered off: stores current settings and sets filter to bypass mode
   * - When powered on: restores previous filter settings
   */
  React.useEffect(() => {
    if (!filter) return;

    if (power) {
      // Restore previous settings
      filter.set({
        frequency: previousSettings.current.frequency,
        Q: previousSettings.current.Q,
        gain: previousSettings.current.gain,
        type: previousSettings.current.type,
        rolloff: previousSettings.current.slope
      });
      setFilterType(previousSettings.current.type);
      setFilterSlope(previousSettings.current.slope);
    } else {
      // Store current settings
      previousSettings.current = {
        frequency: filter.frequency.value,
        Q: filter.Q.value,
        gain: filter.gain.value,
        type: filterType,
        slope: filterSlope
      };
      
      // Set filter to be completely open
      filter.set({
        type: "allpass",
        frequency: 20000,
        Q: 0.1,
        gain: 0,
        rolloff: -12
      });
    }
  }, [filter, power, filterType, filterSlope]);

  /**
   * Updates filter settings and stores new values
   * Only updates if the module is powered on
   * Dispatches custom event for filter frequency changes
   */
  const updateFilterAndStore = React.useCallback((settings: Partial<Tone.FilterOptions>) => {
    if (!filter || !power) return;

    // Update the filter
    filter.set(settings);
    
    // Store the updated settings
    if (settings.type) {
      previousSettings.current.type = settings.type as typeof FILTER_TYPES[number];
    }
    if (settings.frequency !== undefined) {
      previousSettings.current.frequency = settings.frequency;
      // Trigger a custom event when frequency changes
      const event = new CustomEvent('filterFrequencyChange', { 
        detail: { frequency: settings.frequency } 
      });
      window.dispatchEvent(event);
    }
    if (settings.Q !== undefined) {
      previousSettings.current.Q = settings.Q;
    }
    if (settings.gain !== undefined) {
      previousSettings.current.gain = settings.gain;
    }
    if (settings.rolloff !== undefined) {
      previousSettings.current.slope = settings.rolloff as typeof FILTER_SLOPES[number];
    }
  }, [filter, power]);

  /**
   * Memoized filter parameter controls
   * Each control updates both the active filter and stored settings
   */
  const frequencyFader = React.useMemo(
    () => (
      <Fader
        key="frequency"
        id="frequency"
        label="Freq"
        value={freqToSlider(previousSettings.current.frequency)}
        sliderProps={{
          valueLabelDisplay: "auto",
          valueLabelFormat: (value: number) => `${Math.round(sliderToFreq(value))} Hz`,
          orientation: "vertical",
          min: 0,
          max: 1000,
          step: 1,
          onChange: (_, value) => {
            const freq = sliderToFreq(value as number);
            updateFilterAndStore({ frequency: freq });
          },
        }}
      />
    ),
    [updateFilterAndStore]
  );

  const resonanceFader = React.useMemo(
    () => (
      <Fader
        key="Q"
        id="Q"
        label="Reso"
        value={previousSettings.current.Q}
        sliderProps={{
          valueLabelDisplay: "auto",
          orientation: "vertical",
          min: 0,
          max: 20,
          step: 0.1,
          onChange: (_, value) => {
            updateFilterAndStore({ Q: value as number });
          },
        }}
      />
    ),
    [updateFilterAndStore]
  );

  const gainFader = React.useMemo(
    () => (
      <Fader
        key="gain"
        id="gain"
        label="Gain"
        value={previousSettings.current.gain}
        sliderProps={{
          valueLabelDisplay: "auto",
          orientation: "vertical",
          min: -40,
          max: 40,
          step: 0.1,
          onChange: (_, value) => {
            updateFilterAndStore({ gain: value as number });
          },
        }}
      />
    ),
    [updateFilterAndStore]
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
        <div className="control-group" style={{ flexDirection: 'column', gap: '0.5rem' }}>
          {/* Filter type and slope selectors */}
          <Select
            label="Type"
            value={previousSettings.current.type}
            onChange={(event) => {
              const type = event.target.value as typeof FILTER_TYPES[number];
              setFilterType(type);
              updateFilterAndStore({ type });
            }}
            options={FILTER_TYPES.map((type) => ({
              value: type,
              label: type.charAt(0).toUpperCase() + type.slice(1),
            }))}
          />
          <Select
            label="Slope"
            value={previousSettings.current.slope.toString()}
            onChange={(event) => {
              const slope = parseInt(event.target.value) as typeof FILTER_SLOPES[number];
              setFilterSlope(slope);
              updateFilterAndStore({ rolloff: slope });
            }}
            options={FILTER_SLOPES.map((slope) => ({
              value: slope.toString(),
              label: `${slope} dB/oct`,
            }))}
          />
          {/* Filter parameter faders */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {frequencyFader}
            {resonanceFader}
            {gainFader}
          </div>
        </div>
      </form>
    </BaseModule>
  );
};

export default FilterModule;
