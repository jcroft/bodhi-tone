"use client";
import React from "react";
import * as Tone from "tone";
import BaseModule from "./BaseModule";
import Slider from "../Input/Slider";
import { SynthContext } from "../Synth";

type VoiceModuleOptions = {
  name: string;
};

const VoiceModule: React.FC<VoiceModuleOptions> = ({ name = "Oscillator" }) => {
  const { synth, saveSynthOptions } = React.useContext(SynthContext);
  const synthState = synth?.get() as Tone.MonoSynthOptions;

  const updateSynthSettings = (options: Partial<Tone.MonoSynthOptions>) => {
    synth?.set(options);
  };

  return (
    <BaseModule name={name}>
      <form>
        <Slider
          componentKey="volume"
          label="Volume"
          min={-100}
          max={0}
          step={1}
          value={synthState?.volume || 0}
          orient="vertical"
          onChange={(event, newValue) => {
            updateSynthSettings({
              volume: newValue,
            });
          }}
          showValueFill
        />

        {/* <Select
            componentKey="maxPolyphony"
            label="Count"
            defaultOption="8"
            options={[
              { value: "1", label: "1" },
              { value: "2", label: "2" },
              { value: "4", label: "4" },
              { value: "8", label: "8" },
              { value: "16", label: "16" },
            ]}
            value={synth.maxPolyphony.toString()}
            onChange={(event) => {
              setMaxPolyphony(parseInt(event.target.value));
            }}
          /> */}
        {/* <Slider
            componentKey="portamento"
            label="Glide"
            min={0}
            max={0.1}
            step={0.01}
            orient="vertical"
            value={synthState?.portamento || 0}
            onChange={(event, newValue) => {
              updateSynthSettings({
                portamento: newValue,
              });
            }}
          /> */}
        <Slider
          componentKey="detune"
          label="Tune"
          min={-100}
          max={100}
          step={1}
          value={synthState?.detune || 0}
          orient="vertical"
          onChange={(event, newValue) => {
            updateSynthSettings({
              detune: newValue,
            });
          }}
        />

        {/* <Slider
          componentKey="harmonicity"
          label="Harmonicity"
          min={0.5}
          max={2}
          step={0.01}
          value={synth.get()?.harmonicity || 0}
          onChange={(event, newValue) => {
            setGlobalSynthSettings({
              harmonicity: newValue,
            });
          }}
        /> */}

        {/* <div className="control-group">
          <h3>Vibrato</h3>
          <Slider
            componentKey="vibratoRate"
            label="Rate"
            min={0}
            max={50}
            step={0.01}
            valueType="frequency"
            orient="vertical"
            value={synthState?.vibratoRate || 0}
            onChange={(event, newValue) => {
              setGlobalSynthSettings({
                vibratoRate: newValue,
              });
            }}
          />
          <Slider
            componentKey="vibratoDepth"
            label="Depth"
            min={0}
            max={1}
            step={0.01}
            value={synthState?.vibratoAmount || 0}
            orient="vertical"
            onChange={(event, newValue) => {
              setGlobalSynthSettings({
                vibratoAmount: newValue,
              });
            }}
          />
        </div> */}
      </form>
    </BaseModule>
  );
};

export default VoiceModule;
