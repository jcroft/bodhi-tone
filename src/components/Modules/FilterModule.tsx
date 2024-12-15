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

  // Convert between linear slider value and logarithmic frequency
  const freqToSlider = (freq: number) => Math.log2(freq / 20) * 100;
  const sliderToFreq = (value: number) => 20 * Math.pow(2, value / 100);

  // Update filter wet value when power changes
  React.useEffect(() => {
    if (filter) {
      filter.set({ wet: power ? 1 : 0 });
    }
  }, [filter, power]);

  const frequencyFader = React.useMemo(
    () => (
      <Fader
        key="frequency"
        id="frequency"
        label="Freq"
        value={freqToSlider(filter?.frequency.value ?? 2000)}
        sliderProps={{
          valueLabelDisplay: "auto",
          valueLabelFormat: (value: number) => `${Math.round(sliderToFreq(value))} Hz`,
          orientation: "vertical",
          min: 0, // log2(20/20) * 100 = 0
          max: 1000, // log2(20000/20) * 100 ≈ 1000
          step: 1,
          onChange: (_, value) => {
            const freq = sliderToFreq(value as number);
            filter?.frequency.setValueAtTime(freq, Tone.now());
          },
        }}
      />
    ),
    [filter]
  );

  const resonanceFader = React.useMemo(
    () => (
      <Fader
        key="Q"
        id="Q"
        label="Reso"
        value={filter?.Q.value ?? 1}
        sliderProps={{
          valueLabelDisplay: "auto",
          orientation: "vertical",
          min: 0,
          max: 20,
          step: 0.1,
          onChange: (_, value) => {
            filter?.Q.setValueAtTime(value as number, Tone.now());
          },
        }}
      />
    ),
    [filter]
  );

  const gainFader = React.useMemo(
    () => (
      <Fader
        key="gain"
        id="gain"
        label="Gain"
        value={filter?.gain.value ?? 0}
        sliderProps={{
          valueLabelDisplay: "auto",
          orientation: "vertical",
          min: -40,
          max: 40,
          step: 0.1,
          onChange: (_, value) => {
            filter?.gain.setValueAtTime(value as number, Tone.now());
          },
        }}
      />
    ),
    [filter]
  );

  return (
    <BaseModule
      name={name}
      headerContent={
        <PowerButton
          checked={power}
          onChange={(checked) => setPower(checked)}
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
              filter?.set({ type: newType });
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
