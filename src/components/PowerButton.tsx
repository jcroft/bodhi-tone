/**
 * PowerButton.tsx
 * A reusable power button component that provides both main and module variants
 * for controlling power states throughout the synthesizer interface.
 */

"use client";

import React from "react";
import Button from "@mui/material/Button";
import PowerIcon from "@mui/icons-material/PowerSettingsNew";

/**
 * PowerButton Props Interface
 * @property {boolean} isOn - Current power state
 * @property {function} onClick - Callback function when power state changes
 * @property {React.CSSProperties} style - Optional custom styles
 * @property {'main' | 'module'} variant - Button variant
 *   - 'main': Large button with text for primary power control
 *   - 'module': Small icon-only button for individual modules
 */
interface PowerButtonProps {
  isOn: boolean;
  onClick: (power: boolean) => void;
  style?: React.CSSProperties;
  variant?: 'main' | 'module';
}

/**
 * PowerButton Component
 * Renders a power button with two possible variants:
 * 1. Main power button (variant='main'): Used for the synthesizer's main power control
 * 2. Module power button (variant='module'): Compact version for individual module power control
 */
const PowerButton: React.FC<PowerButtonProps> = ({ 
  isOn, 
  onClick, 
  style,
  variant = 'module'
}) => {
  // Styling for powered-off state with smooth transition
  const offStyle = {
    opacity: 0.35,
    transition: 'opacity 0.3s ease-in-out'
  };

  // Render main power button variant
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

  // Render module power button variant (compact, icon-only)
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
