import React from "react";
import { MenuItem, ListItemIcon, Typography } from "@mui/material";
import { StyledOscillatorIcon, StyledSelect } from "./oscillatorStyles";
import { OscillatorTypeSelectProps, OscillatorType } from "./oscillatorTypes";
import { getOscillatorTypeLabel, getOscillatorIcon } from "./oscillatorUtils";
import { OSCILLATOR_TYPES } from "./oscillatorConstants";

const OscillatorTypeSelect: React.FC<OscillatorTypeSelectProps> = ({
  synthState,
  updateSynthSettings,
}) => {
  return (
    <StyledSelect
      value={synthState?.oscillator?.type || "sine"}
      onChange={(event) => {
        updateSynthSettings({
          oscillator: { type: event.target.value as OscillatorType },
        });
      }}
    >
      {OSCILLATOR_TYPES.map((type) => (
        <MenuItem key={type} value={type}>
          <ListItemIcon>
            <StyledOscillatorIcon
              src={getOscillatorIcon(type as OscillatorType)}
              alt={type}
            />
          </ListItemIcon>
          <Typography variant="inherit">
            {getOscillatorTypeLabel(type)}
          </Typography>
        </MenuItem>
      ))}
    </StyledSelect>
  );
};

export default OscillatorTypeSelect;
