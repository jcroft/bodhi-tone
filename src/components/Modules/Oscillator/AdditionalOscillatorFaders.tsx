import React from "react";
import Fader from "../../Input/Fader";
import { AdditionalOscillatorFadersProps } from "./oscillatorTypes";

const AdditionalOscillatorFaders: React.FC<AdditionalOscillatorFadersProps> = ({
  synthState,
  updateSynthSettings,
  oscillatorType,
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
        orientation: "horizontal",
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

  const getFMFaders = () => [
    createFader(
      "modulationIndex",
      "Mod Index",
      0,
      100,
      1,
      (synthState?.oscillator as any)?.modulationIndex || 0,
      (newValue) =>
        updateSynthSettings({ oscillator: { modulationIndex: newValue } })
    ),
    createFader(
      "harmonicity",
      "Harmonicity",
      0,
      10,
      0.1,
      (synthState?.oscillator as any)?.harmonicity || 1,
      (newValue) =>
        updateSynthSettings({ oscillator: { harmonicity: newValue } })
    ),
  ];

  const getAMFaders = () => [
    createFader(
      "harmonicity",
      "Harmonicity",
      0,
      10,
      0.1,
      (synthState?.oscillator as any)?.harmonicity || 1,
      (newValue) =>
        updateSynthSettings({ oscillator: { harmonicity: newValue } })
    ),
  ];

  const getFatFaders = () => [
    createFader(
      "spread",
      "Spread",
      0,
      100,
      1,
      (synthState?.oscillator as any)?.spread || 0,
      (newValue) => updateSynthSettings({ oscillator: { spread: newValue } })
    ),
    createFader(
      "count",
      "Count",
      1,
      8,
      1,
      (synthState?.oscillator as any)?.count || 1,
      (newValue) => updateSynthSettings({ oscillator: { count: newValue } })
    ),
  ];

  const getPulseFaders = () => [
    createFader(
      "width",
      "Width",
      0,
      1,
      0.01,
      (synthState?.oscillator as any)?.width || 0.5,
      (newValue) => updateSynthSettings({ oscillator: { width: newValue } })
    ),
  ];

  const getAdditionalFaders = () => {
    if (oscillatorType.startsWith("fm")) return getFMFaders();
    if (oscillatorType.startsWith("am")) return getAMFaders();
    if (oscillatorType.startsWith("fat")) return getFatFaders();
    if (oscillatorType === "pulse") return getPulseFaders();
    return null;
  };

  const additionalFaders = getAdditionalFaders();

  return additionalFaders ? <>{additionalFaders}</> : null;
};

export default AdditionalOscillatorFaders;
