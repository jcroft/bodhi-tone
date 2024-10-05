"use client";

import { SynthContext } from "@/app/page";
import React from "react";
import styled from "styled-components";
import KeyboardOctave from "./KeyboardOctave";
import * as Tone from "tone";

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
      background-color: grey !important;
              &:after {
          background-color: grey;
          border: 1px solid black;
        }
    }
`;

type KeyboardOptions = {
  name: string;
  componentKey: string;
  lowestOctave?: number;
  octaves?: number;
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

const Keyboard: React.FC<KeyboardOptions> = ({
  name = "keyboard",
  componentKey,
  lowestOctave = 1,
  octaves = 3,
  activeNotes = ["C4"],
  onNoteOn,
  onNoteOff,
}) => {
  return (
    <>
      <StyledKeyboard>
        <ul className="set">
          {Array.from({ length: octaves }).map((_, i) => (
            <KeyboardOctave
              key={i}
              octaveNumber={lowestOctave + i}
              activeNotes={activeNotes}
              onNoteOn={onNoteOn}
              onNoteOff={onNoteOff}
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
