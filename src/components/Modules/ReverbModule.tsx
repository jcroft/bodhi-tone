"use client";

import React from "react";
import BaseModule from "./BaseModule";
import Fader from "../Input/Fader";
import { useSynth } from "@/contexts/SynthContext";

interface ReverbModuleProps {
  name?: string;
}

const ReverbModule: React.FC<ReverbModuleProps> = ({ name = "Reverb" }) => {
  const { effects } = useSynth();

  const createFader = React.useCallback(
    (id: string, label: string, param: any, min = 0, max = 1, step = 0.01) => (
      <Fader
        key={`reverb-${id}`}
        id={`reverb-${id}`}
        label={label}
        value={
          id === "wet"
            ? parseFloat(effects.reverb.wet.value.toString())
            : parseFloat(param.toString())
        }
        sliderProps={{
          valueLabelDisplay: "auto",
          orientation: "vertical",
          min,
          max,
          step,
          onChange: (event, newValue) => {
            if (id === "wet") {
              effects.reverb.wet.value = newValue as number;
            } else if (typeof newValue === "number") {
              effects.reverb.set({
                [id]: newValue,
              });
            }
          },
        }}
      />
    ),
    [effects.reverb]
  );

  const reverbWetFader = createFader(
    "wet",
    "Wet",
    effects.reverb.wet,
    0,
    1,
    0.01
  );

  const reverbSettingsFaders = [
    createFader("decay", "Decay", effects.reverb.decay, 0.1, 200, 0.1),
    createFader("preDelay", "Pre", effects.reverb.preDelay, 0, 2, 0.01),
  ];

  return (
    <BaseModule name={name}>
      <form>
        <div className="control-group transparent">{reverbWetFader}</div>
        <div className="control-group">{reverbSettingsFaders}</div>
      </form>
    </BaseModule>
  );
};

export default ReverbModule;
