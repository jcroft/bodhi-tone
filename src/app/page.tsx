"use client";

import AmpEnvelopeModule from "@/components/ampEnvelope";
import FilterWithEnvelopeModule from "@/components/filterEnvelope";
import OscillatorModule from "@/components/oscillator";
import React, { useEffect } from "react";
import * as Tone from "tone";
import { ToneOscillatorType } from "tone";
import { Frequency, Time } from "tone/build/esm/core/type/Units";
import styled from "styled-components";
import { WebMidi } from "webmidi";
import Select from "@/components/input/select";
import Synthesizer from "@/components/synth";

export type SynthOptions = {
  power: boolean;
  volume: number;
  frequency: Frequency;
  oscillator: {
    type: ToneOscillatorType;
    frequency: Frequency;
  };
  envelope: {
    attack: Time;
    decay: Time;
    sustain: number;
    release: Time;
  };
  filter: {
    type: string;
    rolloff: number;
    Q: number;
  };
  filterEnvelope: {
    attack: Time;
    decay: Time;
    sustain: number;
    release: Time;
    baseFrequency: Frequency;
  };
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

export const SynthContext = React.createContext({
  synth: new Tone.PolySynth<Tone.MonoSynth>({
    maxPolyphony: 8,
    voice: Tone.MonoSynth,
  }),
});

const SynthesizerPage: React.FC = () => {
  // const [power, setPower] = React.useState(false);
  // const [midiInput, setMidiInput] = React.useState("none");
  // const [midiInputOptions, setMidiInputOptions] = React.useState([
  //   { label: "Loading...", value: "none" },
  // ])

  // useEffect(() => {
  //   if (power && Tone.context.state !== "running") {
  //     console.log("Powering on");
  //     Tone.start();
  //   }
  // }, [power]);

  // const generateNotes = (
  //   notes: string[] | number[],
  //   velocity: number,
  //   duration?: Tone.Unit.Time
  // ) => {
  //   onNoteOn(notes, velocity, duration);
  // };

  // const onNoteOn = (
  //   notes: string[] | number[],
  //   velocity: number,
  //   duration?: Tone.Unit.Time
  // ) => {
  //   if (duration) {
  //     synth.triggerAttackRelease(notes, duration, Tone.now(), velocity);
  //     return;
  //   } else {
  //     synth.triggerAttack(notes, Tone.now(), velocity);
  //   }
  // };

  // const onNoteOff = (notes: string[] | number[]) => {
  //   synth.triggerRelease(notes, Tone.now());
  // };

  // const onMidiEnabled = () => {
  //   console.log("MIDI enabled", WebMidi.inputs);
  //   const MIDIInputOptions = WebMidi.inputs.map((input) => ({
  //     label: input.name,
  //     value: input.id,
  //   }));
  //   MIDIInputOptions.unshift({ label: "None", value: "none" });
  //   setMidiInputOptions(MIDIInputOptions);
  // };

  // // endable webmidi
  // useEffect(() => {
  //   WebMidi.enable()
  //     .then(onMidiEnabled)
  //     .catch((err) => alert(err));
  // }, []);

  // useEffect(() => {
  //   if (midiInput === "none") {
  //     return;
  //   }

  //   const selectedInput = WebMidi.getInputById(midiInput);
  //   if (!selectedInput) {
  //     return;
  //   }

  //   selectedInput.addListener("noteon", (e) => {
  //     const noteString = Tone.Midi(e.data[1]).toNote();
  //     console.log(`Received noteOn from ${selectedInput.name}: `, noteString);
  //     onNoteOn([noteString], e.velocity);
  //   });

  //   selectedInput.addListener("noteoff", (e) => {
  //     const noteString = Tone.Midi(e.data[1]).toNote();
  //     console.log("Received noteoff", e);
  //     onNoteOff([noteString]);
  //   });

  //   return () => {
  //     selectedInput.removeListener("noteon");
  //     selectedInput.removeListener("noteoff");
  //   };
  // }, [midiInput]);

  return (
    <SynthContext.Provider value={{
      synth: new Tone.PolySynth<Tone.MonoSynth>({
        maxPolyphony: 8,
        voice: Tone.MonoSynth,
      })}
    }>
      <Synthesizer />
    </SynthContext.Provider>
  );
};

export default SynthesizerPage;
