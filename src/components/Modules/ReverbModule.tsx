"use client";

import React from "react";
import BaseModule from "./BaseModule";
import Fader from "../Input/Fader";
import { useSynth } from "@/contexts/SynthContext";

type ReverbModuleOptions = {
  name: string;
};

const ReverbModule: React.FC<ReverbModuleOptions> = ({ name = "Reverb" }) => {
  const { effects } = useSynth();

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
        <div className="control-group transparent">
          <Fader
            id="reverb-wet"
            label="Wet"
            value={parseFloat(effects.reverb.wet.value.toString())}
            sliderProps={{
              valueLabelDisplay: "auto",
              orientation: "vertical",
              min: 0,
              max: 1,
              step: 0.01,
              onChange: (event, newValue) => {
                if (typeof newValue === "number") {
                  effects.reverb.wet.value = newValue;
                }
              },
            }}
          />
        </div>

        <div className="control-group">
          <Fader
            id="reverb-decay"
            label="Decay"
            value={parseFloat(effects.reverb.decay.toString())}
            sliderProps={{
              valueLabelDisplay: "auto",
              orientation: "vertical",
              min: 0,
              max: 10,
              step: 0.01,
              onChange: (event, newValue) => {
                if (typeof newValue === "number") {
                  updateEffectSettings({
                    decay: newValue,
                  });
                }
              },
            }}
          />

          <Fader
            id="reverb-pre-delay"
            label="Pre"
            value={parseFloat(effects.reverb.preDelay.toString())}
            sliderProps={{
              valueLabelDisplay: "auto",
              orientation: "vertical",
              min: 0,
              max: 1,
              step: 0.01,
              onChange: (event, newValue) => {
                if (typeof newValue === "number") {
                  updateEffectSettings({
                    preDelay: newValue,
                  });
                }
              },
            }}
          />
        </div>
      </form>
    </BaseModule>
  );
};

export default ReverbModule;
