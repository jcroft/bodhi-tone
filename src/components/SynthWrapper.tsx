/**
 * SynthWrapper.tsx
 * A wrapper component that provides the synthesizer context to the main Synthesizer component.
 * This separation ensures that the audio context and state management is properly initialized
 * before the synthesizer UI is rendered.
 */

"use client";

import { SynthProvider } from "@/contexts/SynthContext";
import React from "react";
import Synthesizer from "./Synth";

/**
 * SynthWrapper Component
 * Wraps the main Synthesizer component with the SynthProvider context.
 * This pattern follows the React Context API best practices, keeping
 * context initialization separate from the components that consume it.
 */
const SynthWrapper: React.FC = () => {
  return (
    <SynthProvider>
      <Synthesizer />
    </SynthProvider>
  );
};

export default SynthWrapper;
