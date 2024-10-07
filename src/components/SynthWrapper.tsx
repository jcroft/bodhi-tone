"use client";

import { SynthProvider } from "@/contexts/SynthContext";
import React from "react";
import Synthesizer from "./Synth";

const SynthWrapper: React.FC = () => {
  return (
    <SynthProvider>
      <Synthesizer />
    </SynthProvider>
  );
};

export default SynthWrapper;
