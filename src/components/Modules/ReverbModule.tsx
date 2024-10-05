"use client";

import React, { useEffect, useState } from "react";
import BaseModule from "./BaseModule";
import Slider from "../Input/Slider";
import * as Tone from "tone";
import { parse } from "path";
import { SynthContext } from "../Synth";

type ReverbModuleOptions = {
  name: string;
};

const ReverbModule: React.FC<ReverbModuleOptions> = ({ name = "Reverb" }) => {
  const { effects } = React.useContext(SynthContext);

  const updateEffectSettings = (
    options: Partial<{
      decay: number;
      preDelay: number;
    }>
  ) => {
    effects.reverb.set(options);
  };

  return (
    <BaseModule name={name}>
      <form>
        <Slider
          componentKey="reverb-wet"
          label="Wet"
          min={0}
          max={1}
          step={0.01}
          value={parseFloat(effects.reverb.wet.value.toString())}
          orient="vertical"
          onChange={(event, newValue) => {
            effects.reverb.wet.value = newValue;
          }}
        />
        <div className="control-group">
          <Slider
            componentKey="reverb-decay"
            label="Decay"
            min={0}
            max={10}
            step={0.01}
            value={parseFloat(effects.reverb.decay.toString())}
            orient="vertical"
            onChange={(event, newValue) => {
              updateEffectSettings({
                decay: newValue,
              });
            }}
          />
          <Slider
            componentKey="reverb-pre-delay"
            label="Pre"
            min={0}
            max={1}
            step={0.01}
            value={parseFloat(effects.reverb.preDelay.toString())}
            orient="vertical"
            onChange={(event, newValue) => {
              updateEffectSettings({
                preDelay: newValue,
              });
            }}
          />
        </div>
      </form>
    </BaseModule>
  );
};

export default ReverbModule;
