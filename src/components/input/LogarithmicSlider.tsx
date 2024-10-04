import React, { useState } from "react";
import * as Tone from "tone";

const SLIDER_HORIZONTAL_HEIGHT = 10;
const SLIDER_HORIZONTAL_WIDTH = 100;
const SLIDER_VERTICAL_HEIGHT = 100;
const SLIDER_VERTICAL_WIDTH = 10;

interface LogarithmicSliderProps {
  label: string;
  componentKey: string;
  min: number;
  max: number;
  step?: number;
  logarithmic?: boolean;
  defaultValue?: number;
  value: number;
  valueType?: "frequency" | "time" | "volume";
  disabled?: boolean;
  orient?: "vertical" | "horizontal";
  onChange: (
    event: React.ChangeEvent<HTMLInputElement>,
    newValue: number
  ) => void;
}

const LogarithmicSlider: React.FC<LogarithmicSliderProps> = ({
  label,
  componentKey,
  min,
  max,
  value,
  valueType,
  orient = "horizontal",
  onChange,
}) => {
  const [sliderValue, setSliderValue] = useState(Math.log10(value));

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Math.pow(10, parseFloat(event.target.value));
    setSliderValue(parseFloat(event.target.value));
    onChange(event, newValue);
  };

  // If the value type is frequency, use tone to figure out the midi note number
  // and display that in addition to of the raw frequency value
  const sliderValueAsFrequency =
    valueType === "frequency"
      ? Tone.Frequency(sliderValue as number).toNote()
      : undefined;

  const containerStyles = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "top",
  } as React.CSSProperties;

  const styles = {
    appearance: orient === "vertical" ? "slider-vertical" : "slider-horizontal",
    width:
      orient === "vertical" ? SLIDER_VERTICAL_WIDTH : SLIDER_HORIZONTAL_WIDTH,
    height:
      orient === "vertical" ? SLIDER_VERTICAL_HEIGHT : SLIDER_HORIZONTAL_HEIGHT,
  } as React.CSSProperties;

  return (
    <div style={containerStyles}>
      <label htmlFor={componentKey}>{label}</label>
      <input
        type="range"
        min={Math.log10(min)}
        max={Math.log10(max)}
        value={sliderValue}
        step="0.01"
        onChange={handleSliderChange}
      />
      <div>{value.toFixed(2)} Hz</div>
    </div>
  );
};

export default LogarithmicSlider;
