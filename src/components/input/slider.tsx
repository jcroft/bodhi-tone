"use client";
import React, { useState } from "react";
import * as Tone from "tone";

const SLIDER_HORIZONTAL_HEIGHT = 10;
const SLIDER_HORIZONTAL_WIDTH = 100;
const SLIDER_VERTICAL_HEIGHT = 100;
const SLIDER_VERTICAL_WIDTH = 20;

interface SliderProps {
  label: string;
  componentKey: string;
  min: number;
  max: number;
  step?: number;
  logarithmic?: boolean;
  defaultValue?: number;
  value?: number;
  valueType?: "frequency" | "time" | "volume";
  disabled?: boolean;
  orient?: "vertical" | "horizontal";
  onChange: (
    event: React.ChangeEvent<HTMLInputElement>,
    newValue: number
  ) => void;
}

const Slider: React.FC<SliderProps> = ({
  label,
  componentKey,
  min,
  max,
  value,
  defaultValue,
  valueType,
  step,
  disabled = false,
  orient = "horizontal",
  onChange,
}) => {
  const [sliderValue, setSliderValue] = useState(
    value !== undefined ? value : defaultValue
  );

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(event.target.value);
    setSliderValue(newValue);
    onChange(event, newValue);
  };

  // If the value type is frequency, use tone to figure out the midi note number
  // and display that in addition to of the raw frequency value

  const sliderValueAsFrequency = React.useMemo(() => {
    return valueType === "frequency" && sliderValue !== 0
      ? Tone.Frequency(sliderValue as number).toNote()
      : "inf";
  }, [sliderValue]);

  const containerStyles = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "top",
  } as React.CSSProperties;

  const inputStyles = React.useMemo(() => {
    return {
      appearance:
        orient === "vertical" ? "slider-vertical" : "slider-horizontal",
      width:
        orient === "vertical" ? SLIDER_VERTICAL_WIDTH : SLIDER_HORIZONTAL_WIDTH,
      height:
        orient === "vertical"
          ? SLIDER_VERTICAL_HEIGHT
          : SLIDER_HORIZONTAL_HEIGHT,
    } as React.CSSProperties;
  }, [orient]);

  const sliderValueDisplay = React.useMemo(() => {
    return valueType === "volume" && sliderValue !== undefined
      ? `${parseFloat(sliderValue.toString()).toFixed()} dB`
      : valueType === "frequency" && sliderValue !== undefined
      ? `${sliderValue.toFixed()} Hz` // `${sliderValue.toFixed()} Hz (${sliderValueAsFrequency})`
      : sliderValue !== undefined
      ? parseFloat(sliderValue.toString()).toFixed(2)
      : "Unknown";
  }, [sliderValue]);

  return (
    <div style={containerStyles} className="slider-container">
      <label htmlFor={componentKey}>{label}</label>
      <input
        id={componentKey}
        style={inputStyles}
        type="range"
        min={min}
        max={max}
        defaultValue={defaultValue}
        disabled={disabled}
        value={sliderValue}
        step={step || 1}
        onChange={handleSliderChange}
      />
      <span
        className="value"
        style={{
          textAlign: orient === "vertical" ? "center" : "right",
        }}
      >
        {sliderValueDisplay}
      </span>
    </div>
  );
};

export default Slider;
