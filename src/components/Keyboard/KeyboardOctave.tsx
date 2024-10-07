"use client";

import React from "react";
import * as Tone from "tone";
import { SynthContext } from "../Synth";
import { useTheme } from "@emotion/react";

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

const KeyboardOctave: React.FC<KeyboardOctaveOptions> = ({
  octaveNumber = 3,
  COnly = false,
  activeNotes = ["C2"],
  onNoteOn,
  onNoteOff,
}) => {
  const handleKeyDown = (notes: (string | number)[]) => {
    onNoteOn && onNoteOn(notes, 0.5, "4n");
  };

  return (
    <>
      <li
        className="white c"
        data-active={activeNotes?.includes(`C${octaveNumber}`)}
        onMouseDown={() => handleKeyDown([`C${octaveNumber}`])}
      ></li>
      {!COnly && (
        <>
          <li
            className="black cs"
            data-active={activeNotes?.includes(`C#${octaveNumber}`)}
            onMouseDown={() => handleKeyDown([`C#${octaveNumber}`])}
          ></li>
          <li
            className="white d"
            data-active={activeNotes?.includes(`D${octaveNumber}`)}
            onMouseDown={() => handleKeyDown([`D${octaveNumber}`])}
          ></li>
          <li
            className="black ds"
            data-active={activeNotes?.includes(`D#${octaveNumber}`)}
            onMouseDown={() => handleKeyDown([`D#${octaveNumber}`])}
          ></li>
          <li
            className="white e"
            data-active={activeNotes?.includes(`E${octaveNumber}`)}
            onMouseDown={() => handleKeyDown([`E${octaveNumber}`])}
          ></li>
          <li
            className="white f"
            data-active={activeNotes?.includes(`F${octaveNumber}`)}
            onMouseDown={() => handleKeyDown([`F${octaveNumber}`])}
          ></li>
          <li
            className="black fs"
            data-active={activeNotes?.includes(`F#${octaveNumber}`)}
            onMouseDown={() => handleKeyDown([`F#${octaveNumber}`])}
          ></li>
          <li
            className="white g"
            data-active={activeNotes?.includes(`G${octaveNumber}`)}
            onMouseDown={() => handleKeyDown([`G${octaveNumber}`])}
          ></li>
          <li
            className="black gs"
            data-active={activeNotes?.includes(`G#${octaveNumber}`)}
            onMouseDown={() => handleKeyDown([`G#${octaveNumber}`])}
          ></li>
          <li
            className="white a"
            data-active={activeNotes?.includes(`A${octaveNumber}`)}
            onMouseDown={() => handleKeyDown([`A${octaveNumber}`])}
          ></li>
          <li
            className="black as"
            data-active={activeNotes?.includes(`A#${octaveNumber}`)}
            onMouseDown={() => handleKeyDown([`A#${octaveNumber}`])}
          ></li>
          <li
            className="white b"
            data-active={activeNotes?.includes(`B${octaveNumber}`)}
            onMouseDown={() => handleKeyDown([`B${octaveNumber}`])}
          ></li>
        </>
      )}
    </>
  );
};

export default KeyboardOctave;
