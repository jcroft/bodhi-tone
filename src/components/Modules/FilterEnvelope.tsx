"use client";

import React from "react";
import BaseModule from "./BaseModule";
import * as Tone from "tone";
import { SynthContext } from "../Synth";
import Fader from "../Input/Fader";

type FilterWithEnvelopeModuleOptions = {
  name: string;
};

const FilterWithEnvelopeModule: React.FC<FilterWithEnvelopeModuleOptions> = ({
  name = "Envelope",
}) => {
  const { synth, saveSynthOptions } = React.useContext(SynthContext);
  const synthState = synth?.get() as Tone.MonoSynthOptions;

  const updateSynthSettings = (options: Partial<Tone.MonoSynthOptions>) => {
    synth?.set(options);
  };

  return (
    <BaseModule name={name}>
      <form>
        <div className="control-group transparent">
          <Fader
            id="filter-base-freq"
            label="Cutoff"
            value={
              parseFloat(
                synthState?.filterEnvelope?.baseFrequency.toString()
              ) || 0
            }
            sliderProps={{
              valueLabelDisplay: "auto",
              valueLabelFormat: (value: number) => `${value.toFixed()} Hz`,
              orientation: "vertical",
              min: 1,
              max: 2000,
              step: 0.01,
              onChange: (event, newValue) => {
                updateSynthSettings({
                  filterEnvelope: {
                    baseFrequency: newValue,
                  } as Tone.FrequencyEnvelopeOptions,
                });
              },
            }}
          />

          <Fader
            id="filter-resonance"
            label="Reso"
            value={synthState?.filter?.Q || 0}
            sliderProps={{
              valueLabelDisplay: "auto",
              valueLabelFormat: (value: number) => `${value.toFixed()}`,
              orientation: "vertical",
              min: 0,
              max: 20,
              step: 0.1,
              onChange: (event, newValue) => {
                updateSynthSettings({
                  filter: {
                    Q: newValue,
                  } as Tone.FilterOptions,
                });
              },
            }}
          />
        </div>

        <div className="control-group">
          <h3>Envelope</h3>

          <Fader
            id="filter-attack"
            label="A"
            value={parseFloat(synthState?.filterEnvelope?.attack?.toString())}
            sliderProps={{
              valueLabelDisplay: "auto",
              orientation: "vertical",
              min: 0,
              max: 1,
              step: 0.01,
              onChange: (event, newValue) => {
                updateSynthSettings({
                  filterEnvelope: {
                    attack: newValue,
                  } as Tone.FrequencyEnvelopeOptions,
                });
              },
            }}
          />

          <Fader
            id="filter-decay"
            label="D"
            value={parseFloat(synthState?.filterEnvelope?.decay?.toString())}
            sliderProps={{
              valueLabelDisplay: "auto",
              orientation: "vertical",
              min: 0,
              max: 1,
              step: 0.01,
              onChange: (event, newValue) => {
                updateSynthSettings({
                  filterEnvelope: {
                    decay: newValue,
                  } as Tone.FrequencyEnvelopeOptions,
                });
              },
            }}
          />

          <Fader
            id="filter-sustain"
            label="S"
            value={parseFloat(synthState?.filterEnvelope?.sustain?.toString())}
            sliderProps={{
              valueLabelDisplay: "auto",
              orientation: "vertical",
              min: 0,
              max: 1,
              step: 0.01,
              onChange: (event, newValue) => {
                updateSynthSettings({
                  filterEnvelope: {
                    sustain: newValue,
                  } as Tone.FrequencyEnvelopeOptions,
                });
              },
            }}
          />

          <Fader
            id="filter-release"
            label="R"
            value={parseFloat(synthState?.filterEnvelope?.release?.toString())}
            sliderProps={{
              valueLabelDisplay: "auto",
              orientation: "vertical",
              min: 0,
              max: 1,
              step: 0.01,
              onChange: (event, newValue) => {
                updateSynthSettings({
                  filterEnvelope: {
                    release: newValue,
                  } as Tone.FrequencyEnvelopeOptions,
                });
              },
            }}
          />
        </div>
      </form>
    </BaseModule>
  );
};

export default FilterWithEnvelopeModule;
