"use client";

import { SynthContext } from "@/app/page";
import React, { useEffect, useState } from "react";
import * as Tone from "tone";
import BaseModule from "./BaseModule";
import Slider from "./input/slider";
import Select from "./input/select";

type OscillatorModuleOptions = {
  name: string;
  componentKey: string;
  voiceKeys: string[];
};

const OscillatorModule: React.FC<OscillatorModuleOptions> = ({
  name = "Oscillator",
  componentKey,
  voiceKeys,
}) => {
  console.log(voiceKeys, "voiceKeys");
  const { synth, saveSynthOptions } = React.useContext(SynthContext);
  const synthState = synth.get() as {
    [key: string]: Tone.PolySynthOptions<Tone.DuoSynthOptions>;
  };
  console.log(synthState, "synthState");
  // Get just the voices we care about from the synth state
  const theseVoices = voiceKeys.map(
    (key) => synthState[key]
  ) as Tone.PolySynthOptions<Tone.DuoSynthOptions>[];
  console.log(theseVoices, "theseVoices");
  // Get the first voice as a reference
  const referenceVoice = theseVoices[0];
  console.log(referenceVoice, "referenceVoice");

  const waveformOptions = React.useMemo(
    () => [
      { value: "sine" as Tone.ToneOscillatorType, label: "Sine" },
      { value: "square" as Tone.ToneOscillatorType, label: "Square" },
      { value: "sawtooth" as Tone.ToneOscillatorType, label: "Sawtooth" },
      { value: "triangle" as Tone.ToneOscillatorType, label: "Triangle" },
    ],
    []
  );

  const setAllVoices = (options: any) => {
    voiceKeys.forEach((voiceKey) => {
      console.log(`Setting voice ${voiceKey} to`, options);
      synth.set({
        [voiceKey]: options,
      });
      console.log(synth.get(), "synth.get()");
    });
  };

  console.log(
    referenceVoice?.oscillator?.type,
    "referenceVoice?.oscillator?.type"
  );

  return (
    <BaseModule name={name} componentKey={componentKey}>
      <form className="column">
        <Select
          label="Waveform"
          value={referenceVoice?.oscillator?.type || "sine"}
          componentKey="type"
          defaultOption={"sine" as Tone.ToneOscillatorType}
          onChange={(event, newValue) => {
            setAllVoices({
              oscillator: {
                type: newValue,
              },
            });
          }}
          options={waveformOptions}
        />
      </form>
    </BaseModule>
  );
};

export default OscillatorModule;
