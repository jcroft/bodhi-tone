import React, { useEffect, useState } from "react";
import * as Tone from "tone";
import BaseModule from "./baseModule";
import { SynthOptions } from "@/app/page";
import Slider from "./input/slider";

type FilterModuleOptions = {
  name: string;
  key: string;
  filter: Tone.Filter;
  isOn: boolean;
  setSynthOptions: React.Dispatch<React.SetStateAction<SynthOptions>>;
};

const FilterModule: React.FC<FilterModuleOptions> = ({
  name = "Filter",
  key,
  filter,
  isOn,
  setSynthOptions
}) => {
  const [isActive, setIsActive] = useState(isOn);

  const handleFrequencyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const frequency = parseInt(event.target.value, 10);
    filter.frequency.value = frequency;
  }

  const handleResonanceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const resonance = parseInt(event.target.value, 10);
    filter.Q.value = resonance;
  }

  // // start and stop filter when isPlaying changes
  // const handleToggle = () => {
  //   setIsActive(!isActive);
  // };

  console.log(name, filter.get())

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
        key="frequency"
        label="Frequency"
        min={20}
        max={20000}
        step={1}
        value={filter.frequency.value}
        onChange={(event, newValue) =>  handleFrequencyChange(event)}
      />

      <Slider
        key="resonance"
        label="Resonance"
        min={0}
        max={20}
        step={0.1}
        value={filter.Q.value}
        onChange={(event, newValue) => handleResonanceChange(event)}
      />

    </BaseModule>
  );
};

export default FilterModule;
