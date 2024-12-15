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
  masterBus: Partial<{
    compressor: Partial<Tone.CompressorOptions>;
    limiter: Partial<Tone.LimiterOptions>;
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
  masterBus: {
    compressor: {
      threshold: -24,
      ratio: 4,
      attack: 0.003,
      release: 0.25,
      knee: 30,
    },
    limiter: {
      threshold: -1.0,
    },
  },
};

const synth = new Tone.PolySynth<Tone.MonoSynth>(DEFAULT_SYNTH_OPTIONS);

// Initialize effects with default settings
const chorus = new Tone.Chorus({
  frequency: 4,
  delayTime: 2.5,
  depth: 0.5,
  wet: 0.5
}).start(); // Start the chorus modulation

const delay = new Tone.PingPongDelay({
  delayTime: "4n",
  feedback: 0.1,
  wet: 0.5
});

const reverb = new Tone.Reverb({
  decay: 0.5,
  wet: 0.5,
  preDelay: 0.1
});

const compressor = new Tone.Compressor({
  threshold: -24,
  ratio: 4,
  attack: 0.003,
  release: 0.25,
  knee: 30
});

const limiter = new Tone.Limiter({
  threshold: -1.0
});

// Create the processing chain
synth.connect(chorus);
chorus.connect(delay);
delay.connect(reverb);
reverb.connect(compressor);
compressor.connect(limiter);
limiter.toDestination();

export type SynthContextType = {
  power: boolean;
  setPower: React.Dispatch<React.SetStateAction<boolean>>;
  synth: Tone.PolySynth<Tone.MonoSynth>;
  synthOptions: Partial<Tone.MonoSynthOptions>;
  effects: {
    chorus: Tone.Chorus;
    delay: Tone.PingPongDelay;
    reverb: Tone.Reverb;
    masterBus: {
      compressor: Tone.Compressor;
      limiter: Tone.Limiter;
    };
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
    masterBus: {
      compressor,
      limiter,
    },
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

  const [effects, setEffects] = React.useState<SynthContextType["effects"]>({
    chorus,
    delay,
    reverb,
    masterBus: {
      compressor,
      limiter,
    },
  });

  // Handle power state
  useEffect(() => {
    if (power) {
      // Start audio context when powered on
      Tone.start();
      synth.volume.value = -18;
    } else {
      // Mute when powered off
      synth.volume.value = -Infinity;
    }
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
