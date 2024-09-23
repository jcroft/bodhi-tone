"use client";

import { SynthOptions, SynthOptionsContext } from "@/app/page";
import React, { useEffect, useState } from "react";
import * as Tone from "tone";
import BaseModule from "./baseModule";
import Slider from "./input/slider";
import Select from "./input/select";

type OscillatorModuleOptions = {
  name: string;
  componentKey: string;
  oscillator: Tone.Oscillator;
  isOn: boolean;
};

const OscillatorModule: React.FC<OscillatorModuleOptions> = ({
  name = "Oscillator",
  componentKey,
  oscillator,
  isOn,
}) => {
  const synthOptionsContext = React.useContext(SynthOptionsContext);
  const [isActive, setIsActive] = useState(isOn);

  return (
    <BaseModule
      name={name}
      componentKey={componentKey}
      isOn={isActive}
      onActivate={() => setIsActive(true)}
      onDeactivate={() => setIsActive(false)}
    >
      <form className="column">
        <Slider
          label="Pitch"
          componentKey="frequency"
          min={20}
          max={8000}
          step={1}
          value={oscillator.frequency.value}
          valueType="frequency"
          onChange={(event, newValue) => {
            oscillator.frequency.value = newValue;
          }}
        />

        <Slider
          label="Volume"
          componentKey="volume"
          min={-80}
          max={0}
          step={0.01}
          value={oscillator.volume.value}
          valueType="volume"
          onChange={(event, newValue) => {
            oscillator.volume.value = newValue;
          }}
        />

        <Select
          label="Waveform"
          value={oscillator.type.toString()}
          componentKey="type"
          defaultOption="sine"
          onChange={(event) => {
            oscillator.type = event.target.value as Tone.ToneOscillatorType;
          }}
          options={[
            { value: "sine", label: "Sine" },
            { value: "square", label: "Square" },
            { value: "sawtooth", label: "Sawtooth" },
            { value: "triangle", label: "Triangle" },
          ]}
        />
      </form>
    </BaseModule>
  );
};

export default OscillatorModule;
