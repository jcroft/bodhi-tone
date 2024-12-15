"use client";

import React from "react";
import * as Tone from "tone";
import BaseModule from "./BaseModule";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useSynth } from "@/contexts/SynthContext";
import EffectFader from "./EffectFader";
import { useEffectModule } from "@/hooks/useEffectModule";
import PowerButton from "../PowerButton";

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
  const [isPowered, setIsPowered] = React.useState(true);
  const [previousCompressorSettings, setPreviousCompressorSettings] = React.useState({
    threshold: -12,
    ratio: 4,
    attack: 0.003,
    release: 0.25,
    knee: 30
  });
  const [previousLimiterSettings, setPreviousLimiterSettings] = React.useState({
    threshold: -6
  });

  const compressorFaders = React.useMemo(
    () => createCompressorFaders(COMPRESSOR_FADER_CONFIGS),
    [createCompressorFaders]
  );

  const limiterFaders = React.useMemo(
    () => createLimiterFaders(LIMITER_FADER_CONFIGS),
    [createLimiterFaders]
  );

  // Store current settings when power state changes
  const handlePowerChange = React.useCallback((newPowerState: boolean) => {
    if (!newPowerState) {
      // Bypass both effects by setting extreme values
      effects.masterBus.compressor.threshold.value = 0;
      effects.masterBus.compressor.ratio.value = 1;
      effects.masterBus.limiter.threshold.value = 0;
    } else {
      // Restore previous settings
      effects.masterBus.compressor.set(previousCompressorSettings);
      effects.masterBus.limiter.set(previousLimiterSettings);
    }
    setIsPowered(newPowerState);
  }, [effects.masterBus, previousCompressorSettings, previousLimiterSettings]);

  // Special handling for master volume
  const handleVolumeChange = React.useCallback((value: number) => {
    Tone.Destination.volume.rampTo(value, 0.05);
  }, []);

  const volumeFader = React.useMemo(() => ({
    ...MASTER_VOLUME_CONFIG,
    value: Tone.Destination.volume.value,
    onChange: handleVolumeChange
  }), [handleVolumeChange]);

  React.useEffect(() => {
    if (!isPowered) {
      // Store current settings
      setPreviousCompressorSettings({
        threshold: effects.masterBus.compressor.threshold.value,
        ratio: effects.masterBus.compressor.ratio.value,
        attack: effects.masterBus.compressor.attack.value,
        release: effects.masterBus.compressor.release.value,
        knee: effects.masterBus.compressor.knee.value
      });
      setPreviousLimiterSettings({
        threshold: effects.masterBus.limiter.threshold.value
      });
    }
  }, [isPowered, effects.masterBus]);

  return (
    <BaseModule 
      name={name}
      headerContent={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <PowerButton 
            isOn={isPowered} 
            onClick={handlePowerChange}
            variant="module"
          />
        </div>
      }
      power={isPowered}
    >
      <form>

        <StyledControlGroup className="transparent">
          <div className="control-group">
          <h3>Compressor</h3>
            {compressorFaders.map(fader => (
              <EffectFader key={fader.id} {...fader} />
            ))}
          </div>
        </StyledControlGroup>

        <StyledControlGroup className="transparent">
        <div className="control-group">
          <h3>Limiter</h3>
            {limiterFaders.map(fader => (
              <EffectFader key={fader.id} {...fader} />
            ))}
          </div>
        </StyledControlGroup>
        <StyledControlGroup className="transparent">

<EffectFader {...volumeFader} />

</StyledControlGroup>
      </form>
    </BaseModule>
  );
};

export default MasterBusModule;
