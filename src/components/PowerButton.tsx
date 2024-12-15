"use client";

import React from "react";
import Button from "@mui/material/Button";
import PowerIcon from "@mui/icons-material/PowerSettingsNew";

interface PowerButtonProps {
  isOn: boolean;
  onClick: (power: boolean) => void;
  style?: React.CSSProperties;
  variant?: 'main' | 'module';
}

const PowerButton: React.FC<PowerButtonProps> = ({ 
  isOn, 
  onClick, 
  style,
  variant = 'module'
}) => {
  const offStyle = {
    opacity: 0.35,
    transition: 'opacity 0.3s ease-in-out'
  };

  if (variant === 'main') {
    return (
      <Button
        variant="contained"
        color="primary"
        className={isOn ? "on" : "off"}
        onClick={() => onClick(!isOn)}
        startIcon={<PowerIcon />}
        size="small"
        style={!isOn ? offStyle : undefined}
      >
        Power
      </Button>
    );
  }

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
        ...(!isOn ? offStyle : {}),
        ...style
      }}
    >
      <PowerIcon fontSize="small" />
    </Button>
  );
};

export default PowerButton;
