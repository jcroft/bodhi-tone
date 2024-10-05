"use client";

import React, { useEffect, useState } from "react";
import BaseModule from "./BaseModule";
import { SynthContext } from "@/app/page";
import Slider from "../Input/Slider";
import * as Tone from "tone";
import { parse } from "path";

type ReverbModuleOptions = {
  name: string;
  componentKey: string;
};

const ReverbModule: React.FC<ReverbModuleOptions> = ({
  name = "Reverb",
  componentKey,
}) => {
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
    <BaseModule name={name} componentKey={componentKey}>
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
      </form>
    </BaseModule>
  );
};

export default ReverbModule;
