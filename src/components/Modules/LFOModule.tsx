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
        // Use a fixed base frequency for the filter
        const baseFreq = 2000;
        const minFreq = 20;
        const maxFreq = 20000;
        
        // Scale amount exponentially
        const scaledAmount = Math.pow(2, amount * 8);
        
        // Calculate modulation range
        const modulationRange = Math.min(
          scaledAmount,
          Math.min(maxFreq / baseFreq, baseFreq / minFreq)
        );
        
        // Set modulation range
        lfo.min = baseFreq / modulationRange;
        lfo.max = baseFreq * modulationRange;
        
        // Debug filter state
        console.log("Filter state before connection:", {
          frequency: effects.filter.frequency.value,
          type: effects.filter.type,
          Q: effects.filter.Q.value
        });

        // Connect to filter frequency
        lfo.connect(effects.filter.frequency);
        console.log(`LFO connected to filter: range ${lfo.min.toFixed(1)}Hz - ${lfo.max.toFixed(1)}Hz`, {
          currentFilterFreq: effects.filter.frequency.value,
          lfoState: lfo.state
        });
      } else {
        // For pitch modulation
        const scaledAmount = amount * 1200;
        lfo.min = -scaledAmount;
        lfo.max = scaledAmount;

        // Debug synth state
        console.log("Synth state before connection:", {
          detune: synth.detune.value,
          voices: synth.voices.length
        });

        lfo.connect(synth.detune);
        console.log(`LFO connected to pitch: range ${-scaledAmount.toFixed(1)}c - ${scaledAmount.toFixed(1)}c`, {
          currentDetune: synth.detune.value,
          lfoState: lfo.state
        });
      }
    } else {
      console.log("LFO not connected:", { modulePower, synthPower });
    }
  }, [synth, effects.filter, modulePower, synthPower, lfoType, rate, destination, amount, audioReady]);

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
            onChange={(e) => setDestination(e.target.value)}
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
