import React from "react";
import Fader from "../../Input/Fader";
import { BasicOscillatorFadersProps } from "./oscillatorTypes";
import {
  MIN_OCTAVE,
  MAX_OCTAVE,
  OCTAVE_STEP,
  MIN_SEMITONES,
  MAX_SEMITONES,
  SEMITONES_STEP,
  MIN_DETUNE,
  MAX_DETUNE,
  DETUNE_STEP,
} from "./oscillatorConstants";

const BasicOscillatorFaders: React.FC<BasicOscillatorFadersProps> = ({
  synthState,
  updateSynthSettings,
}) => {
  const createFader = (
    id: string,
    label: string,
    min: number,
    max: number,
    step: number,
    value: number,
    onChange: (newValue: number) => void
  ) => (
    <Fader
      key={id}
      id={id}
      label={label}
      value={value}
      sliderProps={{
        valueLabelDisplay: "auto",
        orientation: "vertical",
        min,
        max,
        step,
        track: false,
        onChange: (_, newValue) => {
          if (typeof newValue === "number") {
            onChange(newValue);
          }
        },
      }}
    />
  );

  return (
    <>
      {createFader(
        "octave",
        "Octave",
        MIN_OCTAVE,
        MAX_OCTAVE,
        OCTAVE_STEP,
        parseFloat(synthState?.detune.toString()) / 1200,
        (newValue) => updateSynthSettings({ detune: newValue * 1200 })
      )}
      {createFader(
        "semitones",
        "Coarse",
        MIN_SEMITONES,
        MAX_SEMITONES,
        SEMITONES_STEP,
        (parseFloat(synthState?.detune.toString()) % 1200) / 100,
        (newValue) =>
          updateSynthSettings({
            detune:
              Math.floor(synthState?.detune / 1200) * 1200 + newValue * 100,
          })
      )}
      {createFader(
        "detune",
        "Fine",
        MIN_DETUNE,
        MAX_DETUNE,
        DETUNE_STEP,
        parseFloat(synthState?.detune.toString()) % 100,
        (newValue) =>
          updateSynthSettings({
            detune: Math.floor(synthState?.detune / 100) * 100 + newValue,
          })
      )}
    </>
  );
};

export default BasicOscillatorFaders;
