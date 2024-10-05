import React from "react";
import { ChorusOptions, PingPongDelayOptions } from "tone";
import BaseModule from "./BaseModule";
import Slider from "../Input/Slider";
import { SynthContext } from "../Synth";

interface ChorusModuleProps {
  name: string;
}

const ChorusModule: React.FC<ChorusModuleProps> = ({ name = "Chorus" }) => {
  const { effects } = React.useContext(SynthContext);

  const updateEffectSettings = (options: Partial<ChorusOptions>) => {
    //     frequency: Frequency;
    // delayTime: Milliseconds;
    // depth: NormalRange;
    // type: ToneOscillatorType;
    // spread: Degrees;
    effects.chorus.set(options);
  };

  return (
    <BaseModule name={name}>
      <form>
        <Slider
          componentKey="chorus-wet"
          label="Wet"
          min={0}
          max={1}
          step={0.01}
          value={parseFloat(effects.chorus.wet.value.toString())}
          orient="vertical"
          onChange={(event, newValue) => {
            effects.chorus.wet.value = newValue;
          }}
        />
        <Slider
          componentKey="chorus-feedback"
          label="Fdbk"
          min={0}
          max={1}
          step={0.01}
          value={parseFloat(effects.chorus.feedback.value.toString())}
          orient="vertical"
          onChange={(event, newValue) => {
            effects.chorus.feedback.value = newValue;
          }}
        />
        <Slider
          componentKey="chorus-delay-time"
          label="Time"
          min={0}
          max={1}
          step={0.01}
          value={parseFloat(effects.chorus.delayTime.toString())}
          orient="vertical"
          onChange={(event, newValue) => {
            effects.chorus.delayTime = newValue;
          }}
        />
        <Slider
          componentKey="chorus-frequency"
          label="Freq"
          min={0}
          max={1}
          step={0.01}
          value={parseFloat(effects.chorus.frequency.value.toString())}
          orient="vertical"
          onChange={(event, newValue) => {
            effects.chorus.frequency.value = newValue;
          }}
        />
        <Slider
          componentKey="chorus-depth"
          label="Depth"
          min={0}
          max={1}
          step={0.01}
          value={parseFloat(effects.chorus.depth.toString())}
          orient="vertical"
          onChange={(event, newValue) => {
            effects.chorus.depth = newValue;
          }}
        />
        <Slider
          componentKey="chorus-spread"
          label="Spread"
          min={0}
          max={1}
          step={0.01}
          value={parseFloat(effects.chorus.spread.toString())}
          orient="vertical"
          onChange={(event, newValue) => {
            effects.chorus.spread = newValue;
          }}
        />
      </form>
    </BaseModule>
  );
};

export default ChorusModule;
