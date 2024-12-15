"use client";

import React, { use, useContext, useEffect, useMemo } from "react";
import * as Tone from "tone";

// Create a class to handle note tracking at the audio engine level
class NoteTracker {
  private activeNotes: Map<Tone.Unit.Frequency, { timestamp: number; velocity?: number }>;
  private subscribers: Set<(notes: Tone.Unit.Frequency[]) => void>;
  private maxVoices: number;

  constructor(maxVoices: number = 16) {
    this.activeNotes = new Map();
    this.subscribers = new Set();
    this.maxVoices = maxVoices;
  }

  subscribe(callback: (notes: Tone.Unit.Frequency[]) => void) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  getActiveNotes() {
    return Array.from(this.activeNotes.keys());
  }

  private notify() {
    const notes = this.getActiveNotes();
    this.subscribers.forEach(callback => callback(notes));
  }

  private stealVoice(): Tone.Unit.Frequency | null {
    if (this.activeNotes.size < this.maxVoices) return null;

    // Find the oldest note
    let oldestNote: Tone.Unit.Frequency | null = null;
    let oldestTime = Infinity;

    this.activeNotes.forEach((data, note) => {
      if (data.timestamp < oldestTime) {
        oldestTime = data.timestamp;
        oldestNote = note;
      }
    });

    return oldestNote;
  }

  addNote(note: Tone.Unit.Frequency, velocity?: number) {
    // If we're at max voices, steal one
    if (this.activeNotes.size >= this.maxVoices) {
      const noteToSteal = this.stealVoice();
      if (noteToSteal) {
        this.removeNote(noteToSteal);
      }
    }

    this.activeNotes.set(note, { 
      timestamp: performance.now(),
      velocity 
    });
    this.notify();
  }

  addNotes(notes: Tone.Unit.Frequency[], velocity?: number) {
    notes.forEach(note => this.addNote(note, velocity));
  }

  removeNote(note: Tone.Unit.Frequency) {
    this.activeNotes.delete(note);
    this.notify();
  }

  removeNotes(notes: Tone.Unit.Frequency[]) {
    notes.forEach(note => this.removeNote(note));
  }

  clear() {
    this.activeNotes.clear();
    this.notify();
  }
}

export const DEFAULT_SYNTH_OPTIONS: Partial<
  Tone.PolySynthOptions<Tone.MonoSynth>
> = {
  maxPolyphony: 16,
  voice: Tone.MonoSynth,
  volume: 0,
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
const filter = new Tone.Filter({
  type: "lowpass",
  frequency: 2000,
  rolloff: -12,
  Q: 1,
});

const chorus = new Tone.Chorus({
  frequency: DEFAULT_EFFECTS_OPTIONS.chorus?.frequency ?? 0.5,
  delayTime: DEFAULT_EFFECTS_OPTIONS.chorus?.delayTime ?? 2.5,
  depth: DEFAULT_EFFECTS_OPTIONS.chorus?.depth ?? 0.5,
  wet: DEFAULT_EFFECTS_OPTIONS.chorus?.wet ?? 0.5,
  feedback: DEFAULT_EFFECTS_OPTIONS.chorus?.feedback ?? 0.5,
  spread: DEFAULT_EFFECTS_OPTIONS.chorus?.spread ?? 90
});

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
synth.disconnect(); // Disconnect any existing connections
synth.connect(filter);
filter.connect(chorus);
chorus.connect(delay);
delay.connect(reverb);
reverb.connect(compressor);
compressor.connect(limiter);
limiter.toDestination();

// Function to start all effects
const startEffects = () => {
  chorus.start();
};

const noteTracker = new NoteTracker(DEFAULT_SYNTH_OPTIONS.maxPolyphony);

export type SynthContextType = {
  power: boolean;
  setPower: React.Dispatch<React.SetStateAction<boolean>>;
  synth: Tone.PolySynth<Tone.MonoSynth>;
  synthOptions: Partial<Tone.MonoSynthOptions>;
  effects: {
    filter: Tone.Filter;
    chorus: Tone.Chorus;
    delay: Tone.PingPongDelay;
    reverb: Tone.Reverb;
    masterBus: {
      compressor: Tone.Compressor;
      limiter: Tone.Limiter;
    };
  };
  startEffects: () => void;
  noteTracker: NoteTracker;
  audioReady: boolean;
};

export const SynthContext = React.createContext<SynthContextType | undefined>({
  power: false,
  setPower: () => {},
  synth,
  synthOptions: DEFAULT_SYNTH_OPTIONS,
  effects: {
    filter,
    chorus,
    delay,
    reverb,
    masterBus: {
      compressor,
      limiter,
    },
  },
  startEffects,
  noteTracker,
  audioReady: false,
});

export const SynthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [power, setPower] = React.useState(false);
  const [audioReady, setAudioReady] = React.useState(false);
  const audioInitialized = React.useRef(false);

  // Start effects when power is turned on
  React.useEffect(() => {
    const initAudio = async () => {
      if (power) {
        try {
          // Start audio context
          await Tone.start();
          
          // Only reset and reconnect if not initialized
          if (!audioInitialized.current) {
            console.log("Initializing audio chain...");
            
            // Reset and reconnect the audio chain
            synth.disconnect();
            filter.disconnect();
            chorus.disconnect();
            delay.disconnect();
            reverb.disconnect();
            compressor.disconnect();
            limiter.disconnect();

            // Reconnect everything
            synth.connect(filter);
            filter.connect(chorus);
            chorus.connect(delay);
            delay.connect(reverb);
            reverb.connect(compressor);
            compressor.connect(limiter);
            limiter.toDestination();

            // Start effects
            startEffects();
            
            audioInitialized.current = true;
          }
          
          // Set volume to normal and mark as ready
          synth.volume.value = 0;
          setAudioReady(true);
          console.log("Audio context and effects started");
        } catch (error) {
          console.error("Failed to start audio:", error);
          setPower(false);
          setAudioReady(false);
          audioInitialized.current = false;
        }
      } else {
        // Clear all active notes when powered off
        noteTracker.clear();
        // Mute when powered off
        synth.volume.value = -Infinity;
        setAudioReady(false);
        
        // Don't reset initialization - we want to keep the audio chain intact
        console.log("Audio powered off");
      }
    };

    // Check audio context state
    console.log("Audio context state:", Tone.context.state);
    console.log("Power state:", power);
    
    initAudio();
  }, [power]);

  const value = React.useMemo(() => ({
    power,
    setPower,
    synth,
    synthOptions: DEFAULT_SYNTH_OPTIONS,
    effects: {
      filter,
      chorus,
      delay,
      reverb,
      masterBus: {
        compressor,
        limiter,
      },
    },
    startEffects,
    noteTracker,
    audioReady,
  }), [power, audioReady]);

  return (
    <SynthContext.Provider value={value}>{children}</SynthContext.Provider>
  );
};

export const useSynth = (): SynthContextType => {
  const context = useContext(SynthContext);
  if (context === undefined) {
    throw new Error("useSynth must be used within a SynthProvider");
  }
  return context;
};
