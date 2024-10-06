"use client";

import { useLocalStorageState } from "@/hooks/useLocalStorageState";
import React from "react";
import { WebMidi } from "webmidi";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import * as Tone from "tone";
import {
  FormControl,
  Input,
  InputLabel,
  MenuItem,
  OutlinedInput,
} from "@mui/material";

interface MIDIInputSelectProps {
  label: string;
  onNoteOn: (notes: string[]) => void;
  onNoteOff: (notes: string[]) => void;
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const MIDIInputSelect: React.FC<MIDIInputSelectProps> = ({
  label,
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

  const browserSupportsMIDI = WebMidi.supported;

  // Enable the webMIDI APIs upon load
  React.useEffect(() => {
    if (browserSupportsMIDI) {
      WebMidi.enable().then(onMidiEnabled).catch(console.error);
    } else {
      console.error("WebMIDI is not supported in this browser");
    }

    return () => {
      WebMidi.disable();
    };
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

  const handleSelectChange = (e: SelectChangeEvent) => {
    setMidiInput(e.target.value);
  };

  return browserSupportsMIDI ? (
    <FormControl variant="standard">
      <InputLabel id="midi-input-select-label">{label}</InputLabel>
      <Select
        label={label}
        labelId="midi-input-select-label"
        id="midi-input-select"
        value={midiInput}
        onChange={handleSelectChange}
        placeholder="Select MIDI Input"
        displayEmpty
        input={<Input />}
        MenuProps={MenuProps}
      >
        {midiInputOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  ) : (
    <div>MIDI not supported in this browser</div>
  );
};

export default MIDIInputSelect;
