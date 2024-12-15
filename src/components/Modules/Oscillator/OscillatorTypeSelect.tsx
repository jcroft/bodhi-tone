/**
 * OscillatorTypeSelect.tsx
 * A dropdown component for selecting different oscillator waveforms and types.
 * Includes visual representation of each waveform type through icons.
 */

"use client";

import React from "react";
import Select from "../../Input/Select";
import { StyledOscillatorIcon } from "./oscillatorStyles";
import { OscillatorTypeSelectProps, OscillatorType } from "./oscillatorTypes";
import { getOscillatorTypeLabel, getOscillatorIcon } from "./oscillatorUtils";
import { OSCILLATOR_TYPES } from "./oscillatorConstants";

/**
 * OscillatorTypeSelect Component
 * Provides a dropdown menu for selecting different oscillator types.
 * Each option includes:
 * - A visual icon representing the waveform
 * - A human-readable label
 * - The corresponding Tone.js oscillator type value
 */
const OscillatorTypeSelect: React.FC<OscillatorTypeSelectProps> = ({
  synthState,
  updateSynthSettings,
}) => {
  return (
    <Select
      label="Type"
      value={synthState?.oscillator?.type || "sine"}
      onChange={(event) => {
        updateSynthSettings({
          oscillator: { type: event.target.value as OscillatorType },
        });
      }}
      options={OSCILLATOR_TYPES.map((type) => ({
        value: type,
        label: getOscillatorTypeLabel(type),
        icon: (
          <StyledOscillatorIcon
            src={getOscillatorIcon(type as OscillatorType)}
            alt={type}
          />
        ),
      }))}
    />
  );
};

export default OscillatorTypeSelect;
