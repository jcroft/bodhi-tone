"use client";
import Slider, { SliderProps } from "@mui/material/Slider";
import { InputLabel, styled, useTheme } from "@mui/material";
import React, { useEffect } from "react";

interface FaderProps {
  id: string;
  label: string;
  value?: number;
  sliderProps: SliderProps;
}

const StyledFaderContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "120px",
  marginBottom: ".75rem",
  gap: ".75rem",
});

const StyledFader = styled(Slider)<{ $theme: any }>(({ $theme }) => ({
  color: $theme.palette.primary.main,

  "& .MuiSlider-track": {},
  "& .MuiSlider-thumb": {
    backgroundColor: $theme.palette.primary.main,
    // border: "1px solid white ",
    height: 10,
    width: 24,
    borderRadius: 0,
    "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
      boxShadow: "inherit",
    },
    "&::before": {
      display: "none",
    },
  },
  "& .MuiSlider-valueLabel": {
    background: "unset",
    backgroundColor: $theme.palette.primary.main,
    "&::before": { display: "none" },
  },
}));

const Fader: React.FC<FaderProps> = ({
  id,
  label,
  value,
  sliderProps = {
    valueLabelDisplay: "auto",
    orientation: "vertical",
  },
}) => {
  const [sliderValue, setSliderValue] = React.useState<number | number[]>(
    value || sliderProps?.defaultValue || 0
  );

  const theme = useTheme();

  useEffect(() => {
    if (value) {
      setSliderValue(value);
    }
  }, [value]);

  return (
    <StyledFaderContainer>
      <InputLabel id={`${id}-slider-label`}>{label}</InputLabel>
      <StyledFader
        $theme={theme}
        aria-labelledby={`${id}-slider-label`}
        aria-label={label}
        {...sliderProps}
        value={sliderValue}
        color="primary"
        onChange={(event, newValue) => {
          if (sliderProps.onChange) {
            sliderProps.onChange(event, newValue, 0);
          }
          setSliderValue(newValue);
        }}
      />
    </StyledFaderContainer>
  );
};

export default Fader;
