"use client";

import React, { useEffect, useState } from "react";
import * as Tone from "tone";
import BaseModule from "./baseModule";
import { SynthOptions, SynthOptionsContext } from "@/app/page";
import Slider from "./input/slider";
import { parse } from "path";
import { Frequency } from "tone/build/esm/core/type/Units";

type FilterWithEnvelopeModuleOptions = {
  name: string;
  componentKey: string;
  filter: Tone.Filter;
  envelope: Tone.FrequencyEnvelope;
  isOn: boolean;
};

const FilterWithEnvelopeModule: React.FC<FilterWithEnvelopeModuleOptions> = ({
  name = "Envelope",
  envelope,
  filter,
  isOn,
  componentKey,
}) => {
  const { synthOptions, setSynthOptions } =
    React.useContext(SynthOptionsContext);

  const handleActivate = () => {
    setSynthOptions({
      ...synthOptions,
      filterEnvelope: {
        ...synthOptions.filterEnvelope,
        isOn: true,
      },
    });
  };

  const handleDeactivate = () => {
    console.log("deactivate");
    setSynthOptions({
      ...synthOptions,
      filterEnvelope: {
        ...synthOptions.filterEnvelope,
        isOn: false,
      },
    });
  };

  return (
    <BaseModule
      name={name}
      componentKey={componentKey}
      isOn={isOn}
      onActivate={handleActivate}
      onDeactivate={handleDeactivate}
    >
      <form className="column">
        <Slider
          componentKey="filter-base-freq"
          label="Frequency"
          min={0}
          max={8000}
          step={0.01}
          value={parseFloat(envelope.baseFrequency.toString())}
          valueType="frequency"
          orient="horizontal"
          onChange={(event, newValue) => {
            filter.frequency.value = newValue;
            envelope.baseFrequency = newValue;
          }}
        />

        <Slider
          componentKey="filter-resonance"
          label="Resonance"
          min={0}
          max={20}
          step={0.1}
          value={filter.Q.value}
          disabled
          orient="horizontal"
          onChange={(event, newValue) => {
            filter.Q.value = newValue;
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
          value={parseFloat(envelope.attack.toString())}
          orient="vertical"
          onChange={(event, newValue) => {
            envelope.attack = newValue;
          }}
        />
        <Slider
          componentKey="filter-decay"
          label="Decay"
          min={0}
          max={1}
          step={0.01}
          value={parseFloat(envelope.decay.toString())}
          orient="vertical"
          onChange={(event, newValue) => {
            envelope.decay = newValue;
            // setSynthOptions({
            //   ...synthOptions,
            //   filterEnvelope: {
            //     ...synthOptions.filterEnvelope,
            //     decay: newValue,
            //   },
            // });
          }}
        />
        <Slider
          componentKey="filter-sustain"
          label="Sustain"
          min={0}
          max={1}
          step={0.01}
          value={parseFloat(envelope.sustain.toString())}
          orient="vertical"
          onChange={(event, newValue) => {
            envelope.sustain = newValue;
            // setSynthOptions({
            //   ...synthOptions,
            //   filterEnvelope: {
            //     ...synthOptions.filterEnvelope,
            //     sustain: newValue as number,
            //   },
            // });
          }}
        />
        <Slider
          componentKey="filter-release"
          label="Release"
          min={0}
          max={1}
          step={0.01}
          value={parseFloat(envelope.release.toString())}
          orient="vertical"
          onChange={(event, newValue) => {
            envelope.release = newValue;
            setSynthOptions({
              ...synthOptions,
              filterEnvelope: {
                ...synthOptions.filterEnvelope,
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
