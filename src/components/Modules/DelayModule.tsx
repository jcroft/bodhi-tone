"use client";

import React, { useState } from "react";
import { PingPongDelayOptions } from "tone";
import BaseModule from "./BaseModule";
import Slider from "../Input/Slider";
import { SynthContext } from "../Synth";

interface DelayModuleProps {
  name: string;
}

const DelayModule: React.FC<DelayModuleProps> = ({ name = "Delay" }) => {
  const { effects } = React.useContext(SynthContext);

  const updateEffectSettings = (options: Partial<PingPongDelayOptions>) => {
    effects.delay.set(options);
  };

  return (
    <BaseModule name={name}>
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
        <div className="control-group">
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
        </div>
      </form>
    </BaseModule>
  );
};

export default DelayModule;
