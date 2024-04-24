import React, { useEffect, useState } from "react";
import * as Tone from "tone";
import BaseModule from "./baseModule";
import { SynthOptions } from "@/app/page";
import Slider from "./input/slider";

type EnvelopeModuleOptions = {
  name: string;
  key: string;
  envelope: Tone.Envelope;
  isOn: boolean;
  setSynthOptions: React.Dispatch<React.SetStateAction<SynthOptions>>;
};

const EnvelopeModule: React.FC<EnvelopeModuleOptions> = ({ name = "Envelope", envelope, isOn, 
    key,
    setSynthOptions
 }) => {
  const [isActive, setIsActive] = useState(isOn);
  console.log("envelope", envelope.context);

  const handleAttackChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const attack = parseFloat(event.target.value);
    envelope.attack = attack;
  }

    const handleDecayChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const decay = parseFloat(event.target.value);
        envelope.decay = decay;
    }

    const handleSustainChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const sustain = parseFloat(event.target.value) / 100;
        envelope.sustain = sustain;
    }

    const handleReleaseChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const release = parseFloat(event.target.value);
        envelope.release = release;
    }



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
            key="attack"
            label="Attack"
            min={0}
            max={10}
            step={0.1}
            value={envelope.attack.toString()}
            onChange={(event, newValue) => handleAttackChange(event)}
        />

        <Slider
            key="decay"
            label="Decay"
            min={0}
            max={10}
            step={0.1}
            value={envelope.decay.toString()}
            onChange={(event, newValue) => handleDecayChange(event)}
            />

        <Slider 
            key="sustain"
            label="Sustain"
            min={0}
            max={100}
            step={1}
            value={envelope.sustain * 100}
            onChange={(event, newValue) => handleSustainChange(event)}
        />

        <Slider
            key="release"
            label="Release"
            min={0}
            max={10}
            step={0.1}
            value={envelope.release.toString()}
            onChange={(event, newValue) => handleReleaseChange(event)}

        />

        {/* <label htmlFor="release">Release:</label>
        <input
          type="range"
          id="release"
          min="0"
          max="10"
          step="0.1"
          defaultValue="0.1"
          onChange={(event) => {
            const release = parseFloat(event.target.value);
            envelope.release = release;
          }}
        /> */}

    </BaseModule>
  );
};

export default EnvelopeModule;
