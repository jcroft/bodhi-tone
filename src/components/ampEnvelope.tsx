"use client";

import React, { useEffect, useState } from "react";
import * as Tone from "tone";
import BaseModule from "./BaseModule";
import { SynthOptions, SynthContext } from "@/app/page";
import Slider from "./input/slider";
import { parse } from "path";
import { env } from "process";

type AmpEnvelopeModuleOptions = {
  name: string;
  componentKey: string;
  voiceKeys: string[];
};

const AmpEnvelopeModule: React.FC<AmpEnvelopeModuleOptions> = ({
  name = "Envelope",
  componentKey,
  voiceKeys = ["voice1", "voice2"],
}) => {
  const { synth, saveSynthOptions } = React.useContext(SynthContext);
  const synthState = synth.get() as { [key: string]: SynthOptions };
  const theseVoices = voiceKeys.map((key) => synthState[key]);
  const referenceVoice = theseVoices[0];

  const setAllVoices = (options: any) => {
    voiceKeys.forEach((voiceKey) => {
      synth.set({
        [voiceKey]: options,
      });
    });
  };

  return (
    <BaseModule name={name} componentKey={componentKey}>
      <form>
        <Slider
          componentKey="attack"
          label="Attack"
          min={0}
          max={1}
          step={0.01}
          value={parseFloat(referenceVoice?.envelope.attack.toString())}
          orient="vertical"
          onChange={(event, newValue) => {
            setAllVoices({
              envelope: {
                attack: newValue,
              },
            });
          }}
        />
        <Slider
          componentKey="decay"
          label="Decay"
          min={0}
          max={1}
          step={0.01}
          value={parseFloat(referenceVoice?.envelope.decay.toString())}
          orient="vertical"
          onChange={(event, newValue) => {
            setAllVoices({
              envelope: {
                decay: newValue,
              },
            });
          }}
        />
        <Slider
          componentKey="sustain"
          label="Sustain"
          min={0}
          max={1}
          step={0.01}
          value={parseFloat(referenceVoice?.envelope.sustain.toString())}
          orient="vertical"
          onChange={(event, newValue) => {
            setAllVoices({
              envelope: {
                sustain: newValue,
              },
            });
          }}
        />
        <Slider
          componentKey="release"
          label="Release"
          min={0}
          max={1}
          step={0.01}
          value={parseFloat(referenceVoice?.envelope.release.toString())}
          orient="vertical"
          onChange={(event, newValue) => {
            setAllVoices({
              envelope: {
                release: newValue,
              },
            });
          }}
        />
      </form>
    </BaseModule>
  );
};

export default AmpEnvelopeModule;
