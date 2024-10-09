"use client";

import { useLocalStorageState } from "@/hooks/useLocalStorageState";
import React, { ReactNode } from "react";
import { WebMidi } from "webmidi";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import * as Tone from "tone";
import {
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  styled,
  useTheme,
} from "@mui/material";

const StyledSelect = styled(Select)({
  color: "#ff6600",
  "& .MuiSelect-icon": {
    color: "#ff6600",
  },
  "& .MuiSelect-select": {
    color: "#ff6600",
  },
  "& .MuiSelect-selectMenu": {
    color: "#ff6600",
  },
});

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
  const onMidiEnabled = React.useCallback(() => {
    console.log("MIDI enabled");
    const MIDIInputOptions = WebMidi.inputs.map((input) => ({
      label: input.name,
      value: input.id,
    }));
    MIDIInputOptions.unshift({ label: "None", value: "none" });
    setMidiInputOptions(MIDIInputOptions);
  }, []);

  const browserSupportsMIDI = WebMidi.supported;

  // Enable the webMIDI APIs upon load
  const enableWebMidi = React.useCallback(() => {
    if (browserSupportsMIDI) {
      WebMidi.enable().then(onMidiEnabled).catch(console.error);
    } else {
      console.error("WebMIDI is not supported in this browser");
    }

    return () => {
      WebMidi.disable();
    };
  }, [browserSupportsMIDI, onMidiEnabled]);

  React.useEffect(() => {
    enableWebMidi();
  }, [enableWebMidi]);

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

    if (selectedInput.getListeners("noteon").length === 0) {
      selectedInput?.addListener("noteon", (e) => {
        const noteString = Tone.Midi(e.data[1]).toNote();
        // console.log(`Received noteOn from ${selectedInput.name}: `, noteString);
        onNoteOn([noteString]);
      });
    }
    if (selectedInput.getListeners("noteoff").length === 0) {
      selectedInput?.addListener("noteoff", (e) => {
        const noteString = Tone.Midi(e.data[1]).toNote();
        // console.log(`Received noteOn from ${selectedInput.name}: `, e);
        onNoteOff([noteString]);
      });
    }

    return () => {
      console.log("Removing note on/off listeners...");
      if (selectedInput.getListeners("noteon").length > 0) {
        selectedInput?.removeListener("noteon");
      }
      if (selectedInput.getListeners("noteoff").length > 0) {
        selectedInput?.removeListener("noteoff");
      }
    };
  }, [midiInput, WebMidi.enabled]);

  const handleSelectChange = (
    event: SelectChangeEvent<unknown>,
    child: ReactNode
  ) => {
    const newValue = event.target.value as string;
    setMidiInput(newValue);
  };

  const theme = useTheme();

  return browserSupportsMIDI ? (
    <FormControl variant="outlined">
      <InputLabel
        color="primary"
        id="midi-input-select-label"
        style={{
          backgroundColor: "#111",
          padding: "0 0.25rem",
        }}
      >
        {label}
      </InputLabel>
      <StyledSelect
        label={label}
        labelId="midi-input-select-label"
        id="midi-input-select"
        value={WebMidi.inputs.find((input) => input.id === midiInput)?.id || ""}
        onChange={handleSelectChange}
        placeholder="Select MIDI Input"
        displayEmpty
        input={<OutlinedInput />}
        MenuProps={MenuProps}
        size="small"
        defaultValue=""
      >
        {midiInputOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </StyledSelect>
    </FormControl>
  ) : (
    <div>MIDI not supported in this browser</div>
  );
};

export default MIDIInputSelect;
