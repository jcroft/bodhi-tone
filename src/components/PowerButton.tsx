import React from "react";
import styled from "styled-components";

interface PowerButtonProps {
  isOn: boolean;
  onClick: (power: boolean) => void;
}

const StyledPowerButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  align-items: center;
  cursor: pointer;

  span {
    font-size: 0.75rem;
  }
`;

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

const PowerButton: React.FC<PowerButtonProps> = ({ isOn, onClick }) => {
  return (
    <StyledPowerButtonContainer onClick={() => onClick(!isOn)}>
      <StyledPowerButton
        onClick={() => onClick(!isOn)}
        className={`power-button ${isOn ? "on" : "off"}`}
      />
      <span>{isOn ? "ON" : "OFF"}</span>
    </StyledPowerButtonContainer>
  );
};

export default PowerButton;
