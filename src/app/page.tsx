"use client";

import { createTheme, ThemeProvider } from "@mui/material/styles";

import dynamic from "next/dynamic";
import React from "react";
import styled from "styled-components";

const Synthesizer = dynamic(() => import("../components/Synth"), {
  ssr: false,
});

const StyledSynthPage = styled.div<{ $isOn?: boolean }>`
  background-color: #111;
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
`;

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

const SynthesizerPage: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <StyledSynthPage>
        <Synthesizer />
      </StyledSynthPage>
    </ThemeProvider>
  );
};

export default SynthesizerPage;
