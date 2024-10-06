"use client";
import React from "react";
import * as Tone from "tone";
import BaseModule from "./BaseModule";
import { SynthContext } from "../Synth";
import Fader from "../Input/Fader";

type VoiceModuleOptions = {
  name: string;
};

const VoiceModule: React.FC<VoiceModuleOptions> = ({ name = "Oscillator" }) => {
  const { synth, saveSynthOptions } = React.useContext(SynthContext);
  const synthState = synth?.get() as Tone.MonoSynthOptions;

  const updateSynthSettings = (options: Partial<Tone.MonoSynthOptions>) => {
    synth?.set(options);
  };

  return (
    <BaseModule name={name}>
      <form>
        <div className="control-group transparent">
          <Fader
            id="volume"
            label="Volume"
            sliderProps={{
              valueLabelDisplay: "auto",
              orientation: "vertical",
              valueLabelFormat: (value: number) => `${value.toFixed()} dB`,
              defaultValue: 0,
              step: 1,
              // marks: true,
              min: -80,
              max: 0,
              track: "normal",
              onChange: (event, newValue) => {
                if (typeof newValue === "number") {
                  synth!.volume.value = newValue;
                }
              },
            }}
          />
        </div>

        {/* <Fader
          id="detune"
          label="Tune"
          sliderProps={{
            color: "secondary",
            valueLabelDisplay: "auto",
            orientation: "vertical",
            valueLabelFormat: (value: number) => `${value.toFixed()} cents`,
            defaultValue: 0,
            step: 1,
            // marks: true,
            min: -100,
            max: 100,
            track: false,
            onChange: (event, newValue) => {
              if (typeof newValue === "number") {
                synth?.set({
                  detune: newValue,
                });
              }
            },
          }}
        /> */}
      </form>
    </BaseModule>
  );
};

export default VoiceModule;
