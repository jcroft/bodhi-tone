/**
 * LFOModule.tsx
 * Low Frequency Oscillator (LFO) module for modulating various synth parameters.
 * Provides modulation for filter cutoff and oscillator pitch with adjustable
 * waveform, rate, and amount controls.
 */

"use client";

import React from "react";
import BaseModule from "./BaseModule";
import * as Tone from "tone";
import Fader from "../Input/Fader";
import { useSynth } from "@/contexts/SynthContext";
import PowerButton from "../PowerButton";
import Select from "../Input/Select";

/**
 * Module Props Interface
 * @property {string} name - Display name of the module
 */
type LFOModuleProps = {
  name?: string;
};

/**
 * Available LFO waveform types
 * Each type provides a different modulation character
 */
const LFO_TYPES = ["sine", "triangle", "square", "sawtooth"] as const;

/**
 * Available modulation destinations
 * Defines where the LFO can send its modulation signal
 */
const LFO_DESTINATIONS = [
  { value: "filter", label: "Filter Cutoff" },
  { value: "pitch", label: "Osc Pitch" }
] as const;

/**
 * Extended PolySynth type with voice attack handler
 * Used for connecting LFO to new voices as they're created
 */
type CustomPolySynth = Tone.PolySynth<Tone.MonoSynth> & {
  onVoiceAttack?: (voice: Tone.MonoSynth) => void;
};

/**
 * LFOModule Component
 * Provides modulation capabilities to the synthesizer.
 * Features:
 * - Multiple waveform types (sine, triangle, square, sawtooth)
 * - Adjustable rate and amount
 * - Multiple modulation destinations (filter cutoff, oscillator pitch)
 * - Power control for enabling/disabling modulation
 */
const LFOModule: React.FC<LFOModuleProps> = ({ name = "LFO" }) => {
  const { synth, effects, power: synthPower, audioReady } = useSynth();
  const [modulePower, setModulePower] = React.useState(true);
  const [lfoType, setLfoType] = React.useState<typeof LFO_TYPES[number]>("sine");
  const [destination, setDestination] = React.useState<string>("filter");
  const [rate, setRate] = React.useState(1);
  const [amount, setAmount] = React.useState(0);
  const lfoRef = React.useRef<Tone.LFO | null>(null);

  /**
   * Debug logging for current state
   * Helps track initialization and state changes
   */
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

  /**
   * LFO Initialization
   * Creates and starts the LFO when audio system is ready
   * Handles cleanup on unmount
   */
  React.useEffect(() => {
    if (!synth || !effects.filter || !audioReady) {
      console.log("Cannot initialize LFO:", { 
        synthExists: !!synth, 
        filterExists: !!effects.filter, 
        audioReady 
      });
      return;
    }

    // Create LFO if it doesn't exist
    if (!lfoRef.current) {
      console.log("Creating new LFO");
      const lfo = new Tone.LFO({
        type: lfoType,
        frequency: rate,
      });
      lfoRef.current = lfo;
      
      console.log("LFO properties before start:", {
        type: lfo.type,
        frequency: lfo.frequency.value,
        state: lfo.state,
      });
      
      lfo.start();
      console.log("LFO started, state:", lfo.state);
    }

    // Restore voice attack handler if it exists
    if (synth instanceof Tone.PolySynth && (synth as any)._lfoVoiceHandler) {
      (synth as CustomPolySynth).onVoiceAttack = (synth as any)._lfoVoiceHandler;
      console.log("Restored LFO voice attack handler");
    }

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
  }, [synth, effects.filter, audioReady, lfoType, rate]);

  /**
   * Parameter Update Handler
   * Manages LFO connections and parameter updates based on:
   * - Selected destination (filter or pitch)
   * - Power state (module and synth)
   * - Modulation amount
   */
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
    
    // Update basic parameters
    lfo.type = lfoType;
    lfo.frequency.value = rate;

    console.log("LFO state before connection:", {
      type: lfo.type,
      frequency: lfo.frequency.value,
      state: lfo.state
    });

    // Reset connections
    lfo.disconnect();
    console.log("LFO disconnected from previous destinations");

    // Configure based on destination and power state
    if (modulePower && synthPower) {
      if (destination === "filter") {
        handleFilterModulation(lfo);
      } else if (destination === "pitch") {
        handlePitchModulation(lfo);
      }
    } else {
      console.log("LFO not connected:", { modulePower, synthPower });
    }
  }, [lfoType, rate, amount, destination, modulePower, synthPower, synth, effects.filter, audioReady]);

  /**
   * Filter Modulation Handler
   * Configures LFO for filter frequency modulation
   */
  const handleFilterModulation = (lfo: Tone.LFO) => {
    if (!effects.filter || amount === 0) return;

    const baseFreq = Number(effects.filter.frequency.value) || 2000;
    const scaledAmount = Math.pow(2, amount * 4) - 1;
    const modAmount = baseFreq * scaledAmount;
    
    lfo.min = Math.max(20, baseFreq - modAmount);
    lfo.max = Math.min(20000, baseFreq + modAmount);
    lfo.connect(effects.filter.frequency);
    
    console.log(`LFO connected to filter:`, {
      baseFreq: baseFreq.toFixed(1),
      modAmount: modAmount.toFixed(1),
      range: `${lfo.min.toFixed(1)}Hz to ${lfo.max.toFixed(1)}Hz`
    });
  };

  /**
   * Pitch Modulation Handler
   * Configures LFO for oscillator pitch modulation
   * Handles both current and future voices in polyphonic mode
   */
  const handlePitchModulation = (lfo: Tone.LFO) => {
    if (!synth || amount === 0) return;

    const scaledAmount = amount * 1200;  // Scale to cents for pitch modulation
    lfo.min = -scaledAmount;
    lfo.max = scaledAmount;

    if (synth instanceof Tone.PolySynth) {
      // Connect to all existing voices
      const voices = (synth as any)._voices || [];
      voices.forEach((voice: any) => {
        if (voice?.oscillator?.detune) {
          lfo.connect(voice.oscillator.detune);
          console.log("Connected LFO to voice detune:", {
            voiceId: voice.id,
            detuneValue: voice.oscillator.detune.value,
            lfoState: lfo.state
          });
        }
      });

      // Set up handler for new voices and store it on synth instance
      const voiceAttackHandler = (voice: Tone.MonoSynth) => {
        if (voice?.oscillator?.detune) {
          // Ensure LFO is running before connecting
          if (lfo.state !== "started") {
            lfo.start();
          }
          lfo.connect(voice.oscillator.detune);
          console.log("Connected LFO to new voice detune:", {
            detuneValue: voice.oscillator.detune.value,
            lfoState: lfo.state
          });
        }
      };

      // Store handler reference and attach to synth
      (synth as any)._lfoVoiceHandler = voiceAttackHandler;
      (synth as CustomPolySynth).onVoiceAttack = voiceAttackHandler;

      console.log("Set up pitch modulation:", {
        scaledAmount,
        voiceCount: voices.length,
        lfoState: lfo.state
      });
    }
  };

  /**
   * Listen for filter frequency changes
   * Updates LFO range when filter frequency changes
   */
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
        <div className="control-group">
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {/* LFO type and destination selectors */}
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
              label="Dest"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              options={LFO_DESTINATIONS.map((dest) => ({
                value: dest.value,
                label: dest.label,
              }))}
            />
          </div>
          {/* Rate and amount controls */}
          <Fader
            id="rate"
            label="Rate"
            value={rate}
            sliderProps={{
              min: 0.1,
              max: 10,
              step: 0.1,
              orientation: "vertical",
              valueLabelDisplay: "auto",
              onChange: (_, value) => setRate(value as number),
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
              onChange: (_, value) => setAmount(value as number),
            }}
          />
        </div>
      </form>
    </BaseModule>
  );
};

export default LFOModule;
