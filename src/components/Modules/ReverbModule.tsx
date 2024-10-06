"use client";

import React, { useEffect, useState } from "react";
import BaseModule from "./BaseModule";
import Slider from "../Input/Slider";
import * as Tone from "tone";
import { parse } from "path";
import { SynthContext } from "../Synth";
import Fader from "../Input/Fader";

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
