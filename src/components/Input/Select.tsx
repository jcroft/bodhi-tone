"use client";

import React from "react";
import { styled } from "@mui/material/styles";
import {
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
  SelectChangeEvent,
  ListItemIcon,
  Typography,
} from "@mui/material";

type Option = {
  readonly value: string;
  readonly label: string;
  readonly icon?: React.ReactNode;
};

type SelectProps = {
  label: string;
  value: string;
  onChange: (event: SelectChangeEvent<unknown>, child: React.ReactNode) => void;
  options: ReadonlyArray<Option>;
};

const StyledSelectWrapper = styled(FormControl)`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 120px;

  .MuiInputLabel-root {
    color: #fff;
    font-size: 0.75rem;
    &.Mui-focused {
      color: #fff;
    }
  }

  .MuiOutlinedInput-root {
    color: #fff;
    font-size: 0.75rem;
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 4px;

    .MuiOutlinedInput-notchedOutline {
      border-color: rgba(255, 255, 255, 0.3);
    }

    &:hover .MuiOutlinedInput-notchedOutline {
      border-color: rgba(255, 255, 255, 0.5);
    }

    &.Mui-focused .MuiOutlinedInput-notchedOutline {
      border-color: rgba(255, 255, 255, 0.7);
    }

    .MuiSelect-select {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
  }

  .MuiSelect-icon {
    color: #fff;
  }

  .MuiMenuItem-root {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.75rem;
  }
`;

const Select: React.FC<SelectProps> = ({ label, value, onChange, options }) => {
  return (
    <StyledSelectWrapper>
      <InputLabel>{label}</InputLabel>
      <MuiSelect
        value={value}
        label={label}
        onChange={onChange}
        size="small"
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.icon && (
              <ListItemIcon sx={{ minWidth: 'auto' }}>
                {option.icon}
              </ListItemIcon>
            )}
            <Typography variant="inherit">
              {option.label}
            </Typography>
          </MenuItem>
        ))}
      </MuiSelect>
    </StyledSelectWrapper>
  );
};

export default Select;
