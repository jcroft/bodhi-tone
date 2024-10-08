"use client";

import React from "react";
import BaseModule from "./BaseModule";
import * as Tone from "tone";
import Fader from "../Input/Fader";
import { useSynth } from "@/contexts/SynthContext";

type AmpEnvelopeModuleOptions = {
  name?: string;
};

type EnvelopeParam = "attack" | "decay" | "sustain" | "release";

const AmpEnvelopeModule: React.FC<AmpEnvelopeModuleOptions> = ({
  name = "Envelope",
}) => {
  const { synth } = useSynth();
  const synthState = synth?.get() as Tone.MonoSynthOptions;

  const updateSynthSettings = React.useCallback(
    (options: Partial<Tone.MonoSynthOptions>) => {
      synth?.set(options);
    },
    [synth]
  );

  const createFader = React.useCallback(
    (
      param: EnvelopeParam,
      label: string,
      min: number,
      max: number,
      step: number
    ) => (
      <Fader
        key={param}
        id={param}
        label={label}
        value={parseFloat(synthState?.envelope[param].toString())}
        sliderProps={{
          valueLabelDisplay: "auto",
          orientation: "vertical",
          min: min,
          max: max,
          step: step,
          onChange: (event: Event, newValue: number | number[]) => {
            updateSynthSettings({
              envelope: {
                ...synthState?.envelope,
                [param]: newValue,
              } as Omit<Tone.EnvelopeOptions, "context"> | undefined,
            });
          },
        }}
      />
    ),
    [synthState?.envelope, updateSynthSettings]
  );

  const faders = React.useMemo(
    () =>
      [
        { param: "attack", label: "A", min: 0, max: 1, step: 0.01 },
        { param: "decay", label: "D", min: 0, max: 1, step: 0.01 },
        { param: "sustain", label: "S", min: 0, max: 1, step: 0.01 },
        { param: "release", label: "R", min: 0, max: 1, step: 0.01 },
      ].map(({ param, label, min, max, step }) =>
        createFader(param as EnvelopeParam, label, min, max, step)
      ),
    [createFader]
  );

  return (
    <BaseModule name={name}>
      <form>
        <div className="control-group">
          <h3>Envelope</h3>
          {faders}
        </div>
      </form>
    </BaseModule>
  );
};

export default AmpEnvelopeModule;
