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

const StyledFaderContainer = styled("div")<{
  $orientation: "vertical" | "horizontal" | undefined;
}>(({ $orientation }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: $orientation === "vertical" ? "120px" : "auto",
  width: $orientation === "horizontal" ? "100%" : "auto",
  marginBottom: $orientation === "vertical" ? ".75rem" : "0",
  gap: $orientation === "vertical" ? ".75rem" : "0",

  "& .MuiSlider-root": {
    width: $orientation === "horizontal" ? "96px" : undefined,
    padding: $orientation === "horizontal" ? "10px 0" : undefined,
  },
}));

const StyledInputLabel = styled(InputLabel)({
  fontSize: "0.75rem",
  color: "#fff",
  padding: 0,
  margin: "0 !important",
});

const StyledFader = styled(Slider)`
  padding: 0 10px;

  & .MuiSlider-track {
  }

  & .MuiSlider-thumb {
    height: 16px;
    width: 16px;
    &:focus,
    &:hover,
    &.Mui-active,
    &.Mui-focusVisible {
      box-shadow: inherit;
    }
    &::before {
      display: none;
    }
  }

  & .MuiSlider-valueLabel {
    left: -4.75rem;
    top: 3px;
    padding-left: 2rem;
    padding-right: 2rem;
  }

  & .MuiSlider-rail {
  }
`;

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
    <StyledFaderContainer $orientation={sliderProps.orientation}>
      <StyledInputLabel id={`${id}-slider-label`}>{label}</StyledInputLabel>
      <StyledFader
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
        sx={{
          color: theme.palette.primary.main,
          "& .MuiSlider-track": {},
          "& .MuiSlider-thumb": {
            backgroundColor: theme.palette.primary.main,
            border: `1.5px solid white`,
          },
          "& .MuiSlider-rail": {
            backgroundColor: theme.palette.primary.main,
          },
        }}
      />
    </StyledFaderContainer>
  );
};

export default Fader;
