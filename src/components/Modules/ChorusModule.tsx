"use client";

import React from "react";
import BaseModule from "./BaseModule";
import { useSynth } from "@/contexts/SynthContext";
import EffectFader from "./EffectFader";
import { useEffectModule } from "@/hooks/useEffectModule";
import PowerButton from "../PowerButton"; // Fixed import path

interface ChorusModuleProps {
  name?: string;
}

const CHORUS_FADER_CONFIGS = [
  { id: "wet", label: "Wet" },
  { id: "feedback", label: "Fdbk" },
  { id: "delayTime", label: "Time", min: 2, max: 20 },
  { id: "frequency", label: "Freq", min: 0, max: 20000 },
  { id: "depth", label: "Depth" },
  { id: "spread", label: "Spread", min: 0, max: 180 },
] as const;

const ChorusModule: React.FC<ChorusModuleProps> = ({ name = "Chorus" }) => {
  const { effects } = useSynth();
  const { createFaders } = useEffectModule(effects.chorus, name);
  const [isPowered, setIsPowered] = React.useState(true);
  const [previousWet, setPreviousWet] = React.useState(0.5);

  const [wetFader, ...settingsFaders] = React.useMemo(
    () => createFaders(CHORUS_FADER_CONFIGS),
    [createFaders]
  );

  React.useEffect(() => {
    if (!isPowered) {
      setPreviousWet(effects.chorus.wet.value);
      effects.chorus.wet.value = 0;
    } else {
      effects.chorus.wet.value = previousWet;
    }
  }, [isPowered, effects.chorus.wet, previousWet]);

  return (
    <BaseModule 
      name={name}
      headerContent={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <PowerButton 
            isOn={isPowered} 
            onClick={() => setIsPowered(!isPowered)}
            style={{ padding: 0, minWidth: '24px', width: '24px', height: '24px' }}
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

export default ChorusModule;
