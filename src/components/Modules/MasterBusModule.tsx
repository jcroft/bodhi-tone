"use client";

import React from "react";
import * as Tone from "tone";
import BaseModule from "./BaseModule";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useSynth } from "@/contexts/SynthContext";
import EffectFader from "./EffectFader";
import { useEffectModule } from "@/hooks/useEffectModule";

const StyledControlGroup = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  gap: theme.spacing(1),
  padding: theme.spacing(1),
  "& .MuiSlider-root": {
    color: theme.palette.primary.main,
  },
}));

interface MasterBusModuleProps {
  name?: string;
}

const COMPRESSOR_FADER_CONFIGS = [
  { id: "threshold", label: "Thresh", min: -60, max: 0, step: 0.5 },
  { id: "ratio", label: "Ratio", min: 1, max: 20, step: 0.5 },
  { id: "attack", label: "Atk", min: 0.001, max: 1, step: 0.001 },
  { id: "release", label: "Rel", min: 0.01, max: 1, step: 0.01 },
  { id: "knee", label: "Knee", min: 0, max: 40, step: 1 },
] as const;

const LIMITER_FADER_CONFIGS = [
  { id: "threshold", label: "Thresh", min: -60, max: 0, step: 0.5 },
] as const;

const MASTER_VOLUME_CONFIG = { 
  id: "volume", 
  label: "Volume",
  min: -60,
  max: 6,
  step: 0.1
} as const;

const MasterBusModule: React.FC<MasterBusModuleProps> = ({ name = "Master Bus" }) => {
  const { effects } = useSynth();
  const { createFaders: createCompressorFaders } = useEffectModule(
    effects.masterBus.compressor,
    "compressor"
  );
  const { createFaders: createLimiterFaders } = useEffectModule(
    effects.masterBus.limiter,
    "limiter"
  );

  // Special handling for master volume
  const handleVolumeChange = React.useCallback((value: number) => {
    Tone.Destination.volume.rampTo(value, 0.05);
  }, []);

  const volumeFader = React.useMemo(() => ({
    ...MASTER_VOLUME_CONFIG,
    value: Tone.Destination.volume.value,
    onChange: handleVolumeChange
  }), [handleVolumeChange]);

  const compressorFaders = React.useMemo(
    () => createCompressorFaders(COMPRESSOR_FADER_CONFIGS),
    [createCompressorFaders]
  );

  const limiterFaders = React.useMemo(
    () => createLimiterFaders(LIMITER_FADER_CONFIGS),
    [createLimiterFaders]
  );

  return (
    <BaseModule name={name}>
      <form>
        <StyledControlGroup>
          <EffectFader {...volumeFader} />
        </StyledControlGroup>

        <StyledControlGroup>
          {compressorFaders.map(fader => (
            <EffectFader key={fader.id} {...fader} />
          ))}
        </StyledControlGroup>

        <StyledControlGroup>
          {limiterFaders.map(fader => (
            <EffectFader key={fader.id} {...fader} />
          ))}
        </StyledControlGroup>
      </form>
    </BaseModule>
  );
};

export default MasterBusModule;
