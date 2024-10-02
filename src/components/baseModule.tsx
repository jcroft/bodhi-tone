"use client";

import { SynthContext, SynthOptions, SynthOptionsContext } from "@/app/page";

import React, { useContext, useEffect, useState } from "react";
import * as Tone from "tone";
import styled from "styled-components";

type BaseModuleOptions = {
  name: string;
  componentKey: string;
  isOn?: boolean;
  onActivate?: () => void;
  onDeactivate?: () => void;
  children?: React.ReactNode;
};

const StyledBaseModule = styled.div`
  background-color: #f0f0f0;
  padding: 0;
  display: flex;
  flex-direction: column;
`;

const StyledModuleHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  justify-items: center;
  align-items: center;
  background-color: #e0e0e0;
  padding: 0.25rem;

  h2 {
    margin: 0;
    padding: 0;
  }

  input {
    margin: 0;
    padding: 0;
  }
`;

const StyledModuleBody = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: row;
  gap: 1rem;

  form {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    font-size: 0.75rem;

    label {
      font-weight: bold;
    }
  }

  form.column {
    flex-direction: column;
  }
`;

const BaseModule: React.FC<BaseModuleOptions> = ({
  name = "Base Module",
  componentKey,
  isOn,
  onActivate,
  onDeactivate,
  children,
}) => {
  const { synth } =
    React.useContext(SynthContext);
  // const [isActive, setIsActive] = useState(isOn);

  // useEffect(() => {
  //   if (isActive && onActivate) {
  //     onActivate();
  //   } else if (!isActive && onDeactivate) {
  //     onDeactivate();
  //   }
  // }, [isActive]);

  return (
    <StyledBaseModule>
      <StyledModuleHeader>
        <h2>{name}</h2>
        {/* <input
          type="checkbox"
          id="Active"
          defaultChecked={isActive}
          onChange={(event) => {
            setIsActive(event.target.checked);
          }}
        /> */}
      </StyledModuleHeader>
      <StyledModuleBody>{children}</StyledModuleBody>
    </StyledBaseModule>
  );
};

export default BaseModule;
