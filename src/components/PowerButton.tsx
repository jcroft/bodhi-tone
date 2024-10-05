import React from "react";
import styled from "styled-components";

interface PowerButtonProps {
  isOn: boolean;
  onClick: (power: boolean) => void;
}

const PowerButton: React.FC<PowerButtonProps> = ({ isOn, onClick }) => {
  const StyledPowerButton = styled.button`
    background-color: #f0f0f0;
    cursor: pointer;
    transition: background-color 0.3s ease-in-out;
    padding: 0.25rem;
    border-radius: 50%;
    width: 1rem;
    height: 1rem;

    &:hover {
      background-color: #ddd;
    }

    &.on {
      background-color: green;
      color: #fff;
    }

    &.off {
      background-color: red;
      color: #fff;
    }
  `;

  return (
    <StyledPowerButton
      onClick={() => onClick(!isOn)}
      className={`power-button ${isOn ? "on" : "off"}`}
    />
  );
};

export default PowerButton;
