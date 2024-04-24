import React, { useEffect, useState } from "react";
import * as Tone from "tone";
import BaseModule from "./baseModule";
import Slider from "./input/slider";
import { SynthOptions } from "@/app/page";

type LFOModuleOptions = {
  name: string;
  key: string;
  lfo: Tone.LFO;
  isOn: boolean;
  setSynthOptions: React.Dispatch<React.SetStateAction<SynthOptions>>;
};

const LFOModule: React.FC<LFOModuleOptions> = ({ name = "LFO", lfo, isOn,
  key,
  setSynthOptions
 }) => {
  const [isActive, setIsActive] = useState(isOn);
  console.log("lfo", lfo.context);

  useEffect(() => {
    isOn ? lfo.start() : lfo.stop();
    return () => {
      lfo.stop();
    }
  }, [lfo, isOn]);


  useEffect(() => {
    if (!isActive) {
      lfo.stop();
    } else {
      lfo.state === "stopped" && lfo.start();
    }
  }, [isActive, lfo]);

  console.log(name, lfo.get())

  return (
    <BaseModule 
      name={name}
      key={key}
      isOn={isActive}
      setSynthOptions={setSynthOptions}
    >

      <label htmlFor="Active">Active:</label>
      <input
        type="checkbox"
        id="Active"
        defaultChecked={isActive}
        onChange={(event) => {
          setIsActive(event.target.checked);
        }}
      />

      <Slider
        label="Frequency"
        key="frequency"
        min={0.1}
        max={10}
        step={0.1}
        value={lfo.frequency.value}
        onChange={(value) => {
          lfo.frequency.value = value;
        }}
      />

      <Slider
        label="Amplitude"
        key="amplitude"
        min={0}
        max={1}
        step={0.1}
        defaultValue={lfo.amplitude.value}
        onChange={(value) => {
          lfo.amplitude.value = value;
        }}
      />

      <label htmlFor="type">Type:</label>
      <select
        id="type"
        defaultValue={lfo.type}
        onChange={(event) => {
          const type = event.target.value as Tone.ToneOscillatorType;
          lfo.type = type;
        }}
      >
        <option value="sine">Sine</option>
        <option value="square">Square</option>
        <option value="sawtooth">Sawtooth</option>
        <option value="triangle">Triangle</option>
      </select>
    </BaseModule>
  );
};

export default LFOModule;
