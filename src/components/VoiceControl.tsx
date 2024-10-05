"use client";

import { SynthContext } from "@/app/page";
import React from "react";
import * as Tone from "tone";
import BaseModule from "./BaseModule";
import Slider from "./input/Slider";
import Select from "./input/Select";

type VoiceModuleOptions = {
  name: string;
  componentKey: string;
  voiceKeys: ("voice0" | "voice1")[];
};

const VoiceModule: React.FC<VoiceModuleOptions> = ({
  name = "Oscillator",
  componentKey,
  voiceKeys = ["voice0", "voice1"],
}) => {
  const { synth, saveSynthOptions } = React.useContext(SynthContext);
  const synthState = synth.get() as Tone.DuoSynthOptions;
  const theseVoices = voiceKeys.map(
    (key) => synthState[key] as Tone.MonoSynthOptions
  );
  const referenceVoice = theseVoices[0] as Tone.MonoSynthOptions;

  const setAllVoices = (options: Partial<Tone.DuoSynthOptions>) => {
    voiceKeys.forEach((voiceKey) => {
      //   console.log(`Setting voice ${voiceKey} to`, options);
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

  const setMaxPolyphony = (maxPolyphony: number) => {
    // console.log(`Setting max polyphony to`, maxPolyphony);
    synth.maxPolyphony = maxPolyphony;
  };

  return (
    <BaseModule name={name} componentKey={componentKey}>
      <form>
        <Slider
          componentKey="volume"
          label="Volume"
          min={-100}
          max={0}
          step={1}
          value={referenceVoice?.volume || 0}
          orient="vertical"
          onChange={(event, newValue) => {
            setAllVoices({
              volume: newValue,
            });
          }}
        />
        <div className="control-group">
          <h3>Voices</h3>

          <Select
            componentKey="maxPolyphony"
            label="Count"
            defaultOption="8"
            options={[
              { value: "1", label: "1" },
              { value: "2", label: "2" },
              { value: "4", label: "4" },
              { value: "8", label: "8" },
              { value: "16", label: "16" },
            ]}
            value={synth.maxPolyphony.toString()}
            onChange={(event) => {
              setMaxPolyphony(parseInt(event.target.value));
            }}
          />
          <Slider
            componentKey="portamento"
            label="Glide"
            min={0}
            max={0.1}
            step={0.01}
            orient="vertical"
            value={synth.get()?.portamento || 0}
            onChange={(event, newValue) => {
              setGlobalSynthSettings({
                portamento: newValue,
              });
            }}
          />
          <Slider
            componentKey="detune"
            label="Tune"
            min={-100}
            max={100}
            step={1}
            value={synth.detune || 0}
            orient="vertical"
            onChange={(event, newValue) => {
              setGlobalSynthSettings({
                detune: newValue,
              });
            }}
          />
        </div>

        {/* <Slider
          componentKey="harmonicity"
          label="Harmonicity"
          min={0.5}
          max={2}
          step={0.01}
          value={synth.get()?.harmonicity || 0}
          onChange={(event, newValue) => {
            setGlobalSynthSettings({
              harmonicity: newValue,
            });
          }}
        /> */}

        <div className="control-group">
          <h3>Vibrato</h3>
          <Slider
            componentKey="vibratoRate"
            label="Rate"
            min={0}
            max={50}
            step={0.01}
            valueType="frequency"
            orient="vertical"
            value={synth?.vibratoRate || 0}
            onChange={(event, newValue) => {
              setGlobalSynthSettings({
                vibratoRate: newValue,
              });
            }}
          />
          <Slider
            componentKey="vibratoDepth"
            label="Depth"
            min={0}
            max={1}
            step={0.01}
            value={synth?.vibratoAmount || 0}
            orient="vertical"
            onChange={(event, newValue) => {
              setGlobalSynthSettings({
                vibratoAmount: newValue,
              });
            }}
          />
        </div>
      </form>
    </BaseModule>
  );
};

export default VoiceModule;
