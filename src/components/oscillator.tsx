"use client";

import { SynthContext, SynthOptions } from "@/app/page";
import React, { useEffect, useState } from "react";
import * as Tone from "tone";
import BaseModule from "./baseModule";
import Slider from "./input/slider";
import Select from "./input/select";

type OscillatorModuleOptions = {
  name: string;
  componentKey: string;
};

const OscillatorModule: React.FC<OscillatorModuleOptions> = ({
  name = "Oscillator",
  componentKey,
}) => {
  const  { synth } = React.useContext(SynthContext);

  const waveformOptions = React.useMemo(() => [
    { value: "sine" as Tone.ToneOscillatorType, label: "Sine" },
    { value: "square" as Tone.ToneOscillatorType, label: "Square" },
    { value: "sawtooth" as Tone.ToneOscillatorType, label: "Sawtooth" },
    { value: "triangle" as Tone.ToneOscillatorType, label: "Triangle" },
  ], [])
  const currentWaveform = synth.get().oscillator.type
  console.log(currentWaveform, 'current')

  const handleWaveformChange = (e:React.ChangeEvent<HTMLSelectElement>) => {
    synth.set({
      oscillator: {
        type: e.target.value as OscillatorType | undefined,
      },
    });
  }

  console.log('osc type:',synth.get().oscillator.type)

  return (
    <BaseModule name={name} componentKey={componentKey}>
      <form className="column">
        <Select
          label="Waveform"
          value={currentWaveform}
          componentKey="type"
          defaultOption={"sine" as Tone.ToneOscillatorType}
          onChange={handleWaveformChange}
          options={waveformOptions}
        />
      </form>
    </BaseModule>
  );
};

export default OscillatorModule;
