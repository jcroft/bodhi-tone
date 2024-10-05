"use client";

import dynamic from "next/dynamic";
import React from "react";
import styled from "styled-components";

const Synthesizer = dynamic(() => import("../components/Synth"), {
  ssr: false,
});

const StyledSynthPage = styled.div<{ $isOn?: boolean }>`
  padding: 1rem;
`;

const SynthesizerPage: React.FC = () => {
  return (
    <StyledSynthPage>
      <Synthesizer />
    </StyledSynthPage>
  );
};

export default SynthesizerPage;
