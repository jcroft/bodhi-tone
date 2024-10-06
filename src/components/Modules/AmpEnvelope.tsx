"use client";

import React from "react";
import BaseModule from "./BaseModule";
import * as Tone from "tone";
import { SynthContext } from "../Synth";
import Fader from "../Input/Fader";

type AmpEnvelopeModuleOptions = {
  name: string;
};

const AmpEnvelopeModule: React.FC<AmpEnvelopeModuleOptions> = ({
  name = "Envelope",
}) => {
  const { synth, saveSynthOptions } = React.useContext(SynthContext);
  const synthState = synth?.get() as Tone.MonoSynthOptions;

  const updateSynthSettings = (options: Partial<Tone.MonoSynthOptions>) => {
    synth?.set(options);
  };

  return (
    <BaseModule name={name}>
      <form>
        <div className="control-group">
          <h3>Envelope</h3>
          <Fader
            id="attack"
            label="A"
            value={parseFloat(synthState?.envelope.attack.toString())}
            sliderProps={{
              valueLabelDisplay: "auto",
              orientation: "vertical",
              min: 0,
              max: 1,
              step: 0.01,
              onChange: (event, newValue) => {
                updateSynthSettings({
                  envelope: {
                    attack: newValue,
                  } as Tone.EnvelopeOptions,
                });
              },
            }}
          />

          <Fader
            id="decay"
            label="D"
            value={parseFloat(synthState?.envelope.decay.toString())}
            sliderProps={{
              valueLabelDisplay: "auto",
              orientation: "vertical",
              min: 0,
              max: 1,
              step: 0.01,
              onChange: (event, newValue) => {
                updateSynthSettings({
                  envelope: {
                    decay: newValue,
                  } as Tone.EnvelopeOptions,
                });
              },
            }}
          />

          <Fader
            id="sustain"
            label="S"
            value={parseFloat(synthState?.envelope.sustain.toString())}
            sliderProps={{
              valueLabelDisplay: "auto",
              orientation: "vertical",
              min: 0,
              max: 1,
              step: 0.01,
              onChange: (event, newValue) => {
                updateSynthSettings({
                  envelope: {
                    sustain: newValue,
                  } as Tone.EnvelopeOptions,
                });
              },
            }}
          />

          <Fader
            id="release"
            label="R"
            value={parseFloat(synthState?.envelope.release.toString())}
            sliderProps={{
              valueLabelDisplay: "auto",
              orientation: "vertical",
              min: 0,
              max: 1,
              step: 0.01,
              onChange: (event, newValue) => {
                updateSynthSettings({
                  envelope: {
                    release: newValue,
                  } as Tone.EnvelopeOptions,
                });
              },
            }}
          />
        </div>
      </form>
    </BaseModule>
  );
};

export default AmpEnvelopeModule;
