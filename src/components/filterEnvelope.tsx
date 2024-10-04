"use client";

import React from "react";
import BaseModule from "./BaseModule";
import { SynthContext, SynthOptions } from "@/app/page";
import Slider from "./input/slider";
import LogarithmicSlider from "./input/LogarithmicSlider";

type FilterWithEnvelopeModuleOptions = {
  name: string;
  componentKey: string;
  voiceKeys: string[];
};

const FilterWithEnvelopeModule: React.FC<FilterWithEnvelopeModuleOptions> = ({
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
      console.log(`Setting voice ${voiceKey} to`, options);
      synth.set({
        [voiceKey]: options,
      });
      console.log(synth.get()[`${voiceKey}`], `${voiceKey} after update`);
    });
  };

  return (
    <BaseModule name={name} componentKey={componentKey}>
      <form className="column">
        <LogarithmicSlider
          // componentKey="filter-base-freq"
          // label="Frequency"
          min={1}
          max={20000}
          // step={0.01}
          value={referenceVoice?.filterEnvelope?.baseFrequency || 0}
          // logarithmic
          // valueType="frequency"
          // orient="horizontal"
          onChange={(event, newValue) => {
            setAllVoices({
              filterEnvelope: {
                baseFrequency: newValue,
              },
            });
          }}
        />

        <Slider
          componentKey="filter-resonance"
          label="Resonance"
          min={0}
          max={20}
          step={0.1}
          value={referenceVoice?.filter?.Q || 0}
          orient="horizontal"
          onChange={(event, newValue) => {
            setAllVoices({
              filter: {
                Q: newValue,
              },
            });
          }}
        />
      </form>

      <form>
        <Slider
          componentKey="filter-attack"
          label="Attack"
          min={0}
          max={1}
          step={0.01}
          value={parseFloat(referenceVoice?.filterEnvelope?.attack?.toString())}
          orient="vertical"
          onChange={(event, newValue) => {
            setAllVoices({
              filterEnvelope: {
                attack: newValue,
              },
            });
          }}
        />
        <Slider
          componentKey="filter-decay"
          label="Decay"
          min={0}
          max={1}
          step={0.01}
          value={parseFloat(referenceVoice?.filterEnvelope?.decay?.toString())}
          orient="vertical"
          onChange={(event, newValue) => {
            setAllVoices({
              filterEnvelope: {
                decay: newValue,
              },
            });
          }}
        />
        <Slider
          componentKey="filter-sustain"
          label="Sustain"
          min={0}
          max={1}
          step={0.01}
          value={parseFloat(
            referenceVoice?.filterEnvelope?.sustain?.toString()
          )}
          orient="vertical"
          onChange={(event, newValue) => {
            setAllVoices({
              filterEnvelope: {
                sustain: newValue,
              },
            });
          }}
        />
        <Slider
          componentKey="filter-release"
          label="Release"
          min={0}
          max={1}
          step={0.01}
          value={parseFloat(
            referenceVoice?.filterEnvelope?.release?.toString()
          )}
          orient="vertical"
          onChange={(event, newValue) => {
            setAllVoices({
              filterEnvelope: {
                release: newValue,
              },
            });
          }}
        />
      </form>
    </BaseModule>
  );
};

export default FilterWithEnvelopeModule;
