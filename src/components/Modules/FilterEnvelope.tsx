"use client";

import React from "react";
import BaseModule from "./BaseModule";
import Slider from "../Input/Slider";
import * as Tone from "tone";
import { SynthContext } from "../Synth";

type FilterWithEnvelopeModuleOptions = {
  name: string;
};

const FilterWithEnvelopeModule: React.FC<FilterWithEnvelopeModuleOptions> = ({
  name = "Envelope",
}) => {
  const { synth, saveSynthOptions } = React.useContext(SynthContext);
  const synthState = synth.get() as Tone.MonoSynthOptions;

  const updateSynthSettings = (options: Partial<Tone.MonoSynthOptions>) => {
    synth.set(options);
  };

  return (
    <BaseModule name={name}>
      <form>
        <Slider
          componentKey="filter-base-freq"
          label="Cutoff"
          min={1}
          max={2000}
          step={0.01}
          value={
            parseFloat(synthState?.filterEnvelope?.baseFrequency.toString()) ||
            0
          }
          valueType="frequency"
          orient="vertical"
          onChange={(event, newValue) => {
            updateSynthSettings({
              filterEnvelope: {
                baseFrequency: newValue,
              } as Tone.FrequencyEnvelopeOptions,
            });
          }}
        />

        <Slider
          componentKey="filter-resonance"
          label="Reso"
          min={0}
          max={20}
          step={0.1}
          value={synthState?.filter?.Q || 0}
          orient="vertical"
          onChange={(event, newValue) => {
            updateSynthSettings({
              filter: {
                Q: newValue,
              } as Tone.FilterOptions,
            });
          }}
        />

        <div className="control-group">
          <h3>Envelope</h3>
          <Slider
            componentKey="filter-attack"
            label="A"
            min={0}
            max={1}
            step={0.01}
            value={parseFloat(synthState?.filterEnvelope?.attack?.toString())}
            orient="vertical"
            onChange={(event, newValue) => {
              updateSynthSettings({
                filterEnvelope: {
                  attack: newValue,
                } as Tone.FrequencyEnvelopeOptions,
              });
            }}
          />
          <Slider
            componentKey="filter-decay"
            label="D"
            min={0}
            max={1}
            step={0.01}
            value={parseFloat(synthState?.filterEnvelope?.decay?.toString())}
            orient="vertical"
            onChange={(event, newValue) => {
              updateSynthSettings({
                filterEnvelope: {
                  decay: newValue,
                } as Tone.FrequencyEnvelopeOptions,
              });
            }}
          />
          <Slider
            componentKey="filter-sustain"
            label="S"
            min={0}
            max={1}
            step={0.01}
            value={parseFloat(synthState?.filterEnvelope?.sustain?.toString())}
            orient="vertical"
            onChange={(event, newValue) => {
              updateSynthSettings({
                filterEnvelope: {
                  sustain: newValue,
                } as Tone.FrequencyEnvelopeOptions,
              });
            }}
          />
          <Slider
            componentKey="filter-release"
            label="R"
            min={0}
            max={1}
            step={0.01}
            value={parseFloat(synthState?.filterEnvelope?.release?.toString())}
            orient="vertical"
            onChange={(event, newValue) => {
              updateSynthSettings({
                filterEnvelope: {
                  release: newValue,
                } as Tone.FrequencyEnvelopeOptions,
              });
            }}
          />
        </div>
      </form>
    </BaseModule>
  );
};

export default FilterWithEnvelopeModule;
