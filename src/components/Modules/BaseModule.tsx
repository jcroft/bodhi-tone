"use client";
import React, { createContext } from "react";
import { useTheme, styled } from "@mui/material";
import { ModuleProvider, defaultModuleContext } from "@/contexts/ModuleContext";

type BaseModuleOptions = {
  name: string;
  classNames?: string;
  color?: string;
  children?: React.ReactNode;
};

const StyledBaseModule = styled("div")`
  padding: 0;
  display: flex;
  flex-direction: column;
  border-bottom-left-radius: 0.35rem;
  border-bottom-right-radius: 0.35rem;
  box-shadow: 0 0 0.25rem rgba(0, 0, 0, 0.25);
`;

const StyledModuleHeader = styled("div")`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  justify-items: center;
  align-items: center;
  color: #fff;
  padding: 0.25rem;
  border-top-left-radius: 0.35rem;
  border-top-right-radius: 0.35rem;
  border-bottom: 1px solid #222;

  h2 {
    margin: 0;
    padding: 0 0 0 0.25rem;
    font-size: 0.75rem;
    text-transform: uppercase;
    font-weight: 500;
  }

  input {
    margin: 0;
    padding: 0;
  }

  &.red {
    background-color: red;
  }
`;

const StyledModuleBody = styled("div")`
  padding: 0.5rem;
  gap: 0.5rem;
  display: flex;
  flex-direction: row;
  background-color: #333;
  border-bottom-left-radius: 0.35rem;
  border-bottom-right-radius: 0.35rem;

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
      background-color: #424242;
      gap: 0.5rem;
      position: relative;
      padding-top: 0.5rem;
      padding-left: 0.5rem;
      padding-right: 0.5rem;
      border-radius: 0.3rem;
      min-height: 138px;
      border: 1.5px solid #606060;
      box-shadow: inset 0 0 0.25rem rgba(0, 0, 0, 0.35);

      &.transparent {
        background-color: transparent;
        border: none;
        box-shadow: none;
      }

      h3 {
        margin: 0;
        position: absolute;
        bottom: -1px;
        right: -1px;
        text-transform: uppercase;
        line-height: 0.8rem;
        font-size: 0.5rem;
        color: #fff;
        font-weight: 500;
        padding: 0 0.25rem;
        background-color: #666;
        border-top-left-radius: 0.3rem;
        border-bottom-right-radius: 0.3rem;
        border: 0.5px solid #777;
        border-right: none;
        border-bottom: none;
      }
    }
  }

  form.column {
    flex-direction: column;

    .control-group {
      flex-direction: column;
      padding: 0;
      align-items: flex-start;
    }
  }
`;

const BaseModule: React.FC<BaseModuleOptions> = ({
  name = "Base Module",
  color = defaultModuleContext.color,
  classNames,
  children,
}) => {
  const theme = useTheme();

  return (
    <ModuleProvider>
      <StyledBaseModule>
        <StyledModuleHeader
          sx={{
            backgroundColor: color,
          }}
        >
          <h2>{name}</h2>
        </StyledModuleHeader>
        <StyledModuleBody>{children}</StyledModuleBody>
      </StyledBaseModule>
    </ModuleProvider>
  );
};

export default BaseModule;
