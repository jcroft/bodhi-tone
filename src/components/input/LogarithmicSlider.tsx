import React, { useState } from "react";
import Slider from "./Slider";

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

  return (
    <Slider
      label={label}
      componentKey={componentKey}
      min={Math.log10(min)}
      max={Math.log10(max)}
      value={sliderValue}
      step={0.01}
      orient={orient}
      onChange={handleSliderChange}
      valueType={valueType}
    />
  );
};

export default LogarithmicSlider;
