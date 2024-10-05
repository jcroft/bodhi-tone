"use client";
import React, { useState } from "react";
import styled from "styled-components";
import * as Tone from "tone";

const SLIDER_HORIZONTAL_HEIGHT = 10;
const SLIDER_HORIZONTAL_WIDTH = 100;
const SLIDER_VERTICAL_HEIGHT = 100;
const SLIDER_VERTICAL_WIDTH = 20;

const StyledVerticalSliderContainer = styled.div<{
  showValueFill: boolean;
  orient: "vertical" | "horizontal";
}>`
  padding-bottom: 2rem;
  position: relative;
  width: 40px;
  height: 120px;

  label {
    font-size: 0.65rem;
    color: #999;
    text-align: center !important;
    width: 100%;
    display: block;
  }

  &:hover {
    .value {
      opacity: 1;
    }
  }

  input {
    --c: #ff5500; /* active color */
    --l: 5px; /* line thickness*/
    --h: 20px; /* thumb height */
    --w: 5px; /* thumb width */

    width: 80px;
    height: var(--h); /* needed for Firefox*/
    --_c: color-mix(in srgb, var(--c), #000 var(--p, 0%));
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background: none;
    cursor: pointer;
    overflow: hidden;
    margin-left: 1.25rem;

    transform: ${(props) =>
      props.orient === "vertical" ? "rotate(-90deg)" : ""};
    transform-origin: ${(props) => (props.orient === "vertical" ? "left" : "")};
    position: ${(props) => (props.orient === "vertical" ? "absolute" : "")};
    top: ${(props) => (props.orient === "vertical" ? "6rem" : "")};
  }
  input:focus-visible,
  input:hover {
    --p: 25%;
  }

  /* chromium */
  input[type="range" i]::-webkit-slider-thumb {
    height: var(--h);
    width: var(--w);
    background: var(--_c);
    border-image: ${(props) =>
      props.showValueFill
        ? "linear-gradient(90deg, var(--_c) 50%, #ccc 0) 0 1 / calc(50% - var(--l) / 2) 100vw/0 100vw"
        : "linear-gradient(90deg, #ccc 50%, #ccc 0) 0 1 / calc(50% - var(--l) / 2) 100vw/0 100vw"};
    -webkit-appearance: none;
    appearance: none;
    transition: 0.3s;
  }

  input[type="range" i]::-webkit-slider-runnable-track {
    background: transparent;
    border-radius: 0.25rem;
    border: none;
    transition: 0.3s;
  }

  /* Firefox */
  input[type="range"]::-moz-range-thumb {
    height: var(--h);
    width: var(--w);
    background: var(--_c);
    border-image: ${(props) =>
      props.showValueFill
        ? "linear-gradient(90deg, var(--_c) 50%, #ccc 0) 0 1 / calc(50% - var(--l) / 2) 100vw/0 100vw"
        : "linear-gradient(90deg, #ccc 50%, #ccc 0) 0 1 / calc(50% - var(--l) / 2) 100vw/0 100vw"};
    -webkit-appearance: none;
    appearance: none;
    transition: 0.3s;
  }
  @supports not (color: color-mix(in srgb, red, red)) {
    input {
      --_c: var(--c);
    }
  }
`;

interface SliderProps {
  label: string;
  componentKey: string;
  min: number;
  max: number;
  step?: number;
  logarithmic?: boolean;
  defaultValue?: number;
  value?: number;
  valueType?: "frequency" | "time" | "volume" | "semitones";
  disabled?: boolean;
  orient?: "vertical" | "horizontal";
  showValueFill?: boolean;
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
  showValueFill = false,
  orient = "vertical",
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
    position: `relative`,
    width: "30px",
  } as React.CSSProperties;

  const sliderStyles = React.useMemo(() => {
    return {} as React.CSSProperties;
  }, [orient]);

  const inputStyles = React.useMemo(() => {
    return {} as React.CSSProperties;
  }, [orient]);

  const sliderValueDisplay = React.useMemo(() => {
    return valueType === "volume" && sliderValue !== undefined
      ? `${parseFloat(sliderValue.toString()).toFixed()} dB`
      : valueType === "frequency" && sliderValue !== undefined
      ? `${sliderValue.toFixed()} Hz` // `${sliderValue.toFixed()} Hz (${sliderValueAsFrequency})`
      : valueType === "semitones" && sliderValue !== undefined
      ? sliderValue / 100 === 12
        ? "1 oct"
        : sliderValue / 100 === -12
        ? "-1 oct"
        : `${(sliderValue / 100).toFixed()} st`
      : sliderValue !== undefined
      ? parseFloat(sliderValue.toString()).toFixed(2)
      : "Unknown";
  }, [sliderValue]);

  return (
    <StyledVerticalSliderContainer
      showValueFill={showValueFill}
      orient={orient}
    >
      <div style={sliderStyles}>
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
      </div>
      <span
        className="value"
        style={{
          textAlign: orient === "vertical" ? "center" : "right",
        }}
      >
        {sliderValueDisplay}
      </span>
    </StyledVerticalSliderContainer>
  );
};

export default Slider;
