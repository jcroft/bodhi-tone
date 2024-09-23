"use client";

import React, { useEffect, useState } from "react";
import * as Tone from "tone";
import BaseModule from "./baseModule";
import { SynthOptions, SynthOptionsContext } from "@/app/page";
import Slider from "./input/slider";
import { parse } from "path";
import { env } from "process";

type AmpEnvelopeModuleOptions = {
  name: string;
  componentKey: string;
  envelope: Tone.Envelope;
  isOn: boolean;
};

const AmpEnvelopeModule: React.FC<AmpEnvelopeModuleOptions> = ({
  name = "Envelope",
  envelope,
  isOn,
  componentKey,
}) => {
  const { synthOptions, setSynthOptions } =
    React.useContext(SynthOptionsContext);
  const [isActive, setIsActive] = useState(isOn);

  const handleActivate = () => {
    setSynthOptions({
      ...synthOptions,
      ampEnvelope: {
        ...synthOptions.ampEnvelope,
        isOn: true,
      },
    });
  };

  const handleDeactivate = () => {
    setSynthOptions({
      ...synthOptions,
      ampEnvelope: {
        ...synthOptions.ampEnvelope,
        isOn: false,
      },
    });
  };

  return (
    <BaseModule
      name={name}
      componentKey={componentKey}
      isOn={isOn}
      onActivate={handleActivate}
      onDeactivate={handleDeactivate}
    >
      <form>
        <Slider
          componentKey="attack"
          label="Attack"
          min={0}
          max={1}
          step={0.01}
          value={parseFloat(envelope.attack.toString())}
          orient="vertical"
          onChange={(event, newValue) => {
            envelope.attack = newValue;
          }}
        />
        <Slider
          componentKey="decay"
          label="Decay"
          min={0}
          max={1}
          step={0.01}
          value={parseFloat(envelope.decay.toString())}
          orient="vertical"
          onChange={(event, newValue) => {
            envelope.decay = newValue;
          }}
        />
        <Slider
          componentKey="sustain"
          label="Sustain"
          min={0}
          max={1}
          step={0.01}
          value={envelope.sustain}
          orient="vertical"
          onChange={(event, newValue) => {
            envelope.sustain = newValue;
          }}
        />
        <Slider
          componentKey="release"
          label="Release"
          min={0}
          max={1}
          step={0.01}
          value={parseFloat(envelope.release.toString())}
          orient="vertical"
          onChange={(event, newValue) => {
            envelope.release = newValue;
          }}
        />
      </form>
    </BaseModule>
  );
};

export default AmpEnvelopeModule;
