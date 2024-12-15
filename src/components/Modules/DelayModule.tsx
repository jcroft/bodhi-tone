"use client";

import React from "react";
import BaseModule from "./BaseModule";
import { useSynth } from "@/contexts/SynthContext";
import EffectFader from "./EffectFader";
import { useEffectModule } from "@/hooks/useEffectModule";
import PowerButton from "../PowerButton"; // Fixed import path

interface DelayModuleProps {
  name?: string;
}

const DELAY_FADER_CONFIGS = [
  { id: "wet", label: "Wet" },
  { id: "feedback", label: "Fdbk" },
  { id: "delayTime", label: "Time" },
] as const;

const DelayModule: React.FC<DelayModuleProps> = ({ name = "Delay" }) => {
  const { effects } = useSynth();
  const { createFaders } = useEffectModule(effects.delay, name);
  const [isPowered, setIsPowered] = React.useState(true);
  const [previousWet, setPreviousWet] = React.useState(0.5);

  const [wetFader, ...settingsFaders] = React.useMemo(
    () => createFaders(DELAY_FADER_CONFIGS),
    [createFaders]
  );

  React.useEffect(() => {
    if (!isPowered) {
      setPreviousWet(effects.delay.wet.value);
      effects.delay.wet.value = 0;
    } else {
      effects.delay.wet.value = previousWet;
    }
  }, [isPowered, effects.delay.wet, previousWet]);

  return (
    <BaseModule 
      name={name}
      headerContent={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <PowerButton 
            isOn={isPowered} 
            onClick={() => setIsPowered(!isPowered)}
            variant="module"
          />
        </div>
      }
      power={isPowered}
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

export default DelayModule;
