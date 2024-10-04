"use client";

import { SynthContext, SynthOptions } from "@/app/page";
import React, { useEffect, useState } from "react";
import * as Tone from "tone";
import BaseModule from "./BaseModule";
import Slider from "./input/slider";
import Select from "./input/select";
import styled from "styled-components";

const StyledKeyboard = styled.div<{ $isOn?: boolean }>`
  ul {
    height: 10rem;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    overflow: hidden;
    li {
      float: left;
      background-color: white;
      height: 10rem;
      width: 2rem;
      border: 0.5px solid;
      text-align: center;

      &:hover {
        background-color: grey;
      }
    }

    li.black {
      width: 0;
      position: relative;
      border: 0;

      &:after {
        display: block;
        content: "";
        height: 6rem;
        width: 1.25rem;
        background-color: black;
        position: relative;
        top: 0;
        left: -0.65rem;
      }

      &:hover {
        &:after {
          background-color: grey;
        }
      }
    }

    li[data-active="true"] {
      background-color: grey;
    }
`;

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

  console.log(activeNotes, "activeNotes");

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

type KeyboardOptions = {
  name: string;
  componentKey: string;
  lowestOctave?: number;
  octaves?: number;
  activeNotes?: (string | number)[];
};

const Keyboard: React.FC<KeyboardOptions> = ({
  name = "keyboard",
  componentKey,
  lowestOctave = 1,
  octaves = 3,
  activeNotes = ["C4"],
}) => {
  console.log(activeNotes, "activeNotes");

  return (
    <>
      <StyledKeyboard>
        <ul className="set">
          {Array.from({ length: octaves }).map((_, i) => (
            <KeyboardOctave
              key={i}
              octaveNumber={lowestOctave + i}
              activeNotes={activeNotes}
            />
          ))}
          <KeyboardOctave
            COnly={true}
            octaveNumber={octaves + 1}
            activeNotes={activeNotes}
          />
        </ul>
      </StyledKeyboard>
    </>
  );
};

export default Keyboard;
