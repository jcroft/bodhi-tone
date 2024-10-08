"use client";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import dynamic from "next/dynamic";
import React from "react";

const SynthWrapper = dynamic(() => import("../components/SynthWrapper"), {
  ssr: false,
});

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#ff5500",
    },
  },
});

const StyledSynthPage = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  display: "flex",
  justifyContent: "center",
  height: "100%",
  width: "100%",
}));

const SynthesizerPage: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <StyledSynthPage>
        <SynthWrapper />
      </StyledSynthPage>
    </ThemeProvider>
  );
};

export default SynthesizerPage;
