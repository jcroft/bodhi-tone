import { useLocalStorageState } from "@/hooks/useLocalStorageState";
import React from "react";
import styled from "styled-components";
import { WebMidi } from "webmidi";
import Select from "@/components/Input/Select";
import * as Tone from "tone";

interface MIDIInputSelectProps {
  label: string;
  componentKey: string;
  onNoteOn: (notes: string[]) => void;
  onNoteOff: (notes: string[]) => void;
}

const MIDIInputSelect: React.FC<MIDIInputSelectProps> = ({
  label,
  componentKey,
  onNoteOn,
  onNoteOff,
}) => {
  // midiInput: The currently selected MIDI input
  const [midiInput, setMidiInput] = useLocalStorageState(
    "selectedMidiInput",
    "none"
  );

  // midiInputOptions: The available MIDI ports as dropdown menu options
  const [midiInputOptions, setMidiInputOptions] = React.useState([
    { label: "Loading...", value: "none" },
  ]);

  // Handle enabling of MIDI
  const onMidiEnabled = () => {
    console.log("MIDI enabled", WebMidi.inputs);
    const MIDIInputOptions = WebMidi.inputs.map((input) => ({
      label: input.name,
      value: input.id,
    }));
    MIDIInputOptions.unshift({ label: "None", value: "none" });
    setMidiInputOptions(MIDIInputOptions);
  };

  // Enable the webMIDI APIs upon load
  React.useEffect(() => {
    WebMidi.enable()
      .then(onMidiEnabled)
      .catch((err) => alert(err));
  }, []);

  // Add listeners for incoming MIDI messages
  React.useEffect(() => {
    if (midiInput === "none" || !WebMidi.enabled) {
      return;
    }

    const selectedInput = WebMidi.getInputById(midiInput);
    if (!selectedInput) {
      return;
    }

    console.log("Adding note on/off listeners...");

    selectedInput.addListener("noteon", (e) => {
      const noteString = Tone.Midi(e.data[1]).toNote();
      // console.log(`Received noteOn from ${selectedInput.name}: `, noteString);
      onNoteOn([noteString]);
    });

    selectedInput.addListener("noteoff", (e) => {
      const noteString = Tone.Midi(e.data[1]).toNote();
      // console.log(`Received noteOn from ${selectedInput.name}: `, e);
      onNoteOff([noteString]);
    });

    return () => {
      selectedInput.removeListener("noteon");
      selectedInput.removeListener("noteoff");
    };
  }, [midiInput, WebMidi.enabled]);

  return (
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
  );
};

export default MIDIInputSelect;
