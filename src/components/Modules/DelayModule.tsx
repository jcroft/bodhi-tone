"use client";

import React from "react";
import BaseModule from "./BaseModule";
import { useSynth } from "@/contexts/SynthContext";
import EffectFader from "./EffectFader";
import { useEffectModule } from "@/hooks/useEffectModule";

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

  const [wetFader, ...settingsFaders] = React.useMemo(
    () => createFaders(DELAY_FADER_CONFIGS),
    [createFaders]
  );

  return (
    <BaseModule name={name}>
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
