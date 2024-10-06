"use client";

import AmpEnvelopeModule from "@/components/Modules/AmpEnvelope";
import FilterWithEnvelopeModule from "@/components/Modules/FilterEnvelope";
import OscillatorModule from "@/components/Modules/Oscillator";
import React, { useEffect } from "react";
import * as Tone from "tone";
import styled from "styled-components";
import Keyboard from "./Keyboard/Keyboard";
import VoiceModule from "./Modules/VoiceControl";
import MIDIInputSelect from "./MIDI/MIDIInputSelect";
import PowerButton from "./PowerButton";
import ReverbModule from "./Modules/ReverbModule";
import DelayModule from "./Modules/DelayModule";
import ChorusModule from "./Modules/ChorusModule";
import { useLocalStorageState } from "@/hooks/useLocalStorageState";

export const DEFAULT_SYNTH_OPTIONS: Partial<
  Tone.PolySynthOptions<Tone.MonoSynth>
> = {
  maxPolyphony: 16,
  voice: Tone.MonoSynth,
  volume: -18,
  options: {
    portamento: 0,
    oscillator: {
      type: "sawtooth",
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

const synth = new Tone.PolySynth<Tone.MonoSynth>(DEFAULT_SYNTH_OPTIONS);
const chorus = new Tone.Chorus(4, 2.5, 0.5).toDestination();
const delay = new Tone.PingPongDelay("4n", 0.1).toDestination();
const reverb = new Tone.Reverb(0.5).toDestination();

export const SynthContext = React.createContext({
  synth: null as Tone.PolySynth<Tone.MonoSynth> | null | undefined,
  synthOptions: DEFAULT_SYNTH_OPTIONS,
  saveSynthOptions: (options: Partial<Tone.MonoSynthOptions>) => {},
  effects: {
    chorus: new Tone.Chorus(4, 2.5, 0.5).toDestination(),
    delay: new Tone.PingPongDelay("4n", 0.1).toDestination(),
    reverb: new Tone.Reverb(0.5).toDestination(),
  },
});

const StyledSynthesizer = styled.div<{ $isOn?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  opacity: ${({ $isOn }) => ($isOn ? 1 : 0.25)};
  transition: opacity 0.3s ease-in-out;
`;

const StyledModuleContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const StyledMenuBar = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 1rem;
  background-color: #f0f0f0;
  font-size: 0.75rem;
  padding: 0.25rem;
  margin-bottom: 0.5rem;

  [class^="Select__StyledSelectWrapper"] {
    flex-direction: row;
    gap: 0.5rem;
  }
`;

const Synthesizer: React.FC = () => {
  // power: Tone.js requires a user interaction to enable the synth, so we'll have a power button
  const [power, setPower] = React.useState(false);

  // We need to store the active notes so they can be displayed on the keyboard
  const [activeNotes, setActiveNotes] = React.useState<(string | number)[]>([]);

  const [synthOptions, setSynthOptions] = useLocalStorageState<string>(
    "synthOptions",
    JSON.stringify(DEFAULT_SYNTH_OPTIONS)
  );

  // Set the default synth options
  synth?.set(DEFAULT_SYNTH_OPTIONS);

  // Send the output of the synth to the primary output
  synth?.toDestination();

  // turn the synth on when the user presses the power button
  useEffect(() => {
    if (power && Tone.context.state !== "running") {
      console.log("Powering on");
      Tone.start();
    }
  }, [power, synth]);

  // Handle incoming MIDI noteOn messages
  const onNoteOn = (
    notes: (string | number)[],
    velocity?: number,
    duration?: Tone.Unit.Time
  ) => {
    // console.log("onNoteOn: Received notes:", notes);
    if (duration) {
      setActiveNotes((prevList) => [...prevList, ...notes]);
      synth?.triggerAttackRelease(notes, duration, Tone.now(), velocity);
      // After a duration, release the notes // TODO: Ideally this would be the same duration as the note length
      setTimeout(() => {
        setActiveNotes((prevList) =>
          prevList.filter((note) => !notes.includes(note))
        );
      }, Tone.Time(duration).toMilliseconds());
      return;
    } else {
      setActiveNotes((prevList) => [...prevList, ...notes]);
      synth?.triggerAttack(notes, Tone.now(), velocity);
    }
  };

  // Handle incoming MIDI noteOff messages
  const onNoteOff = (notes: (string | number)[]) => {
    // console.log("onNoteOff: Received notes:", notes);
    setActiveNotes(activeNotes.filter((note) => !notes.includes(note)));
    synth?.triggerRelease(notes, Tone.now());
  };

  // If there is no synthOptions in local storage, set the default options
  // useEffect(() => {
  //   if (!synthOptions) {
  //     console.log("No synth options found, setting defaults");
  //     saveSynthOptions(DEFAULT_SYNTH_OPTIONS);
  //   } else {
  //     console.log("Synth options found, setting them", synthOptions);
  //     synth.set(synthOptions);
  //   }
  // }, [synthOptions]);

  const effects = {
    chorus,
    delay,
    reverb,
  };

  delay.wet.value = 0.05;

  reverb.wet.value = 0.5;

  // Connect the synth to the effects
  synth?.chain(effects.chorus, effects.delay, effects.reverb);

  return (
    <SynthContext.Provider
      value={{
        synth: synth,
        synthOptions: JSON.parse(synthOptions),
        saveSynthOptions: (options: Partial<Tone.MonoSynthOptions>) => {
          console.log("saving options", options);
          setSynthOptions(JSON.stringify(options));
        },
        effects,
      }}
    >
      <StyledMenuBar>
        <PowerButton isOn={power} onClick={() => setPower(!power)} />
        <MIDIInputSelect
          label="MIDI Input"
          onNoteOn={onNoteOn}
          onNoteOff={onNoteOff}
        />
      </StyledMenuBar>

      <StyledSynthesizer $isOn={power}>
        <StyledModuleContainer>
          <VoiceModule name="Main" />
          <OscillatorModule name="Oscillator" />
          <FilterWithEnvelopeModule name="Filter" />
          <AmpEnvelopeModule name="Amp" />

          <ChorusModule name="Chorus" />
          <DelayModule name="Delay" />
          <ReverbModule name="Reverb" />
        </StyledModuleContainer>

        <Keyboard
          activeNotes={activeNotes}
          name="keyboard"
          onNoteOn={onNoteOn}
          onNoteOff={onNoteOff}
        />
      </StyledSynthesizer>
    </SynthContext.Provider>
  );
};

export default Synthesizer;
