"use client";
import React from "react";
import * as Tone from "tone";
import BaseModule from "./BaseModule";
import Slider from "../Input/Slider";
import Select from "../Input/Select";
import { OmniOscillatorType } from "tone/build/esm/source/oscillator/OscillatorInterface";
import { DEFAULT_SYNTH_OPTIONS, SynthContext } from "../Synth";

type OscillatorModuleOptions = {
  name: string;
};

const OscillatorModule: React.FC<OscillatorModuleOptions> = ({
  name = "Oscillator",
}) => {
  const { synth, saveSynthOptions } = React.useContext(SynthContext);
  const synthState = synth?.get() as Tone.MonoSynthOptions;

  const [selectedOscillator, setSelectedOscillator] = React.useState(
    synthState?.oscillator?.type ||
      DEFAULT_SYNTH_OPTIONS.options?.oscillator?.type
  );

  const updateSynthSettings = (options: Partial<Tone.MonoSynthOptions>) => {
    synth?.set(options);
  };

  const oscillatorChoices = React.useMemo(
    () => [
      { value: "sine", label: "Sine (Single)" },
      { value: "fatsine", label: "Sine (Unison)" },
      { value: "triangle", label: "Tri (Single)" },
      { value: "fattriangle", label: "Tri (Unison)" },
      { value: "sawtooth", label: "Saw (Single)" },
      { value: "fatsawtooth", label: "Saw (Unison)" },
      { value: "square", label: "Square (Single)" },
      { value: "fatsquare", label: "Square (Unison)" },
      { value: "pwm", label: "Square (PWM)" },

      { value: "fmsine", label: "FM Sines" },
      { value: "fmtriangle", label: "FM Triangles" },
      { value: "fmsawtooth", label: "FM Saws" },
      { value: "fmsquare", label: "FM Squares" },

      { value: "amsine", label: "AM Sines" },
      { value: "amtriangle", label: "AM Triangles" },
      { value: "amsawtooth", label: "AM Saws" },
      { value: "amsquare", label: "AM Squares" },
    ],
    []
  );

  return (
    <BaseModule name={name}>
      <form>
        <div className="control-group">
          <Select
            componentKey="oscillator"
            label="Engine"
            value={selectedOscillator || "sine"}
            defaultOption={"sine" as Tone.ToneOscillatorType}
            onChange={(event, newValue) => {
              updateSynthSettings({
                oscillator: { type: newValue as OmniOscillatorType },
              } as Tone.MonoSynthOptions);
              setSelectedOscillator(newValue as OmniOscillatorType);
            }}
            options={oscillatorChoices}
          />

          {synthState?.oscillator?.type === "pwm" && (
            <Slider
              componentKey="pulse-width"
              label="PWM"
              min={0}
              max={1}
              step={0.01}
              value={
                parseFloat(
                  synthState?.oscillator?.modulationFrequency.toString()
                ) || 0
              }
              onChange={(event, newValue) => {
                updateSynthSettings({
                  oscillator: {
                    modulationFrequency: newValue,
                  } as Tone.PWMOscillatorOptions,
                });
              }}
            />
          )}

          {synthState?.oscillator?.type === "fatsawtooth" ||
          synthState?.oscillator?.type === "fatsine" ||
          synthState?.oscillator?.type === "fattriangle" ||
          synthState?.oscillator?.type === "fatsquare" ? (
            <>
              <Slider
                componentKey="count"
                label="Count"
                min={1}
                max={8}
                step={1}
                value={synthState?.oscillator?.count || 3}
                onChange={(event, newValue) => {
                  updateSynthSettings({
                    oscillator: {
                      count: newValue,
                    } as Tone.OmniOscillatorOptions,
                  });
                }}
              />

              <Slider
                componentKey="spread"
                label="Spread"
                min={0}
                max={100}
                step={1}
                value={synthState?.oscillator?.spread || 20}
                onChange={(event, newValue) => {
                  updateSynthSettings({
                    oscillator: {
                      spread: newValue,
                    } as Tone.OmniOscillatorOptions,
                  });
                }}
              />
            </>
          ) : null}

          {synthState?.oscillator?.type === "fmsine" ||
          synthState?.oscillator?.type === "fmsawtooth" ||
          synthState?.oscillator?.type === "fmtriangle" ||
          synthState?.oscillator?.type === "fmsquare" ? (
            <>
              <Slider
                componentKey="modulationIndex"
                label="Mod"
                min={0}
                max={100}
                step={1}
                value={synthState?.oscillator?.modulationIndex || 10}
                onChange={(event, newValue) => {
                  updateSynthSettings({
                    oscillator: {
                      modulationIndex: newValue,
                    } as Tone.OmniOscillatorOptions,
                  });
                }}
              />

              <Slider
                componentKey="harmonicity"
                label="Ratio"
                min={0}
                max={100}
                step={1}
                value={synthState?.oscillator?.harmonicity || 1}
                onChange={(event, newValue) => {
                  updateSynthSettings({
                    oscillator: {
                      harmonicity: newValue,
                    } as Tone.OmniOscillatorOptions,
                  });
                }}
              />
            </>
          ) : null}

          {synthState?.oscillator?.type === "amsine" ||
          synthState?.oscillator?.type === "amsawtooth" ||
          synthState?.oscillator?.type === "amtriangle" ||
          synthState?.oscillator?.type === "amsquare" ? (
            <>
              <Slider
                componentKey="harmonicity"
                label="Ratio"
                min={0}
                max={100}
                step={1}
                value={synthState?.oscillator?.harmonicity || 1}
                onChange={(event, newValue) => {
                  updateSynthSettings({
                    oscillator: {
                      harmonicity: newValue,
                    } as Tone.OmniOscillatorOptions,
                  });
                }}
              />
            </>
          ) : null}
        </div>
        <div className="control-group">
          <h3>Tuning</h3>
          <Slider
            componentKey="detune"
            label="Coarse"
            min={-1200}
            max={1200}
            step={100}
            value={synthState?.detune || 0}
            valueType="semitones"
            onChange={(event, newValue) => {
              updateSynthSettings({
                detune: newValue,
              });
            }}
          />
          <Slider
            componentKey="detune"
            label="Fine"
            min={-100}
            max={100}
            step={1}
            value={synthState?.detune || 0}
            onChange={(event, newValue) => {
              updateSynthSettings({
                detune: newValue,
              });
            }}
          />
        </div>
      </form>
    </BaseModule>
  );
};

export default OscillatorModule;
