"use client";

import { SynthContext } from "@/app/page";
import React, { useEffect, useState } from "react";
import * as Tone from "tone";
import BaseModule from "./BaseModule";
import Slider from "./input/slider";
import Select from "./input/select";

type VoiceModuleOptions = {
  name: string;
  componentKey: string;
  voiceKeys: string[];
};

const VoiceModule: React.FC<VoiceModuleOptions> = ({
  name = "Oscillator",
  componentKey,
  voiceKeys,
}) => {
  const { synth, saveSynthOptions } = React.useContext(SynthContext);
  const synthState = synth.get() as {
    [key: string]: Tone.PolySynthOptions<Tone.DuoSynthOptions>;
  };
  const theseVoices = voiceKeys.map(
    (key) => synthState[key]
  ) as Tone.PolySynthOptions<Tone.DuoSynthOptions>[];
  const referenceVoice = theseVoices[0];

  const setAllVoices = (options: Partial<Tone.DuoSynthOptions>) => {
    voiceKeys.forEach((voiceKey) => {
      console.log(`Setting voice ${voiceKey} to`, options);
      synth.set({
        [voiceKey]: options,
      });
      console.log(synth.get(), "synth.get()");
    });
  };

  const setGlobalSynthSettings = (
    options: Partial<Tone.PolySynthOptions<Tone.DuoSynthOptions>>
  ) => {
    console.log(`Setting global synth settings to`, options);
    synth.set(options);
    console.log(synth.get(), "synth.get()");
  };

  const setMaxPolyphony = (maxPolyphony: number) => {
    console.log(`Setting max polyphony to`, maxPolyphony);
    synth.maxPolyphony = maxPolyphony;
    console.log(synth.maxPolyphony, "synth.maxPolyphony");
  };

  // We need a form that will handle the following:
  // - Portamento
  // - Detune
  // - Volume
  // Vibrato Rate
  // Vibrato Depth
  // Harmonicity

  console.log(referenceVoice, "referenceVoice");
  console.log("synthState", synthState);

  return (
    <BaseModule name={name} componentKey={componentKey}>
      <form className="column">
        <select
          value={synth.maxPolyphony}
          onChange={(event) => {
            setMaxPolyphony(parseInt(event.target.value));
          }}
        >
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={4}>4</option>
          <option value={8}>8</option>
          <option value={16}>16</option>
        </select>
        <Slider
          componentKey="portamento"
          label="Portamento"
          min={0}
          max={0.1}
          step={0.01}
          value={synth.get()?.portamento || 0}
          onChange={(event, newValue) => {
            setGlobalSynthSettings({
              portamento: newValue,
            });
          }}
        />
        <Slider
          componentKey="detune"
          label="Detune"
          min={-100}
          max={100}
          step={1}
          value={synth.detune || 0}
          onChange={(event, newValue) => {
            setGlobalSynthSettings({
              detune: newValue,
            });
          }}
        />
        <Slider
          componentKey="volume"
          label="Volume"
          min={-100}
          max={0}
          step={1}
          value={referenceVoice?.volume || 0}
          onChange={(event, newValue) => {
            setAllVoices({
              volume: newValue,
            });
          }}
        />
        <Slider
          componentKey="vibratoRate"
          label="Vibrato Rate"
          min={0}
          max={50}
          step={0.01}
          valueType="frequency"
          value={synth?.vibratoRate || 0}
          onChange={(event, newValue) => {
            setGlobalSynthSettings({
              vibratoRate: newValue,
            });
          }}
        />
        <Slider
          componentKey="vibratoDepth"
          label="Vibrato Depth"
          min={0}
          max={1}
          step={0.01}
          value={synth?.vibratoAmount || 0}
          onChange={(event, newValue) => {
            setGlobalSynthSettings({
              vibratoAmount: newValue,
            });
          }}
        />
        <Slider
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
        />
      </form>
    </BaseModule>
  );
};

export default VoiceModule;
