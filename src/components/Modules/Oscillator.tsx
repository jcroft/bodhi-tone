"use client";

import { SynthContext } from "@/app/page";
import React from "react";
import * as Tone from "tone";
import BaseModule from "./BaseModule";
import Slider from "../Input/Slider";
import Select from "../Input/Select";
import { OmniOscillatorType } from "tone/build/esm/source/oscillator/OscillatorInterface";

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
  const synthState = synth.get() as Tone.DuoSynthOptions;
  const theseVoices = voiceKeys.map(
    (key) => synthState[key] as Tone.MonoSynthOptions
  );
  const referenceVoice = theseVoices[0] as Tone.MonoSynthOptions;
  const [selectedWaveform, setSelectedWaveform] = React.useState(
    referenceVoice?.oscillator?.type || "sine"
  );

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

  const setAllVoices = (options: any) => {
    voiceKeys.forEach((voiceKey) => {
      // console.log(`Setting voice ${voiceKey} to`, options);
      synth.set({
        [voiceKey]: options,
      });
    });
  };

  const setGlobalSynthSettings = (
    options: Partial<Tone.PolySynthOptions<Tone.DuoSynthOptions>>
  ) => {
    // console.log(`Setting global synth settings to`, options);
    synth.set(options);
  };

  const isOnlyVoice0 = voiceKeys.length === 1 && voiceKeys[0] === "voice0";

  return (
    <BaseModule name={name} componentKey={componentKey}>
      <form className="column">
        <Select
          label="Waveform"
          value={selectedWaveform}
          componentKey="type"
          defaultOption={"sine" as Tone.ToneOscillatorType}
          onChange={(event, newValue) => {
            setSelectedWaveform(newValue);
            setAllVoices({
              oscillator: {
                type: newValue as OmniOscillatorType,
              },
            });
          }}
          options={waveformOptions}
        />
        {!isOnlyVoice0 && (
          <Slider
            componentKey="harmonicity"
            label="Detune"
            min={0.5}
            max={2}
            step={0.01}
            value={synth.get()?.harmonicity || 0}
            onChange={(event, newValue) => {
              setGlobalSynthSettings({
                harmonicity: newValue,
              });
            }}
          />
        )}
        {referenceVoice?.oscillator?.type === "pwm" && (
          <Slider
            componentKey="pulse-width"
            label="Pulse Width Modulation"
            min={0}
            max={1}
            step={0.01}
            value={referenceVoice?.oscillator?.modulationFrequency || 0}
            onChange={(event, newValue) => {
              setAllVoices({
                oscillator: {
                  modulationFrequency: newValue,
                },
              });
            }}
          />
        )}
      </form>
    </BaseModule>
  );
};

export default OscillatorModule;
