"use client";

import React from "react";
import BaseModule from "./BaseModule";
import * as Tone from "tone";
import Fader from "../Input/Fader";
import { useSynth } from "@/contexts/SynthContext";
import { RecursivePartial } from "tone/build/esm/core/util/Interface";

type FilterParams = "Q";
type FilterEnvelopeParams =
  | "attack"
  | "decay"
  | "sustain"
  | "release"
  | "baseFrequency";

type FilterWithEnvelopeModuleOptions = {
  name: string;
};

const FilterWithEnvelopeModule: React.FC<FilterWithEnvelopeModuleOptions> = ({
  name = "Envelope",
}) => {
  const { synth } = useSynth();
  const synthState = synth?.get() as Tone.MonoSynthOptions;

  const updateSynthSettings = React.useCallback(
    (options: RecursivePartial<Tone.MonoSynthOptions>) => {
      synth?.set(options);
    },
    [synth]
  );

  const createFilterEnvelopeFader = React.useCallback(
    (
      param: FilterEnvelopeParams,
      label: string,
      min: number,
      max: number,
      step: number,
      valueLabelFormat?:
        | string
        | ((value: number, index: number) => React.ReactNode)
        | undefined
    ) => (
      <Fader
        key={param}
        id={param}
        label={label}
        value={parseFloat(synthState?.filterEnvelope?.[param]?.toString())}
        sliderProps={{
          valueLabelDisplay: "auto",
          valueLabelFormat: valueLabelFormat,
          orientation: "vertical",
          min: min,
          max: max,
          step: step,
          onChange: (event, newValue) => {
            updateSynthSettings({
              filterEnvelope: {
                [param]: newValue as number,
              } as Partial<Tone.FrequencyEnvelopeOptions>,
            });
          },
        }}
      />
    ),
    [synthState?.filterEnvelope, updateSynthSettings]
  );

  const createFilterFader = React.useCallback(
    (
      param: FilterParams,
      label: string,
      min: number,
      max: number,
      step: number,
      valueLabelFormat?:
        | string
        | ((value: number, index: number) => React.ReactNode)
        | undefined
    ) => (
      <Fader
        key={param}
        id={param}
        label={label}
        value={parseFloat(synthState?.filter?.[param]?.toString() ?? "0")}
        sliderProps={{
          valueLabelDisplay: "auto",
          valueLabelFormat: valueLabelFormat,
          orientation: "vertical",
          min: min,
          max: max,
          step: step,
          onChange: (event, newValue) => {
            updateSynthSettings({
              filter: {
                [param]: newValue as number,
              } as Tone.FilterOptions,
            });
          },
        }}
      />
    ),
    [synthState, updateSynthSettings]
  );

  const frequencyFader = React.useMemo(
    () =>
      createFilterEnvelopeFader(
        "baseFrequency",
        "Freq",
        20,
        2000,
        1,
        (value: number) => `${value.toFixed()} Hz`
      ),
    [createFilterEnvelopeFader]
  );

  const resonanceFader = React.useMemo(
    () => createFilterFader("Q", "Reso", 0, 20, 0.01),
    [createFilterFader]
  );

  const mainFaders = React.useMemo(
    () => [frequencyFader, resonanceFader],
    [frequencyFader, resonanceFader]
  );

  const envelopeFaders = React.useMemo(
    () =>
      [
        { param: "attack", label: "A", min: 0, max: 1, step: 0.01 },
        { param: "decay", label: "D", min: 0, max: 1, step: 0.01 },
        { param: "sustain", label: "S", min: 0, max: 1, step: 0.01 },
        { param: "release", label: "R", min: 0, max: 1, step: 0.01 },
      ].map(({ param, label, min, max, step }) =>
        createFilterEnvelopeFader(
          param as FilterEnvelopeParams,
          label,
          min,
          max,
          step
        )
      ),
    [createFilterEnvelopeFader]
  );

  return (
    <BaseModule name={name}>
      <form>
        <div className="control-group transparent">{mainFaders}</div>

        <div className="control-group">
          <h3>Envelope</h3>
          {envelopeFaders}
        </div>
      </form>
    </BaseModule>
  );
};

export default FilterWithEnvelopeModule;
