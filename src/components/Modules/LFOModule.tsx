"use client";

import React from "react";
import BaseModule from "./BaseModule";
import * as Tone from "tone";
import Fader from "../Input/Fader";
import { useSynth } from "@/contexts/SynthContext";
import PowerButton from "../PowerButton";
import Select from "../Input/Select";

type LFOModuleProps = {
  name?: string;
};

const LFO_TYPES = ["sine", "triangle", "square", "sawtooth"] as const;
const LFO_DESTINATIONS = [
  { value: "filter", label: "Filter Cutoff" },
  { value: "pitch", label: "Osc Pitch" }
] as const;

// Custom type for PolySynth with voice attack handler
type CustomPolySynth = Tone.PolySynth<Tone.MonoSynth> & {
  onVoiceAttack?: (voice: Tone.MonoSynth) => void;
};

const LFOModule: React.FC<LFOModuleProps> = ({ name = "LFO" }) => {
  const { synth, effects, power: synthPower, audioReady } = useSynth();
  const [modulePower, setModulePower] = React.useState(true);
  const [lfoType, setLfoType] = React.useState<typeof LFO_TYPES[number]>("sine");
  const [destination, setDestination] = React.useState<string>("filter");
  const [rate, setRate] = React.useState(1);
  const [amount, setAmount] = React.useState(0);
  const lfoRef = React.useRef<Tone.LFO | null>(null);

  // Debug current state
  React.useEffect(() => {
    console.log("LFO State:", {
      audioReady,
      synthPower,
      modulePower,
      type: lfoType,
      destination,
      rate,
      amount,
      lfoExists: !!lfoRef.current,
      filterExists: !!effects.filter,
      synthExists: !!synth
    });
  }, [audioReady, synthPower, modulePower, lfoType, destination, rate, amount, effects.filter, synth]);

  // Initialize LFO only once when audio is ready
  React.useEffect(() => {
    if (!synth || !effects.filter || !audioReady) {
      console.log("Cannot initialize LFO:", { 
        synthExists: !!synth, 
        filterExists: !!effects.filter, 
        audioReady 
      });
      return;
    }

    // Create LFO only if it doesn't exist
    if (!lfoRef.current) {
      console.log("Creating new LFO");
      const lfo = new Tone.LFO({
        type: lfoType,
        frequency: rate,
      });
      lfoRef.current = lfo;
      
      // Debug LFO properties before starting
      console.log("LFO properties before start:", {
        type: lfo.type,
        frequency: lfo.frequency.value,
        state: lfo.state,
      });
      
      lfo.start();
      console.log("LFO started, state:", lfo.state);
    }

    // Clean up only when component unmounts
    return () => {
      if (lfoRef.current) {
        console.log("Cleaning up LFO, final state:", lfoRef.current.state);
        lfoRef.current.stop();
        lfoRef.current.disconnect();
        lfoRef.current.dispose();
        lfoRef.current = null;
        console.log("Final cleanup of LFO");
      }
    };
  }, [synth, effects.filter, audioReady]);

  // Handle parameter updates and connections
  React.useEffect(() => {
    if (!lfoRef.current || !synth || !effects.filter || !audioReady) {
      console.log("Cannot update LFO parameters:", {
        lfoExists: !!lfoRef.current,
        synthExists: !!synth,
        filterExists: !!effects.filter,
        audioReady
      });
      return;
    }

    const lfo = lfoRef.current;
    
    // Update parameters
    lfo.type = lfoType;
    lfo.frequency.value = rate;

    // Debug LFO state before connection
    console.log("LFO state before connection:", {
      type: lfo.type,
      frequency: lfo.frequency.value,
      state: lfo.state
    });

    // Always disconnect before reconnecting
    lfo.disconnect();
    console.log("LFO disconnected from previous destinations");

    // Configure based on destination and power state
    if (modulePower && synthPower) {
      if (destination === "filter") {
        // Always disconnect first
        lfo.disconnect();

        // If amount is 0 or power is off, don't connect
        if (amount === 0 || !modulePower || !synthPower) {
          console.log("LFO disconnected (amount = 0 or power off)");
          return;
        }

        // Get the current filter frequency
        const baseFreq = Number(effects.filter.frequency.value) || 2000;
        
        // Scale amount exponentially but less extreme
        const scaledAmount = Math.pow(2, amount * 4) - 1; // Reduced from 8 to 4 for more musical range
        
        // Calculate modulation range in octaves
        const modAmount = baseFreq * scaledAmount;
        
        // Set LFO to modulate around the base frequency
        lfo.min = Math.max(20, baseFreq - modAmount); // Clamp to minimum 20Hz
        lfo.max = Math.min(20000, baseFreq + modAmount); // Clamp to maximum 20kHz
        
        // Connect to filter frequency
        lfo.connect(effects.filter.frequency);
        
        console.log(`LFO connected to filter:`, {
          baseFreq: baseFreq.toFixed(1),
          modAmount: modAmount.toFixed(1),
          range: `${lfo.min.toFixed(1)}Hz to ${lfo.max.toFixed(1)}Hz`
        });
      } else if (destination === "pitch") {
        // Always disconnect first
        lfo.disconnect();

        // If amount is 0 or power is off, don't connect
        if (amount === 0 || !modulePower || !synthPower || !synth) {
          console.log("LFO disconnected from pitch (amount = 0 or power off)");
          return;
        }

        // Scale amount to semitones (1200 cents = 1 octave)
        const scaledAmount = amount * 1200; // Full amount = 1 octave

        // Set LFO to output bipolar values in cents
        lfo.min = -scaledAmount;
        lfo.max = scaledAmount;

        // Connect to the frequency of each oscillator in the synth
        if (synth instanceof Tone.PolySynth) {
          // Get all current voices
          const voices = (synth as any)._voices || [];
          
          // Connect to each voice's oscillator detune
          voices.forEach((voice: any) => {
            if (voice?.oscillator?.detune) {
              lfo.connect(voice.oscillator.detune);
              console.log("Connected LFO to voice detune:", {
                voiceId: voice.id,
                detuneValue: voice.oscillator.detune.value
              });
            }
          });

          // Set up a voice attack handler to connect new voices as they're created
          (synth as CustomPolySynth).onVoiceAttack = (voice: Tone.MonoSynth) => {
            if (voice?.oscillator?.detune) {
              lfo.connect(voice.oscillator.detune);
              console.log("Connected LFO to new voice detune");
            }
          };
        }
      }
    } else {
      console.log("LFO not connected:", { modulePower, synthPower });
    }
  }, [synth, effects.filter, modulePower, synthPower, lfoType, rate, destination, amount, audioReady]);

  // Listen for filter frequency changes
  React.useEffect(() => {
    const handleFrequencyChange = (event: CustomEvent<{ frequency: number }>) => {
      if (destination === "filter" && modulePower && synthPower && amount > 0) {
        const baseFreq = Number(event.detail.frequency);
        const scaledAmount = Math.pow(2, amount * 4) - 1;
        const modAmount = baseFreq * scaledAmount;
        
        lfoRef.current!.min = Math.max(20, baseFreq - modAmount);
        lfoRef.current!.max = Math.min(20000, baseFreq + modAmount);
        
        console.log(`LFO range updated for new frequency:`, {
          baseFreq: baseFreq.toFixed(1),
          range: `${lfoRef.current!.min.toFixed(1)}Hz to ${lfoRef.current!.max.toFixed(1)}Hz`
        });
      }
    };

    window.addEventListener('filterFrequencyChange', handleFrequencyChange as EventListener);
    return () => {
      window.removeEventListener('filterFrequencyChange', handleFrequencyChange as EventListener);
    };
  }, [destination, modulePower, synthPower, amount, lfoRef]);

  const handleFrequencyChange = (value: number) => {
    setRate(value);
  };

  const handleAmplitudeChange = (value: number) => {
    setAmount(value);
  };

  return (
    <BaseModule
      name={name}
      headerContent={
        <PowerButton
          isOn={modulePower}
          onClick={(checked) => setModulePower(checked)}
          variant="module"
        />
      }
      power={modulePower}
    >
      <form>
        <div className="control-group" style={{ flexDirection: "column", gap: "0.5rem" }}>
          <Select
            label="Type"
            value={lfoType}
            onChange={(e) => setLfoType(e.target.value as typeof LFO_TYPES[number])}
            options={LFO_TYPES.map((type) => ({
              value: type,
              label: type.charAt(0).toUpperCase() + type.slice(1),
            }))}
          />
          <Select
            label="Destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value as string)}
            options={LFO_DESTINATIONS}
          />
        </div>
        <div className="control-group">
          <Fader
            id="frequency"
            label="Rate"
            value={rate}
            sliderProps={{
              min: 0.1,
              max: 20,
              step: 0.1,
              orientation: "vertical",
              valueLabelDisplay: "auto",
              valueLabelFormat: (value) => `${value.toFixed(1)} Hz`,
              onChange: (_, value) => handleFrequencyChange(value as number),
            }}
          />
          <Fader
            id="amount"
            label="Amount"
            value={amount}
            sliderProps={{
              min: 0,
              max: 1,
              step: 0.01,
              orientation: "vertical",
              valueLabelDisplay: "auto",
              valueLabelFormat: (value) => `${Math.round((value as number) * 100)}%`,
              onChange: (_, value) => handleAmplitudeChange(value as number),
            }}
          />
        </div>
      </form>
    </BaseModule>
  );
};

export default LFOModule;
