"use client";

import React from "react";
import BaseModule from "./BaseModule";
import { SynthContext } from "../Synth";
import Fader from "../Input/Fader";

interface ChorusModuleProps {
  name: string;
}

const ChorusModule: React.FC<ChorusModuleProps> = ({ name = "Chorus" }) => {
  const { effects } = React.useContext(SynthContext);

  return (
    <BaseModule name={name}>
      <form>
        <Fader
          id="chorus-wet"
          label="Wet"
          value={parseFloat(effects.chorus.wet.value.toString())}
          sliderProps={{
            valueLabelDisplay: "auto",
            orientation: "vertical",
            min: 0,
            max: 1,
            step: 0.01,
            onChange: (event, newValue) => {
              if (typeof newValue === "number") {
                effects.chorus.wet.value = newValue;
              }
            },
          }}
        />

        <div className="control-group">
          <Fader
            id="chorus-feedback"
            label="Fdbk"
            value={parseFloat(effects.chorus.feedback.value.toString())}
            sliderProps={{
              valueLabelDisplay: "auto",
              orientation: "vertical",
              min: 0,
              max: 1,
              step: 0.01,
              onChange: (event, newValue) => {
                if (typeof newValue === "number") {
                  effects.chorus.feedback.value = newValue;
                }
              },
            }}
          />

          <Fader
            id="chorus-delay-time"
            label="Time"
            value={parseFloat(effects.chorus.delayTime.toString())}
            sliderProps={{
              valueLabelDisplay: "auto",
              orientation: "vertical",
              min: 0,
              max: 1,
              step: 0.01,
              onChange: (event, newValue) => {
                if (typeof newValue === "number") {
                  effects.chorus.delayTime = newValue;
                }
              },
            }}
          />

          <Fader
            id="chorus-frequency"
            label="Freq"
            value={parseFloat(effects.chorus.frequency.value.toString())}
            sliderProps={{
              valueLabelDisplay: "auto",
              orientation: "vertical",
              min: 0,
              max: 1,
              step: 0.01,
              onChange: (event, newValue) => {
                if (typeof newValue === "number") {
                  effects.chorus.frequency.value = newValue;
                }
              },
            }}
          />

          <Fader
            id="chorus-depth"
            label="Depth"
            value={parseFloat(effects.chorus.depth.toString())}
            sliderProps={{
              valueLabelDisplay: "auto",
              orientation: "vertical",
              min: 0,
              max: 1,
              step: 0.01,
              onChange: (event, newValue) => {
                if (typeof newValue === "number") {
                  effects.chorus.depth = newValue;
                }
              },
            }}
          />

          <Fader
            id="chorus-spread"
            label="Spread"
            value={parseFloat(effects.chorus.spread.toString())}
            sliderProps={{
              valueLabelDisplay: "auto",
              orientation: "vertical",
              min: 0,
              max: 1,
              step: 0.01,
              onChange: (event, newValue) => {
                if (typeof newValue === "number") {
                  effects.chorus.spread = newValue;
                }
              },
            }}
          />
        </div>
      </form>
    </BaseModule>
  );
};

export default ChorusModule;
