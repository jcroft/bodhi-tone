"use client";

import React from "react";
import Button from "@mui/material/Button";
import PowerIcon from "@mui/icons-material/PowerSettingsNew";

interface PowerButtonProps {
  isOn: boolean;
  onClick: (power: boolean) => void;
  style?: React.CSSProperties;
}

const PowerButton: React.FC<PowerButtonProps> = ({ isOn, onClick, style }) => {
  return (
    <Button
      variant="text"
      color="inherit"
      className={isOn ? "on" : "off"}
      onClick={() => onClick(!isOn)}
      style={{
        minWidth: '24px',
        width: '24px',
        height: '24px',
        padding: 0,
        ...style
      }}
    >
      <PowerIcon fontSize="small" />
    </Button>
  );
};

export default PowerButton;
