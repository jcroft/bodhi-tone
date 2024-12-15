"use client";

import React from "react";
import BaseModule from "./BaseModule";
import { useSynth } from "@/contexts/SynthContext";
import EffectFader from "./EffectFader";
import { useEffectModule } from "@/hooks/useEffectModule";

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

  const [wetFader, ...settingsFaders] = React.useMemo(
    () => createFaders(REVERB_FADER_CONFIGS),
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

export default ReverbModule;
