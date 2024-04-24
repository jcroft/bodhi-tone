import { SynthOptions } from "@/app/page";
import React, { useEffect, useState } from "react";
import * as Tone from "tone";
import BaseModule from "./baseModule";
import Slider from "./input/slider";

type OscillatorModuleOptions = {
  name: string;
  key: string;
  oscillator: Tone.Oscillator;
  isOn: boolean;
  setSynthOptions: React.Dispatch<React.SetStateAction<SynthOptions>>;
};

const OscillatorModule: React.FC<OscillatorModuleOptions> = ({
  name = "Oscillator",
  key,
  oscillator,
  isOn,
  setSynthOptions,
}) => {
  const [isActive, setIsActive] = useState(isOn);

  useEffect(() => {
    oscillator.start();
    return () => {
      oscillator.stop();
    }
  }, [oscillator]);

  const handleFrequencyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const frequency = parseInt(event.target.value, 10);
    console.log(frequency, event.target.value)
    oscillator.frequency.value = frequency;
  }

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const volume = parseInt(event.target.value, 10);
    oscillator.volume.value = volume;
  }

  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const type = event.target.value as Tone.ToneOscillatorType;
    oscillator.type = type;
  }

  const handleToggle = () => {
    setIsActive(!isActive);
  };



  console.log(name, oscillator.frequency.value)

  return (
    <BaseModule 
      name={name}
      key={key}
      isOn={isActive}
      setSynthOptions={setSynthOptions}
      onActivate={() => setIsActive(true)}
    >

      <Slider
        label="Frequency"
        key="frequency"
        min={20}
        max={12000}
        step={1}
        value={oscillator.frequency.value}
        onChange={(event, newValue) => handleFrequencyChange(event)}
      />

      <Slider
        label="Volume"
        key="volume"
        min={0}
        max={100}
        step={1}
        value={oscillator.volume.value}
        onChange={(event, newValue) => handleVolumeChange(event)}
      />
      <label htmlFor="type">Type:</label>

      <select
        id="type"
        defaultValue={oscillator.type}
        onChange={(event) => handleTypeChange(event)}
      >
        <option value="sine">Sine</option>
        <option value="square">Square</option>
        <option value="sawtooth">Sawtooth</option>
        <option value="triangle">Triangle</option>
      </select>
    </BaseModule>
  );
};

export default OscillatorModule;
