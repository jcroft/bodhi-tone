"use client";

import React from "react";
import BaseModule from "./BaseModule";
import { useSynth } from "@/contexts/SynthContext";
import EffectFader from "./EffectFader";
import { useEffectModule } from "@/hooks/useEffectModule";
import PowerButton from "../PowerButton"; // Fixed import path

interface ReverbModuleProps {
  name?: string;
}

const REVERB_FADER_CONFIGS = [
  { id: "wet", label: "Wet" },
  { id: "decay", label: "Decay", min: 0.1, max: 200, step: 0.1 },
  { id: "preDelay", label: "Pre", min: 0, max: 2, step: 0.01 },
] as const;

const ReverbModule: React.FC<ReverbModuleProps> = ({ name = "Reverb" }) => {
  const { effects } = useSynth();
  const { createFaders } = useEffectModule(effects.reverb, name);
  const [isPowered, setIsPowered] = React.useState(true);
  const [previousWet, setPreviousWet] = React.useState(0.5);

  const [wetFader, ...settingsFaders] = React.useMemo(
    () => createFaders(REVERB_FADER_CONFIGS),
    [createFaders]
  );

  React.useEffect(() => {
    if (!isPowered) {
      setPreviousWet(effects.reverb.wet.value);
      effects.reverb.wet.value = 0;
    } else {
      effects.reverb.wet.value = previousWet;
    }
  }, [isPowered, effects.reverb.wet, previousWet]);

  return (
    <BaseModule 
      name={name}
      headerContent={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <PowerButton 
            isOn={isPowered} 
            onClick={() => setIsPowered(!isPowered)}
          />
        </div>
      }
    >
      <form>
        <div className="control-group transparent">
          <EffectFader {...wetFader} />
        </div>
        <div className="control-group">
          {settingsFaders.map(fader => (
            <EffectFader key={fader.id} {...fader} />
          ))}
        </div>
      </form>
    </BaseModule>
  );
};

export default ReverbModule;
