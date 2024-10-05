"use client";

import { SynthContext } from "@/app/page";
import React from "react";
import styled from "styled-components";

type KeyboardOctaveOptions = {
  octaveNumber?: number | string;
  COnly?: boolean;
  activeNotes?: (string | number)[];
};

const KeyboardOctave: React.FC<KeyboardOctaveOptions> = ({
  octaveNumber = 3,
  COnly = false,
  activeNotes = ["C2"],
}) => {
  const { synth, saveSynthOptions } = React.useContext(SynthContext);

  const onNoteDown = (note: string) => {
    synth.triggerAttackRelease(note, "8n");
  };

  return (
    <>
      <li
        className="white c"
        data-active={activeNotes?.includes(`C${octaveNumber}`)}
        onMouseDown={() => onNoteDown(`C${octaveNumber}`)}
      ></li>
      {!COnly && (
        <>
          <li
            className="black cs"
            data-active={activeNotes?.includes(`C#${octaveNumber}`)}
            onMouseDown={() => onNoteDown(`C#${octaveNumber}`)}
          ></li>
          <li
            className="white d"
            data-active={activeNotes?.includes(`D${octaveNumber}`)}
            onMouseDown={() => onNoteDown(`D${octaveNumber}`)}
          ></li>
          <li
            className="black ds"
            data-active={activeNotes?.includes(`D#${octaveNumber}`)}
            onMouseDown={() => onNoteDown(`D#${octaveNumber}`)}
          ></li>
          <li
            className="white e"
            data-active={activeNotes?.includes(`E${octaveNumber}`)}
            onMouseDown={() => onNoteDown(`E${octaveNumber}`)}
          ></li>
          <li
            className="white f"
            data-active={activeNotes?.includes(`F${octaveNumber}`)}
            onMouseDown={() => onNoteDown(`F${octaveNumber}`)}
          ></li>
          <li
            className="black fs"
            data-active={activeNotes?.includes(`F#${octaveNumber}`)}
            onMouseDown={() => onNoteDown(`F#${octaveNumber}`)}
          ></li>
          <li
            className="white g"
            data-active={activeNotes?.includes(`G${octaveNumber}`)}
            onMouseDown={() => onNoteDown(`G${octaveNumber}`)}
          ></li>
          <li
            className="black gs"
            data-active={activeNotes?.includes(`G#${octaveNumber}`)}
            onMouseDown={() => onNoteDown(`G#${octaveNumber}`)}
          ></li>
          <li
            className="white a"
            data-active={activeNotes?.includes(`A${octaveNumber}`)}
            onMouseDown={() => onNoteDown(`A${octaveNumber}`)}
          ></li>
          <li
            className="black as"
            data-active={activeNotes?.includes(`A#${octaveNumber}`)}
            onMouseDown={() => onNoteDown(`A#${octaveNumber}`)}
          ></li>
          <li
            className="white b"
            data-active={activeNotes?.includes(`B${octaveNumber}`)}
            onMouseDown={() => onNoteDown(`B${octaveNumber}`)}
          ></li>
        </>
      )}
    </>
  );
};

export default KeyboardOctave;
