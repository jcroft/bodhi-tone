import React from "react";
import Fader from "../Input/Fader";

interface EffectFaderProps {
  id: string;
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
}

const EffectFader: React.FC<EffectFaderProps> = ({
  id,
  label,
  value,
  min = 0,
  max = 1,
  step = 0.01,
  onChange,
}) => {
  return (
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
        onChange: (_, newValue) => {
          if (typeof newValue === "number") {
            onChange(newValue);
          }
        },
      }}
    />
  );
};

export default React.memo(EffectFader);
