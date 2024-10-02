"use client";

import AmpEnvelopeModule from "@/components/ampEnvelope";
import FilterWithEnvelopeModule from "@/components/filterEnvelope";
import OscillatorModule from "@/components/oscillator";
import React, { useContext, useEffect } from "react";
import * as Tone from "tone";
import { ToneOscillatorType } from "tone";
import { Frequency, Time } from "tone/build/esm/core/type/Units";
import styled from "styled-components";
import { WebMidi } from "webmidi";
import Select from "@/components/input/select";
import { SynthContext } from "@/app/page";


const DEFAULT_SYNTH_OPTIONS = {
    power: false,
    volume: -6,
    frequency: "C4" as Frequency,
    oscillator: {
        type: "sawtooth" as OscillatorType,
    //   frequency: 523.3,
    },
    envelope: {
      attack: 0.25,
      decay: 0.5,
      sustain: 0.5,
      release: 0.25,
    },
    filter: {
      type: "lowpass" as BiquadFilterType,
      Q: 0,
      rolloff: -24 as Tone.FilterRollOff
    },
    filterEnvelope: {
      attack: 0.25,
      decay: 0.5,
      sustain: 0.5,
      release: 0.25,
      baseFrequency: 100,
    },
  };

const StyledSynthesizer = styled.div<{ $isOn?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  opacity: ${({ $isOn }) => ($isOn ? 1 : 0.5)};
`;

const StyledModuleContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 1rem;
`;

const StyledDevUtilityContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 1rem;
`;

const Synthesizer: React.FC = () => {
    const [power, setPower] = React.useState(false);
    const [midiInput, setMidiInput] = React.useState("none");
    const [midiInputOptions, setMidiInputOptions] = React.useState([
      { label: "Loading...", value: "none" },
    ])
    const { synth } = useContext(SynthContext)
    synth.set({
        ...DEFAULT_SYNTH_OPTIONS
    })
    synth.toDestination();
  
    // update the synth when the synth options change
    // useEffect(() => {
    //   console.log("Updating synth with options: ", synthOptions);
    //   synth.set(synthOptions);
    // }, [synthOptions]);
  
    console.log('CURRENT SYNTH:', synth, synth.get())
    console.log('TONE STATE:', synth.context.state)
  
    useEffect(() => {
      if (power && Tone.context.state !== "running") {
        console.log("Powering on");
        Tone.start();
      }
    }, [power, synth]);
  
    const generateNotes = (
      notes: string[] | number[],
      velocity: number,
      duration?: Tone.Unit.Time
    ) => {
      onNoteOn(notes, velocity, duration);
    };
  
    const onNoteOn = (
      notes: string[] | number[],
      velocity?: number,
      duration?: Tone.Unit.Time
    ) => {
        console.log('received notes')
        synth.triggerAttackRelease(["C4", "E4", "A4"], "4n");
      if (duration) {
        console.log('triggering notes with duration', notes, velocity, duration)
        synth.triggerAttackRelease(notes, duration, Tone.now(), velocity);
        return;
      } else {
        console.log('triggering notes with no duration')
        synth.triggerAttack(notes, Tone.now(), velocity);
      }
    };
  
    const onNoteOff = (notes: string[] | number[]) => {
      synth.triggerRelease(notes, Tone.now());
    };
  
    const onMidiEnabled = () => {
      console.log("MIDI enabled", WebMidi.inputs);
      const MIDIInputOptions = WebMidi.inputs.map((input) => ({
        label: input.name,
        value: input.id,
      }));
      MIDIInputOptions.unshift({ label: "None", value: "none" });
      setMidiInputOptions(MIDIInputOptions);
    };
  
    // endable webmidi
    useEffect(() => {
      WebMidi.enable()
        .then(onMidiEnabled)
        .catch((err) => alert(err));
    }, []);
  
    useEffect(() => {
      if (midiInput === "none") {
        return;
      }
  
      const selectedInput = WebMidi.getInputById(midiInput);
      if (!selectedInput) {
        return;
      }
  
      selectedInput.addListener("noteon", (e) => {
        const noteString = Tone.Midi(e.data[1]).toNote();
        console.log(`Received noteOn from ${selectedInput.name}: `, noteString);
        onNoteOn([noteString]);
      });
  
      selectedInput.addListener("noteoff", (e) => {
        const noteString = Tone.Midi(e.data[1]).toNote();
        console.log("Received noteoff", e);
        onNoteOff([noteString]);
      });
  
      return () => {
        selectedInput.removeListener("noteon");
        selectedInput.removeListener("noteoff");
      };
    }, [midiInput]);
  
    return (
        <StyledSynthesizer $isOn={power}>
          <StyledModuleContainer>
            <OscillatorModule name="OSC 1" componentKey="oscillator" />
            <FilterWithEnvelopeModule
              componentKey="filterEnvelope"
              name="Filter"
            />
            <AmpEnvelopeModule componentKey="envelope" name="Amp" />
          </StyledModuleContainer>
          <StyledDevUtilityContainer>
            <button
              onClick={() => {
                setPower(!power);
              }}
            >
              Power Button ({power ? "On" : "Off"})
            </button>
  
            <button onClick={() => generateNotes([60], 0.5, "4n")}>A note</button>
  
            <button
              onClick={() => {
                generateNotes([62], 0.5, "4n");
              }}
            >
              A different note
            </button>
  
            <Select
              componentKey="midi-input"
              defaultOption="none"
              value={midiInput}
              label="Midi Input"
              options={midiInputOptions}
              onChange={(event) => {
                setMidiInput(event.target.value);
              }}
            />
          </StyledDevUtilityContainer>
        </StyledSynthesizer>
    );
  };
  
  export default Synthesizer;