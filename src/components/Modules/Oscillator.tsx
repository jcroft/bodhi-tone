"use client";
import React from "react";
import * as Tone from "tone";
import BaseModule from "./BaseModule";
import Slider from "../Input/Slider";
import Select from "@mui/material/Select";
import { OmniOscillatorType } from "tone/build/esm/source/oscillator/OscillatorInterface";
import { DEFAULT_SYNTH_OPTIONS, SynthContext } from "../Synth";
import { MenuItem } from "@mui/material";
import Fader from "../Input/Fader";

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
            value={selectedOscillator}
            onChange={(event) => {
              const newValue = event.target.value as OmniOscillatorType;
              setSelectedOscillator(newValue);
              updateSynthSettings({
                oscillator: {
                  type: newValue,
                } as Tone.OmniOscillatorOptions,
              });
            }}
            style={{ maxHeight: "40px" }}
          >
            {oscillatorChoices.map((choice) => (
              <MenuItem key={choice.value} value={choice.value}>
                {choice.label}
              </MenuItem>
            ))}
          </Select>

          {synthState?.oscillator?.type === "pwm" && (
            <Fader
              id="pulse-width"
              label="PWM"
              value={parseFloat(
                synthState?.oscillator.modulationFrequency.toString()
              )}
              sliderProps={{
                valueLabelDisplay: "auto",
                orientation: "vertical",
                min: 0,
                max: 1,
                step: 0.01,
                onChange: (event, newValue) => {
                  updateSynthSettings({
                    oscillator: {
                      modulationFrequency: newValue,
                    } as Tone.PWMOscillatorOptions,
                  });
                },
              }}
            />
          )}

          {synthState?.oscillator?.type === "fatsawtooth" ||
          synthState?.oscillator?.type === "fatsine" ||
          synthState?.oscillator?.type === "fattriangle" ||
          synthState?.oscillator?.type === "fatsquare" ? (
            <>
              <Fader
                id="count"
                label="Count"
                value={parseFloat(synthState?.oscillator.count.toString())}
                sliderProps={{
                  valueLabelDisplay: "auto",
                  orientation: "vertical",
                  min: 1,
                  max: 8,
                  step: 1,
                  onChange: (event, newValue) => {
                    updateSynthSettings({
                      oscillator: {
                        count: newValue,
                      } as Tone.OmniOscillatorOptions,
                    });
                  },
                }}
              />

              <Fader
                id="spread"
                label="Spread"
                value={parseFloat(synthState?.oscillator.spread.toString())}
                sliderProps={{
                  valueLabelDisplay: "auto",
                  orientation: "vertical",
                  min: 0,
                  max: 100,
                  step: 1,
                  onChange: (event, newValue) => {
                    updateSynthSettings({
                      oscillator: {
                        spread: newValue,
                      } as Tone.OmniOscillatorOptions,
                    });
                  },
                }}
              />
            </>
          ) : null}

          {synthState?.oscillator?.type === "fmsine" ||
          synthState?.oscillator?.type === "fmsawtooth" ||
          synthState?.oscillator?.type === "fmtriangle" ||
          synthState?.oscillator?.type === "fmsquare" ? (
            <>
              <Fader
                id="modulation-index"
                label="Mod"
                value={parseFloat(
                  synthState?.oscillator.modulationIndex.toString()
                )}
                sliderProps={{
                  valueLabelDisplay: "auto",
                  orientation: "vertical",
                  min: 0,
                  max: 100,
                  step: 1,
                  onChange: (event, newValue) => {
                    updateSynthSettings({
                      oscillator: {
                        modulationIndex: newValue,
                      } as Tone.OmniOscillatorOptions,
                    });
                  },
                }}
              />

              <Fader
                id="harmonicity"
                label="Ratio"
                value={parseFloat(
                  synthState?.oscillator.harmonicity.toString()
                )}
                sliderProps={{
                  valueLabelDisplay: "auto",
                  orientation: "vertical",
                  min: 0,
                  max: 100,
                  step: 1,
                  onChange: (event, newValue) => {
                    updateSynthSettings({
                      oscillator: {
                        harmonicity: newValue,
                      } as Tone.OmniOscillatorOptions,
                    });
                  },
                }}
              />
            </>
          ) : null}

          {synthState?.oscillator?.type === "amsine" ||
          synthState?.oscillator?.type === "amsawtooth" ||
          synthState?.oscillator?.type === "amtriangle" ||
          synthState?.oscillator?.type === "amsquare" ? (
            <>
              <Fader
                id="harmonicity"
                label="Ratio"
                value={parseFloat(
                  synthState?.oscillator.harmonicity.toString()
                )}
                sliderProps={{
                  valueLabelDisplay: "auto",
                  orientation: "vertical",
                  min: 0,
                  max: 100,
                  step: 1,
                  onChange: (event, newValue) => {
                    updateSynthSettings({
                      oscillator: {
                        harmonicity: newValue,
                      } as Tone.OmniOscillatorOptions,
                    });
                  },
                }}
              />
            </>
          ) : null}
        </div>
        <div className="control-group">
          <h3>Tuning</h3>
          <Fader
            id="detune"
            label="Coarse"
            value={parseFloat(synthState?.detune.toString())}
            sliderProps={{
              valueLabelDisplay: "auto",
              valueLabelFormat: (value: number) => `${value / 100} st`,
              orientation: "vertical",
              min: -1200,
              max: 1200,
              step: 100,
              track: false,
              onChange: (event, newValue) => {
                if (typeof newValue === "number") {
                  updateSynthSettings({
                    detune: newValue,
                  });
                }
              },
            }}
          />

          <Fader
            id="detune"
            label="Fine"
            value={parseFloat(synthState?.detune.toString())}
            sliderProps={{
              valueLabelDisplay: "auto",
              valueLabelFormat: (value: number) => `${value.toFixed()} ct`,
              orientation: "vertical",
              min: -100,
              max: 100,
              step: 1,
              track: false,
              onChange: (event, newValue) => {
                if (typeof newValue === "number") {
                  updateSynthSettings({
                    detune: newValue,
                  });
                }
              },
            }}
          />
        </div>
      </form>
    </BaseModule>
  );
};

export default OscillatorModule;
