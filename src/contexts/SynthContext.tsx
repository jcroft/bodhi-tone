"use client";

import React, { use, useContext, useEffect } from "react";
import * as Tone from "tone";

export const DEFAULT_SYNTH_OPTIONS: Partial<
  Tone.PolySynthOptions<Tone.MonoSynth>
> = {
  maxPolyphony: 16,
  voice: Tone.MonoSynth,
  volume: -18,
  options: {
    portamento: 0,
    oscillator: {
      type: "fatsawtooth",
      count: 3,
    },
    envelope: {
      attack: 0.01,
      decay: 0.1,
      sustain: 0.5,
      release: 0.5,
    },
    filter: {
      Q: 1,
      type: "lowpass",
      rolloff: -12,
    },
    filterEnvelope: {
      attack: 0.01,
      decay: 0.1,
      sustain: 0.5,
      release: 0.5,
      baseFrequency: 200,
      octaves: 7,
      exponent: 2,
    },
  } as Tone.MonoSynthOptions,
};

export const DEFAULT_EFFECTS_OPTIONS: Partial<{
  chorus: Partial<Tone.ChorusOptions>;
  delay: Partial<Tone.PingPongDelayOptions>;
  reverb: Partial<{
    wet: number;
    decay: number;
    preDelay: number;
  }>;
}> = {
  chorus: {
    frequency: 0.5,
    depth: 0.5,
  },
  delay: {
    delayTime: 0.25,
    feedback: 0.5,
    wet: 0.5,
  },
  reverb: {
    wet: 0.5,
    decay: 35,
    preDelay: 0.1,
  },
};

const synth = new Tone.PolySynth<Tone.MonoSynth>(DEFAULT_SYNTH_OPTIONS);

const chorus = new Tone.Chorus(4, 2.5, 0.5).toDestination();
const delay = new Tone.PingPongDelay("4n", 0.1).toDestination();
const reverb = new Tone.Reverb(0.5).toDestination();

export type SynthContextType = {
  power: boolean;
  setPower: React.Dispatch<React.SetStateAction<boolean>>;
  synth: Tone.PolySynth<Tone.MonoSynth>;
  synthOptions: Partial<Tone.MonoSynthOptions>;
  effects: {
    chorus: Tone.Chorus;
    delay: Tone.PingPongDelay;
    reverb: Tone.Reverb;
  };
  activeNotes: (string | number)[];
  setActiveNotes: React.Dispatch<React.SetStateAction<(string | number)[]>>;
};

export const SynthContext = React.createContext<SynthContextType | undefined>({
  power: false,
  setPower: () => {},
  synth: synth,
  synthOptions: DEFAULT_SYNTH_OPTIONS,
  effects: {
    chorus,
    delay,
    reverb,
  },
  activeNotes: [],
  setActiveNotes: () => {},
});

export const SynthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [synthOptions, setSynthOptions] = React.useState(DEFAULT_SYNTH_OPTIONS);
  const [activeNotes, setActiveNotes] = React.useState<(string | number)[]>([]);
  const [power, setPower] = React.useState(false);

  const effects = {
    chorus,
    delay,
    reverb,
  };

  // When the power is off, mute the volume
  useEffect(() => {
    synth.volume.value = power ? -18 : -Infinity;
  }, [power]);

  return (
    <SynthContext.Provider
      value={{
        power,
        setPower,
        synth,
        synthOptions,
        effects,
        activeNotes,
        setActiveNotes,
      }}
    >
      {children}
    </SynthContext.Provider>
  );
};

export const useSynth = (): SynthContextType => {
  const context = useContext(SynthContext);
  if (context === undefined) {
    throw new Error("useSynth must be used within a SynthProvider");
  }
  return context;
};
