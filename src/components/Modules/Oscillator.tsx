"use client";

import { DEFAULT_SYNTH_OPTIONS, SynthContext } from "@/app/page";
import React from "react";
import * as Tone from "tone";
import BaseModule from "./BaseModule";
import Slider from "../Input/Slider";
import Select from "../Input/Select";
import {
  OmniOscillatorOptions,
  OmniOscillatorType,
} from "tone/build/esm/source/oscillator/OscillatorInterface";
import { parse } from "path";

type OscillatorModuleOptions = {
  name: string;
  componentKey: string;
  voiceKeys: ("voice0" | "voice1")[];
};

const OscillatorModule: React.FC<OscillatorModuleOptions> = ({
  name = "Oscillator",
  componentKey,
  voiceKeys = ["voice0"],
}) => {
  const { synth, saveSynthOptions } = React.useContext(SynthContext);
  const synthState = synth.get() as Tone.MonoSynthOptions;

  const updateSynthSettings = (options: Partial<Tone.MonoSynthOptions>) => {
    synth.set(options);
  };

  // const [selectedWaveform, setSelectedWaveform] = React.useState(
  //   referenceVoice?.oscillator?.type || "sine"
  // );

  const waveformOptions = React.useMemo(
    () => [
      { value: "sine" as OmniOscillatorType, label: "Sine" },
      { value: "fatsine" as OmniOscillatorType, label: "Fat Sine" },
      { value: "triangle" as OmniOscillatorType, label: "Triangle" },
      { value: "fattriangle" as OmniOscillatorType, label: "Fat Triangle" },
      { value: "sawtooth" as OmniOscillatorType, label: "Sawtooth" },
      { value: "fatsawtooth" as OmniOscillatorType, label: "Fat Sawtooth" },
      { value: "square" as OmniOscillatorType, label: "Square" },
      { value: "fatsquare" as OmniOscillatorType, label: "Fat Square" },
      { value: "pwm" as OmniOscillatorType, label: "Pulse" },
    ],
    []
  );

  const isOnlyVoice0 = voiceKeys.length === 1 && voiceKeys[0] === "voice0";

  return (
    <BaseModule name={name} componentKey={componentKey}>
      <form>
        <Select
          label="Waveform"
          value={
            synthState?.oscillator?.type ||
            DEFAULT_SYNTH_OPTIONS.options?.oscillator?.type
          }
          componentKey="type"
          defaultOption={"sine" as Tone.ToneOscillatorType}
          onChange={(event, newValue) => {
            updateSynthSettings({
              oscillator: { type: newValue as OmniOscillatorType },
            } as Tone.MonoSynthOptions);
          }}
          options={waveformOptions}
        />
        <div className="control-group">
          <h3>Tuning</h3>
          <Slider
            componentKey="detune"
            label="Coarse"
            min={-1200}
            max={1200}
            step={100}
            value={synthState?.detune || 0}
            valueType="semitones"
            onChange={(event, newValue) => {
              updateSynthSettings({
                detune: newValue,
              });
            }}
          />
          <Slider
            componentKey="detune"
            label="Fine"
            min={-100}
            max={100}
            step={1}
            value={synthState?.detune || 0}
            onChange={(event, newValue) => {
              updateSynthSettings({
                detune: newValue,
              });
            }}
          />
        </div>

        {synthState?.oscillator?.type === "pwm" && (
          <Slider
            componentKey="pulse-width"
            label="Pulse Width Modulation"
            min={0}
            max={1}
            step={0.01}
            value={
              parseFloat(
                synthState?.oscillator?.modulationFrequency.toString()
              ) || 0
            }
            onChange={(event, newValue) => {
              updateSynthSettings({
                oscillator: {
                  modulationFrequency: newValue,
                } as Tone.PWMOscillatorOptions,
              });
            }}
          />
        )}
      </form>
    </BaseModule>
  );
};

export default OscillatorModule;
