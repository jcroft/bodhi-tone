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

  const createFader = React.useCallback(
    (id: string, label: string, param: any, min = 0, max = 1, step = 0.01) => (
      <Fader
        key={`delay-${id}`}
        id={`delay-${id}`}
        label={label}
        value={
          id === "wet"
            ? parseFloat(effects.delay.wet.value.toString())
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
              effects.delay.wet.value = newValue as number;
            } else if (typeof newValue === "number") {
              effects.delay.set({
                [id]: newValue,
              });
            }
          },
        }}
      />
    ),
    [effects.delay]
  );

  const delayWetFader = createFader("wet", "Wet", effects.delay.wet);

  const delaySettingsFaders = [
    createFader("feedback", "Fdbk", effects.delay.feedback),
    createFader("time", "Time", effects.delay.delayTime),
  ];

  return (
    <BaseModule name={name}>
      <form>
        <div className="control-group transparent">{delayWetFader}</div>

        <div className="control-group">{delaySettingsFaders}</div>
      </form>
    </BaseModule>
  );
};

export default DelayModule;
