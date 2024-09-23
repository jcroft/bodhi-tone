"use client";

import React from "react";
import styled from "styled-components";

type SelectProps = {
  label: string;
  componentKey: string;
  options: { value: string; label: string }[];
  defaultOption: string;
  value: string;
  onChange: (
    event: React.ChangeEvent<HTMLSelectElement>,
    newValue: string
  ) => void;
};

const StyledSelectWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: top;
`;

const Select: React.FC<SelectProps> = ({
  label,
  componentKey,
  options,
  value,
  onChange,
}) => {
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = event.target.value;
    onChange(event, newValue);
  };

  return (
    <StyledSelectWrapper>
      <label htmlFor={componentKey}>{label}</label>
      <select id={componentKey} value={value} onChange={handleSelectChange}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </StyledSelectWrapper>
  );
};

export default Select;
