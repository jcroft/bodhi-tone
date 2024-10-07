"use client";
import React from "react";
import * as Tone from "tone";
import BaseModule from "./BaseModule";
import { SynthContext } from "../Synth";
import Fader from "../Input/Fader";

type GlobalControlModuleOptions = {
  name: string;
};

const GlobalControlModule: React.FC<GlobalControlModuleOptions> = ({
  name = "Oscillator",
}) => {
  const { synth } = React.useContext(SynthContext);

  return (
    <BaseModule name={name}>
      <form>
        <div className="control-group transparent">
          <Fader
            id="volume"
            label="Volume"
            sliderProps={{
              valueLabelDisplay: "auto",
              orientation: "vertical",
              valueLabelFormat: (value: number) => `${value.toFixed()} dB`,
              defaultValue: 0,
              step: 1,
              min: -80,
              max: 0,
              track: "normal",
              onChange: (event, newValue) => {
                if (typeof newValue === "number") {
                  synth!.volume.value = newValue;
                }
              },
            }}
          />
        </div>
      </form>
    </BaseModule>
  );
};

export default GlobalControlModule;
