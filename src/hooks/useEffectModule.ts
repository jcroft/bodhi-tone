import { useCallback } from "react";
import * as Tone from "tone";

type EffectType = Tone.Chorus | Tone.PingPongDelay | Tone.Reverb | Tone.Compressor | Tone.Limiter;

interface FaderConfig {
  id: string;
  label: string;
  min?: number;
  max?: number;
  step?: number;
}

interface EffectFader extends FaderConfig {
  value: number;
  onChange: (value: number) => void;
}

export function useEffectModule(effect: EffectType, effectName: string) {
  const getParameterValue = useCallback((param: any, id: string) => {
    if (id === "wet" && "wet" in effect) {
      return parseFloat((effect.wet as Tone.Param<"normalRange">).value.toString());
    }
    return parseFloat(param.toString());
  }, [effect]);

  const handleParameterChange = useCallback((id: string, value: number) => {
    if (id === "wet" && "wet" in effect) {
      (effect.wet as Tone.Param<"normalRange">).value = value;
    } else {
      effect.set({
        [id]: value,
      });
    }
  }, [effect]);

  const createFader = useCallback(({ id, label, min = 0, max = 1, step = 0.01 }: FaderConfig): EffectFader => {
    const param = id === "wet" ? (effect as any).wet : (effect as any)[id];
    
    return {
      id: `${effectName.toLowerCase()}-${id}`,
      label,
      min,
      max,
      step,
      value: getParameterValue(param, id),
      onChange: (value: number) => handleParameterChange(id, value)
    };
  }, [effect, effectName, getParameterValue, handleParameterChange]);

  const createFaders = useCallback((configs: FaderConfig[]): EffectFader[] => {
    return configs.map(config => createFader(config));
  }, [createFader]);

  return {
    createFader,
    createFaders
  };
}
