import { SynthOptions } from "@/app/page";
import React, { useEffect, useState } from "react";
import * as Tone from "tone";

type BaseModuleOptions = {
  name: string;
  key: string;
  isOn: boolean;
  setSynthOptions: React.Dispatch<React.SetStateAction<SynthOptions>>;
    onActivate?: () => void;
    onDeactivate?: () => void;
  children?: React.ReactNode;
};

const BaseModule: React.FC<BaseModuleOptions> = ({
  name = "Base Module",
  key,
  isOn,
  setSynthOptions,
  onActivate,
  onDeactivate,
  children,
}) => {
  const [isActive, setIsActive] = useState(isOn);

  const handleUpdateSynthOptions = (
    optionKey: "isOn" | "waveform" | "frequency" | "volume",
    value: any
  ) => {
    setSynthOptions((prev) => {
      return {
        ...prev,
        [key]: {
          ...prev.osc1, // FIX: This needs to be the key, not osc1 hardcoded
          [optionKey]: value,
        },
      };
    });
  };

  const handleToggleActive = () => {
    setIsActive(!isActive);
    if (isActive) {
      onDeactivate && onDeactivate();
    } else {
      onActivate && onActivate();
    }
  }


  const containerStyles = {};

  const styles = {
    border: "1px solid black",
    padding: "1rem",
    display: "flex",
  };

  return (
    <div style={containerStyles}>
      <h2>{name}</h2>

      <label htmlFor="Active">Active:</label>
      <input
        type="checkbox"
        id="Active"
        defaultChecked={isActive}
        onChange={() => handleToggleActive()}
      />

      <div style={styles}>{children}</div>
    </div>
  );
};

export default BaseModule;
