"use client";

import { SynthProvider, useSynth } from "@/contexts/SynthContext";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";

import dynamic from "next/dynamic";
import React from "react";

const Synthesizer = dynamic(() => import("../components/Synth"), {
  ssr: false,
});

let theme = createTheme({
  palette: {
    mode: "dark",
  },
});

theme = createTheme(theme, {
  palette: {
    primary: theme.palette.augmentColor({
      color: {
        main: "#ff5500",
      },
      name: "orange",
    }),
  },
});

const StyledSynthPage = styled("div")`
  background-color: #111;
  display: flex;
  justify-content: center;
  height: 100%;
  width: 100%;
`;

const SynthesizerPage: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <SynthProvider>
        <StyledSynthPage>
          <Synthesizer />
        </StyledSynthPage>
      </SynthProvider>
    </ThemeProvider>
  );
};

export default SynthesizerPage;
