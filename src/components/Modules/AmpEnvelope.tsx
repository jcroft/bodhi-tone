"use client";

import React from "react";
import BaseModule from "./BaseModule";
import Slider from "../Input/Slider";
import * as Tone from "tone";
import { SynthContext } from "../Synth";

type AmpEnvelopeModuleOptions = {
  name: string;
};

const AmpEnvelopeModule: React.FC<AmpEnvelopeModuleOptions> = ({
  name = "Envelope",
}) => {
  const { synth, saveSynthOptions } = React.useContext(SynthContext);
  const synthState = synth.get() as Tone.MonoSynthOptions;

  const updateSynthSettings = (options: Partial<Tone.MonoSynthOptions>) => {
    synth.set(options);
  };

  return (
    <BaseModule name={name}>
      <form>
        <div className="control-group">
          <h3>Envelope</h3>
          <Slider
            componentKey="attack"
            label="A"
            min={0}
            max={1}
            step={0.01}
            value={parseFloat(synthState?.envelope.attack.toString())}
            orient="vertical"
            onChange={(event, newValue) => {
              updateSynthSettings({
                envelope: {
                  attack: newValue,
                } as Tone.EnvelopeOptions,
              });
            }}
          />
          <Slider
            componentKey="decay"
            label="D"
            min={0}
            max={1}
            step={0.01}
            value={parseFloat(synthState?.envelope.decay.toString())}
            orient="vertical"
            onChange={(event, newValue) => {
              updateSynthSettings({
                envelope: {
                  decay: newValue,
                } as Tone.EnvelopeOptions,
              });
            }}
          />
          <Slider
            componentKey="sustain"
            label="S"
            min={0}
            max={1}
            step={0.01}
            value={parseFloat(synthState?.envelope.sustain.toString())}
            orient="vertical"
            onChange={(event, newValue) => {
              updateSynthSettings({
                envelope: {
                  sustain: newValue,
                } as Tone.EnvelopeOptions,
              });
            }}
          />
          <Slider
            componentKey="release"
            label="R"
            min={0}
            max={1}
            step={0.01}
            value={parseFloat(synthState?.envelope.release.toString())}
            orient="vertical"
            onChange={(event, newValue) => {
              updateSynthSettings({
                envelope: {
                  release: newValue,
                } as Tone.EnvelopeOptions,
              });
            }}
          />
        </div>
      </form>
    </BaseModule>
  );
};

export default AmpEnvelopeModule;
