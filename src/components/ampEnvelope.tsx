"use client";

import React, { useEffect, useState } from "react";
import BaseModule from "./BaseModule";
import { SynthContext } from "@/app/page";
import Slider from "./input/Slider";
import * as Tone from "tone";

type AmpEnvelopeModuleOptions = {
  name: string;
  componentKey: string;
  voiceKeys: ("voice0" | "voice1")[];
};

const AmpEnvelopeModule: React.FC<AmpEnvelopeModuleOptions> = ({
  name = "Envelope",
  componentKey,
  voiceKeys = ["voice0", "voice1"],
}) => {
  const { synth, saveSynthOptions } = React.useContext(SynthContext);
  const synthState = synth.get() as Tone.DuoSynthOptions;
  const theseVoices = voiceKeys.map(
    (key) => synthState[key] as Tone.MonoSynthOptions
  );
  const referenceVoice = theseVoices[0] as Tone.MonoSynthOptions;

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
        <div className="control-group">
          <h3>Envelope</h3>
          <Slider
            componentKey="attack"
            label="A"
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
            label="D"
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
            label="S"
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
            label="R"
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
        </div>
      </form>
    </BaseModule>
  );
};

export default AmpEnvelopeModule;
