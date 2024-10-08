"use client";

import React from "react";
import BaseModule from "./BaseModule";
import Fader from "../Input/Fader";
import { useSynth } from "@/contexts/SynthContext";

interface ChorusModuleProps {
  name?: string;
}

const ChorusModule: React.FC<ChorusModuleProps> = ({ name = "Chorus" }) => {
  const { effects } = useSynth();

  const createFader = React.useCallback(
    (id: string, label: string, param: any, min = 0, max = 1, step = 0.01) => (
      <Fader
        key={`chorus-${id}`}
        id={`chorus-${id}`}
        label={label}
        value={
          id === "wet"
            ? parseFloat(effects.chorus.wet.value.toString())
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
              effects.chorus.wet.value = newValue as number;
            } else if (typeof newValue === "number") {
              effects.chorus.set({
                [id]: newValue,
              });
            }
          },
        }}
      />
    ),
    [effects.chorus]
  );

  const chorusWetFader = createFader(
    "wet",
    "Wet",
    effects.chorus.wet,
    0,
    1,
    0.01
  );

  const chorusSettingsFaders = [
    createFader("feedback", "Fdbk", effects.chorus.feedback, 0, 1, 0.01),
    createFader("delayTime", "Time", effects.chorus.delayTime, 2, 20, 0.01),
    createFader("frequency", "Freq", effects.chorus.frequency, 0, 20000, 0.01),
    createFader("depth", "Depth", effects.chorus.depth, 0, 1, 0.01),
    createFader("spread", "Spread", effects.chorus.spread, 0, 180, 0.01),
  ];

  return (
    <BaseModule name={name}>
      <form>
        <div className="control-group transparent">{chorusWetFader}</div>
        <div className="control-group">{chorusSettingsFaders}</div>
      </form>
    </BaseModule>
  );
};

export default ChorusModule;
