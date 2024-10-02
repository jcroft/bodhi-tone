"use client";

import { SynthContext, SynthOptions, SynthOptionsContext } from "@/app/page";
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

  return (
    <BaseModule name={name} componentKey={componentKey}>
      <form className="column">
        <Select
          label="Waveform"
          value={synth.get().oscillator.type.toString()}
          componentKey="type"
          defaultOption="sine"
          onChange={(event) => {
            synth.set({
              oscillator: {
                type: event.target.value as Tone.OscillatorType,
              },
            });
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
