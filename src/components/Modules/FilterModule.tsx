"use client";

import React from "react";
import BaseModule from "./BaseModule";
import * as Tone from "tone";
import Fader from "../Input/Fader";
import { useSynth } from "@/contexts/SynthContext";
import PowerButton from "../PowerButton";
import Select from "../Input/Select";

type FilterModuleOptions = {
  name?: string;
};

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

const FILTER_SLOPES = [-12, -24, -48, -96] as const;

const FilterModule: React.FC<FilterModuleOptions> = ({
  name = "Filter",
}) => {
  const { effects } = useSynth();
  const { filter } = effects;
  const [power, setPower] = React.useState(true);
  const [filterType, setFilterType] = React.useState<typeof FILTER_TYPES[number]>("lowpass");
  const [filterSlope, setFilterSlope] = React.useState<typeof FILTER_SLOPES[number]>(-12);

  // Store the previous filter settings when turning off
  const previousSettings = React.useRef({
    frequency: 2000,
    Q: 1,
    gain: 0,
    type: "lowpass" as typeof FILTER_TYPES[number]
  });

  // Convert between linear slider value and logarithmic frequency
  const freqToSlider = (freq: number) => Math.log2(freq / 20) * 100;
  const sliderToFreq = (value: number) => 20 * Math.pow(2, value / 100);

  // Update filter when power changes
  React.useEffect(() => {
    if (!filter) return;

    if (power) {
      // Restore previous settings
      filter.set({
        frequency: previousSettings.current.frequency,
        Q: previousSettings.current.Q,
        gain: previousSettings.current.gain,
        type: previousSettings.current.type
      });
    } else {
      // Store current settings
      previousSettings.current = {
        frequency: filter.frequency.value,
        Q: filter.Q.value,
        gain: filter.gain.value,
        type: filterType
      };
      
      // Set filter to be completely open
      filter.set({
        type: "allpass",
        frequency: 20000,
        Q: 0.1,
        gain: 0
      });
    }
  }, [filter, power, filterType]);

  // Update stored settings when user changes them
  const updateFilterAndStore = React.useCallback((settings: Partial<Tone.FilterOptions>) => {
    if (!filter || !power) return;
    filter.set(settings);
    if (settings.type) {
      previousSettings.current.type = settings.type as typeof FILTER_TYPES[number];
    }
    if (settings.frequency !== undefined) {
      previousSettings.current.frequency = settings.frequency;
    }
    if (settings.Q !== undefined) {
      previousSettings.current.Q = settings.Q;
    }
    if (settings.gain !== undefined) {
      previousSettings.current.gain = settings.gain;
    }
  }, [filter, power]);

  const frequencyFader = React.useMemo(
    () => (
      <Fader
        key="frequency"
        id="frequency"
        label="Freq"
        value={freqToSlider(power ? filter?.frequency.value ?? 2000 : previousSettings.current.frequency)}
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
    [filter, power, updateFilterAndStore]
  );

  const resonanceFader = React.useMemo(
    () => (
      <Fader
        key="Q"
        id="Q"
        label="Reso"
        value={power ? filter?.Q.value ?? 1 : previousSettings.current.Q}
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
    [filter, power, updateFilterAndStore]
  );

  const gainFader = React.useMemo(
    () => (
      <Fader
        key="gain"
        id="gain"
        label="Gain"
        value={power ? filter?.gain.value ?? 0 : previousSettings.current.gain}
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
    [filter, power, updateFilterAndStore]
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
    >
      <form>
        <div className="control-group" style={{ flexDirection: 'column', gap: '0.5rem' }}>
          <Select
            label="Type"
            value={filterType}
            onChange={(e) => {
              const newType = e.target.value as typeof FILTER_TYPES[number];
              setFilterType(newType);
              updateFilterAndStore({ type: newType });
            }}
            options={FILTER_TYPES.map((type) => ({
              value: type,
              label: type.charAt(0).toUpperCase() + type.slice(1),
            }))}
          />
          <Select
            label="Slope"
            value={filterSlope.toString()}
            onChange={(e) => {
              const newSlope = parseInt(e.target.value) as typeof FILTER_SLOPES[number];
              setFilterSlope(newSlope);
              filter?.set({ rolloff: newSlope });
            }}
            options={FILTER_SLOPES.map((slope) => ({
              value: slope.toString(),
              label: `${slope} dB/oct`,
            }))}
          />
        </div>
        <div className="control-group transparent">
          {frequencyFader}
          {resonanceFader}
          {gainFader}
        </div>
      </form>
    </BaseModule>
  );
};

export default FilterModule;
