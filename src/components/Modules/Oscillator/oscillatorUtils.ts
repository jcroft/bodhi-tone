import { OmniOscillatorType } from "tone/build/esm/source/oscillator/OscillatorInterface";
import { OscillatorType } from "./oscillatorTypes";

export const getOscillatorTypeLabel = (type: OmniOscillatorType): string => {
  switch (type) {
    case "sine":
      return "Sine";
    case "square":
      return "Square";
    case "sawtooth":
      return "Sawtooth";
    case "triangle":
      return "Triangle";
    case "fmsine":
      return "FM Sine";
    case "fmsquare":
      return "FM Square";
    case "fmsawtooth":
      return "FM Sawtooth";
    case "fmtriangle":
      return "FM Triangle";
    case "amsine":
      return "AM Sine";
    case "amsquare":
      return "AM Square";
    case "amsawtooth":
      return "AM Sawtooth";
    case "amtriangle":
      return "AM Triangle";
    case "pulse":
      return "PWM";

    case "fatsine":
      return "Fat Sine";
    case "fatsquare":
      return "Fat Square";
    case "fatsawtooth":
      return "Fat Saw";
    case "fattriangle":
      return "Fat Triangle";
    default:
      return type.charAt(0).toUpperCase() + type.slice(1);
  }
};

const oscillatorIconMap: Record<OscillatorType, string> = {
  sine: "sine-wave.svg",
  square: "pulse-wave.svg",
  sawtooth: "saw-wave.svg",
  triangle: "triangle-wave.svg",
  fmsine: "sine-wave.svg",
  fmsquare: "pulse-wave.svg",
  fmsawtooth: "saw-wave.svg",
  fmtriangle: "triangle-wave.svg",
  amsine: "sine-wave.svg",
  amsquare: "pulse-wave.svg",
  amsawtooth: "saw-wave.svg",
  amtriangle: "triangle-wave.svg",
  fatsine: "sine-wave.svg",
  fatsquare: "pulse-wave.svg",
  fatsawtooth: "saw-wave.svg",
  fattriangle: "triangle-wave.svg",
  pulse: "pulse-wave.svg",
  custom: "sine-wave.svg",
};

export const getOscillatorIcon = (type: OscillatorType): string => {
  const filename = oscillatorIconMap[type] || "default-wave.svg";
  return `/images/icons/${filename}`;
};