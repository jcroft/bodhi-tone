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
  marginBottom: $orientation === "vertical" ? ".75rem" : "0",
  gap: $orientation === "vertical" ? ".75rem" : ".25rem",

  "& .MuiSlider-root": {
    width: $orientation === "horizontal" ? "70px" : undefined,
  },
}));

const StyledInputLabel = styled(InputLabel)({
  fontSize: "0.75rem",
  color: "#fff",
  padding: 0,
  margin: "0 !important",
});

// const StyledFader = styled(Slider)<{ $theme: any }>(({ $theme }) => ({
//   color: $theme.palette.primary.main,
//   padding: "0 10px",

//   "& .MuiSlider-track": {},
//   "& .MuiSlider-thumb": {
//     backgroundColor: $theme.palette.primary.main,
//     // border: "1px solid white ",
//     height: 10,
//     width: 24,
//     borderRadius: 0,
//     "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
//       boxShadow: "inherit",
//     },
//     "&::before": {
//       display: "none",
//     },
//   },
//   "& .MuiSlider-valueLabel": {
//     background: "unset",
//     backgroundColor: $theme.palette.primary.main,
//     "&::before": { display: "none" },
//   },
// }));

const StyledFader = styled(Slider, {
  shouldForwardProp: (prop) => prop !== "$theme",
})<{ $theme: any }>`
  color: $theme.palette.primary.main;
  padding: 0 10px;

  & .MuiSlider-track {
  }

  & .MuiSlider-thumb {
    background-color: $theme.palette.primary.main;
    height: 10px;
    width: 10px;
    border: 1px solid rgba(255, 255, 255, 0.5);
    // border-radius: 0;
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
    background: unset;
    background-color: $theme.palette.primary.main;
    &::before {
      display: none;
    }
  }

  & .MuiSlider-rail {
    background-color: $theme.palette.primary.main;
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
