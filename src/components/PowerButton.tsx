"use client";

import React from "react";
import Button from "@mui/material/Button";
import PowerIcon from "@mui/icons-material/PowerSettingsNew";

interface PowerButtonProps {
  isOn: boolean;
  onClick: (power: boolean) => void;
}

const PowerButton: React.FC<PowerButtonProps> = ({ isOn, onClick }) => {
  return (
    <Button
      variant="contained"
      color="primary"
      className={isOn ? "on" : "off"}
      onClick={() => onClick(!isOn)}
      startIcon={<PowerIcon />}
      size="small"
    >
      Power
    </Button>
  );
};

export default PowerButton;
