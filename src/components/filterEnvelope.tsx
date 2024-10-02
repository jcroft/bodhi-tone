"use client";

import React, { useEffect, useState } from "react";
import * as Tone from "tone";
import BaseModule from "./baseModule";
import { SynthContext, SynthOptions, SynthOptionsContext } from "@/app/page";
import Slider from "./input/slider";
import { parse } from "path";
import { Frequency } from "tone/build/esm/core/type/Units";

type FilterWithEnvelopeModuleOptions = {
  name: string;
  componentKey: string;
};

const FilterWithEnvelopeModule: React.FC<FilterWithEnvelopeModuleOptions> = ({
  name = "Envelope",
  componentKey,
}) => {
  const { synth } = React.useContext(SynthContext);

  return (
    <BaseModule name={name} componentKey={componentKey}>
      <form className="column">
        <Slider
          componentKey="filter-base-freq"
          label="Frequency"
          min={0}
          max={8000}
          step={0.01}
          value={synth.get().filterEnvelope.baseFrequency}
          valueType="frequency"
          orient="horizontal"
          onChange={(event, newValue) => {
            synth.set({
              filterEnvelope: {
                baseFrequency: newValue,
              },
            });
          }}
        />

        <Slider
          componentKey="filter-resonance"
          label="Resonance"
          min={0}
          max={20}
          step={0.1}
          value={synth.get().filter?.Q || 0}
          orient="horizontal"
          onChange={(event, newValue) => {
            synth.set({
              filter: {
                Q: newValue,
              },
            });
          }}
        />
      </form>

      <form>
        <Slider
          componentKey="filter-attack"
          label="Attack"
          min={0}
          max={1}
          step={0.01}
          value={parseFloat(synth.get().filterEnvelope?.attack?.toString())}
          orient="vertical"
          onChange={(event, newValue) => {
            synth.set({
              filterEnvelope: {
                attack: newValue,
              },
            });
          }}
        />
        <Slider
          componentKey="filter-decay"
          label="Decay"
          min={0}
          max={1}
          step={0.01}
          value={parseFloat(synth.get().filterEnvelope?.decay?.toString())}
          orient="vertical"
          onChange={(event, newValue) => {
            synth.set({
              filterEnvelope: {
                decay: newValue,
              },
            });
          }}
        />
        <Slider
          componentKey="filter-sustain"
          label="Sustain"
          min={0}
          max={1}
          step={0.01}
          value={parseFloat(synth.get().filterEnvelope?.sustain?.toString())}
          orient="vertical"
          onChange={(event, newValue) => {
            synth.set({
              filterEnvelope: {
                sustain: newValue,
              },
            });
          }}
        />
        <Slider
          componentKey="filter-release"
          label="Release"
          min={0}
          max={1}
          step={0.01}
          value={parseFloat(synth.get().filterEnvelope?.release?.toString())}
          orient="vertical"
          onChange={(event, newValue) => {
            synth.set({
              filterEnvelope: {
                release: newValue,
              },
            });
          }}
        />
      </form>
    </BaseModule>
  );
};

export default FilterWithEnvelopeModule;
