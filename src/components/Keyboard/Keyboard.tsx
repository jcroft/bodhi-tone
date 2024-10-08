"use client";

import React from "react";
import KeyboardOctave from "./KeyboardOctave";
import * as Tone from "tone";
import { useTheme } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledKeyboard = styled("div")`
  ul {
    height: 10rem;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    overflow: hidden;
    list-style: none;
    margin: 0;
    padding: 0;
    li {
      float: left;
      background-color: white;
      height: 10rem;
      width: 1.75rem;
      border: 0.5px solid;
      text-align: center;

      &:hover {
        background-color: #dfdfdf;
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
          background-color: #888;
        }
      }
    }

    li[data-active="true"] {
      &:after {
        border: 1px solid black;
      }
    }
  }
`;

const DEFAULT_LOWEST_OCTAVE = 1;
const DEFAULT_OCTAVES = 4;

type KeyboardOptions = {
  name: string;
  color?: string;
  lowestOctave?: number;
  octaves?: number;
  activeNotes?: Tone.Unit.Frequency[];
  onNoteOn?: (
    notes: Tone.Unit.Frequency[],
    velocity?: number,
    duration?: Tone.Unit.Time
  ) => void;
  onNoteOff?: (
    notes: Tone.Unit.Frequency[],
    velocity?: number,
    duration?: Tone.Unit.Time
  ) => void;
};

const Keyboard: React.FC<KeyboardOptions> = ({
  name = "keyboard",
  lowestOctave = DEFAULT_LOWEST_OCTAVE,
  octaves = DEFAULT_OCTAVES,
  onNoteOn,
  onNoteOff,
  activeNotes,
  color,
}) => {
  const theme = useTheme();
  const keyboardColor = color || theme.palette.primary.main;

  const octaveElements = React.useMemo(
    () =>
      Array.from({ length: octaves }).map((_, i) => (
        <KeyboardOctave
          key={i}
          octaveNumber={lowestOctave + i}
          onNoteOn={onNoteOn}
          onNoteOff={onNoteOff}
          activeNotes={activeNotes}
        />
      )),
    [octaves, lowestOctave, onNoteOn, onNoteOff, activeNotes]
  );

  return (
    <>
      <StyledKeyboard
        sx={{
          "& li[data-active='true']": {
            backgroundColor: `${keyboardColor} !important`,
            "&:after": {
              backgroundColor: keyboardColor,
            },
          },
        }}
        role="group"
        aria-label={`${name} keyboard`}
      >
        <ul className="set">
          {octaveElements}
          <KeyboardOctave COnly={true} octaveNumber={octaves + 1} />
        </ul>
      </StyledKeyboard>
    </>
  );
};

export default Keyboard;
