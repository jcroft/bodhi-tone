"use client";

import React from "react";
import Select from "../../Input/Select";
import { StyledOscillatorIcon } from "./oscillatorStyles";
import { OscillatorTypeSelectProps, OscillatorType } from "./oscillatorTypes";
import { getOscillatorTypeLabel, getOscillatorIcon } from "./oscillatorUtils";
import { OSCILLATOR_TYPES } from "./oscillatorConstants";

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
