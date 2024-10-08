"use client";
import React from "react";
import * as Tone from "tone";

type Note =
  | "C"
  | "C#"
  | "D"
  | "D#"
  | "E"
  | "F"
  | "F#"
  | "G"
  | "G#"
  | "A"
  | "A#"
  | "B";

type KeyboardOctaveOptions = {
  octaveNumber?: number | string;
  COnly?: boolean;
  activeNotes?: (string | number)[];
  onNoteOn?: (
    notes: (string | number)[],
    velocity?: number,
    duration?: Tone.Unit.Time
  ) => void;
  onNoteOff?: (
    notes: (string | number)[],
    velocity?: number,
    duration?: Tone.Unit.Time
  ) => void;
};

const NOTES: Note[] = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];

const KeyboardOctave: React.FC<KeyboardOctaveOptions> = ({
  octaveNumber = 3,
  COnly = false,
  activeNotes,
  onNoteOn,
  onNoteOff,
}) => {
  const handleKeyDown = React.useCallback(
    (note: Tone.Unit.Frequency) => {
      onNoteOn && onNoteOn([note], 0.5, "4n");
    },
    [onNoteOn]
  );

  const handleKeyUp = React.useCallback(
    (note: Tone.Unit.Frequency) => {
      onNoteOff && onNoteOff([note], 0.5, "4n");
    },
    [onNoteOff]
  );

  const keys = React.useMemo(() => {
    const notesToRender = COnly ? NOTES.slice(0, 1) : NOTES;
    return notesToRender.map((note) => {
      const fullNote = `${note}${octaveNumber}` as Tone.Unit.Frequency;
      const isBlack = note.includes("#");
      return (
        <li
          key={fullNote}
          className={`${isBlack ? "black" : "white"} ${note.toLowerCase()}`}
          data-active={activeNotes?.includes(fullNote)}
          onMouseDown={() => handleKeyDown(fullNote)}
          onMouseUp={() => handleKeyUp(fullNote)}
          onMouseLeave={() => handleKeyUp(fullNote)}
          role="button"
          aria-pressed={activeNotes?.includes(fullNote)}
          aria-label={`${note} ${octaveNumber}`}
        />
      );
    });
  }, [COnly, octaveNumber, activeNotes, handleKeyDown, handleKeyUp]);

  return <>{keys}</>;
};

export default KeyboardOctave;
