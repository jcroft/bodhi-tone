"use client";

import React from "react";
import BaseModule from "./BaseModule";
import { SynthContext } from "@/app/page";
import Slider from "./Input/Slider";
import LogarithmicSlider from "./Input/LogarithmicSlider";
import * as Tone from "tone";

type FilterWithEnvelopeModuleOptions = {
  name: string;
  componentKey: string;
  voiceKeys: ("voice0" | "voice1")[];
};

const FilterWithEnvelopeModule: React.FC<FilterWithEnvelopeModuleOptions> = ({
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
      // console.log(`Setting voice ${voiceKey} to`, options);
      synth.set({
        [voiceKey]: options,
      });
    });
  };

  return (
    <BaseModule name={name} componentKey={componentKey}>
      <form>
        <LogarithmicSlider
          componentKey="filter-base-freq"
          label="Cutoff"
          min={1}
          max={20000}
          step={0.01}
          value={
            parseFloat(
              referenceVoice?.filterEnvelope?.baseFrequency.toString()
            ) || 0
          }
          valueType="frequency"
          orient="vertical"
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
          label="Reso"
          min={0}
          max={20}
          step={0.1}
          value={referenceVoice?.filter?.Q || 0}
          orient="vertical"
          onChange={(event, newValue) => {
            setAllVoices({
              filter: {
                Q: newValue,
              },
            });
          }}
        />

        <div className="control-group">
          <h3>Envelope</h3>
          <Slider
            componentKey="filter-attack"
            label="A"
            min={0}
            max={1}
            step={0.01}
            value={parseFloat(
              referenceVoice?.filterEnvelope?.attack?.toString()
            )}
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
            label="D"
            min={0}
            max={1}
            step={0.01}
            value={parseFloat(
              referenceVoice?.filterEnvelope?.decay?.toString()
            )}
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
            label="S"
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
            label="R"
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
        </div>
      </form>
    </BaseModule>
  );
};

export default FilterWithEnvelopeModule;
