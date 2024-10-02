"use client";

import React, { useEffect, useState } from "react";
import * as Tone from "tone";
import BaseModule from "./baseModule";
import { SynthOptions, SynthContext } from "@/app/page";
import Slider from "./input/slider";
import { parse } from "path";
import { env } from "process";

type AmpEnvelopeModuleOptions = {
  name: string;
  componentKey: string;
};

const AmpEnvelopeModule: React.FC<AmpEnvelopeModuleOptions> = ({
  name = "Envelope",
  componentKey,
}) => {
  const { synth } = React.useContext(SynthContext);

  return (
    <BaseModule name={name} componentKey={componentKey}>
      <form>
        <Slider
          componentKey="attack"
          label="Attack"
          min={0}
          max={1}
          step={0.01}
          value={parseFloat(synth.get().envelope.attack.toString())}
          orient="vertical"
          onChange={(event, newValue) => {
            synth.set({
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
          value={parseFloat(synth.get().envelope.decay.toString())}
          orient="vertical"
          onChange={(event, newValue) => {
            synth.set({
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
          value={parseFloat(synth.get().envelope.sustain.toString())}
          orient="vertical"
          onChange={(event, newValue) => {
            synth.set({
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
          value={parseFloat(synth.get().envelope.release.toString())}
          orient="vertical"
          onChange={(event, newValue) => {
            synth.set({
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
