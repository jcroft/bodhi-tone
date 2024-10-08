"use client";

import React from "react";
import BaseModule from "./BaseModule";
import Fader from "../Input/Fader";
import { useSynth } from "@/contexts/SynthContext";

interface DelayModuleProps {
  name: string;
}

const DelayModule: React.FC<DelayModuleProps> = ({ name = "Delay" }) => {
  const { effects } = useSynth();

  return (
    <BaseModule name={name}>
      <form>
        <div className="control-group transparent">
          <Fader
            id="delay-wet"
            label="Wet"
            value={parseFloat(effects.delay.wet.value.toString())}
            sliderProps={{
              valueLabelDisplay: "auto",
              orientation: "vertical",
              min: 0,
              max: 1,
              step: 0.01,
              onChange: (event, newValue) => {
                if (typeof newValue === "number") {
                  effects.delay.wet.value = newValue;
                }
              },
            }}
          />
        </div>

        <div className="control-group">
          <Fader
            id="delay-feedback"
            label="Fdbk"
            value={parseFloat(effects.delay.feedback.value.toString())}
            sliderProps={{
              valueLabelDisplay: "auto",
              orientation: "vertical",
              min: 0,
              max: 1,
              step: 0.01,
              onChange: (event, newValue) => {
                if (typeof newValue === "number") {
                  effects.delay.feedback.value = newValue;
                }
              },
            }}
          />

          <Fader
            id="delay-time"
            label="Time"
            value={parseFloat(effects.delay.delayTime.value.toString())}
            sliderProps={{
              valueLabelDisplay: "auto",
              orientation: "vertical",
              min: 0,
              max: 1,
              step: 0.01,
              onChange: (event, newValue) => {
                if (typeof newValue === "number") {
                  effects.delay.delayTime.value = newValue;
                }
              },
            }}
          />
        </div>
      </form>
    </BaseModule>
  );
};

export default DelayModule;
