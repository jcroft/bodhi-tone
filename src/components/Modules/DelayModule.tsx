import { SynthContext } from "@/app/page";
import React, { useState } from "react";
import { PingPongDelayOptions } from "tone";
import BaseModule from "./BaseModule";
import Slider from "../Input/Slider";

interface DelayModuleProps {
  name: string;
  componentKey: string;
}

const DelayModule: React.FC<DelayModuleProps> = ({
  name = "Delay",
  componentKey,
}) => {
  const { effects } = React.useContext(SynthContext);

  const updateEffectSettings = (options: Partial<PingPongDelayOptions>) => {
    effects.delay.set(options);
  };

  return (
    <BaseModule name={name} componentKey={componentKey}>
      <form>
        <Slider
          componentKey="delay-wet"
          label="Wet"
          min={0}
          max={1}
          step={0.01}
          value={parseFloat(effects.delay.wet.value.toString())}
          orient="vertical"
          onChange={(event, newValue) => {
            effects.delay.wet.value = newValue;
          }}
        />
        <Slider
          componentKey="delay-feedback"
          label="Fdbk"
          min={0}
          max={1}
          step={0.01}
          value={parseFloat(effects.delay.feedback.value.toString())}
          orient="vertical"
          onChange={(event, newValue) => {
            effects.delay.feedback.value = newValue;
          }}
        />
        <Slider
          componentKey="delay-time"
          label="Time"
          min={0}
          max={1}
          step={0.01}
          value={parseFloat(effects.delay.delayTime.value.toString())}
          orient="vertical"
          onChange={(event, newValue) => {
            effects.delay.delayTime.value = newValue;
          }}
        />
      </form>
    </BaseModule>
  );
};

export default DelayModule;
