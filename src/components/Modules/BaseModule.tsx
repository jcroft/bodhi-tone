"use client";
import React from "react";
import { SynthContext } from "../Synth";
import { useTheme, styled } from "@mui/material";

type BaseModuleOptions = {
  name: string;
  isOn?: boolean;
  classNames?: string;
  onActivate?: () => void;
  onDeactivate?: () => void;
  children?: React.ReactNode;
};

const StyledBaseModule = styled("div", {
  shouldForwardProp: (prop) => prop !== "$theme",
})<{ $theme: any }>`
  padding: 0;
  display: flex;
  flex-direction: column;
  border-bottom-left-radius: 0.35rem;
  border-bottom-right-radius: 0.35rem;
`;

const StyledModuleHeader = styled("div", {
  shouldForwardProp: (prop) => prop !== "$theme",
})<{ $theme: any }>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  justify-items: center;
  align-items: center;
  background-color: ${({ $theme }) => $theme.palette.primary.main};
  color: #fff;
  padding: 0.25rem;
  border-top-left-radius: 0.35rem;
  border-top-right-radius: 0.35rem;

  h2 {
    margin: 0;
    padding: 0 0 0 0.25rem;
    font-size: 0.9rem;
    text-transform: uppercase;
  }

  input {
    margin: 0;
    padding: 0;
  }

  &.red {
    background-color: red;
  }
`;

const StyledModuleBody = styled("div", {
  shouldForwardProp: (prop) => prop !== "theme",
})<{ $theme: any }>`
  padding: 0.5rem;
  padding-top: 1.5rem;
  display: flex;
  flex-direction: row;
  background-color: #333;

  form {
    display: flex;
    flex-direction: row;
    gap: 0.75rem;
    font-size: 0.75rem;

    label {
      font-size: 0.65rem;
      color: #fff;
      font-weight: 400;
      text-align: left;
      padding-top: 0.5rem;
    }

    .value {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      text-align: center;
      opacity: 0;
      font-size: 0.65rem;
      transition: opacity 0.3s ease-in-out;
    }

    .control-group {
      display: flex;
      flex-direction: row;
      background-color: rgba(255, 255, 255, 0.075);
      gap: 0.5rem;
      position: relative;
      padding-left: 0.5rem;
      padding-right: 0.5rem;
      border-radius: 0.25rem;
      border-top-left-radius: 0;
      min-height: 100px;

      h3 {
        margin: 0;
        position: absolute;
        top: -0.75rem;
        left: 0;
        text-transform: uppercase;
        font-size: 0.5rem;
        color: #dfdfdf;
        font-weight: 500;
        padding: 0 0.5rem;
        background-color: rgba(255, 255, 255, 0.075);
        border-top-left-radius: 0.25rem;
        border-top-right-radius: 0.25rem;
      }
    }
  }

  form.column {
    flex-direction: column;
  }
`;

const BaseModule: React.FC<BaseModuleOptions> = ({
  name = "Base Module",
  classNames,
  isOn,
  onActivate,
  onDeactivate,
  children,
}) => {
  const theme = useTheme();

  return (
    <StyledBaseModule $theme={theme}>
      <StyledModuleHeader $theme={theme}>
        <h2>{name}</h2>
      </StyledModuleHeader>
      <StyledModuleBody $theme={theme}>{children}</StyledModuleBody>
    </StyledBaseModule>
  );
};

export default BaseModule;
