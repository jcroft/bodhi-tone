"use client";

import { SynthContext, SynthOptions } from "@/app/page";

import React, { useContext, useEffect, useState } from "react";
import * as Tone from "tone";
import styled from "styled-components";

type BaseModuleOptions = {
  name: string;
  componentKey: string;
  isOn?: boolean;
  classNames?: string;
  onActivate?: () => void;
  onDeactivate?: () => void;
  children?: React.ReactNode;
};

const StyledBaseModule = styled.div`
  background-color: #f0f0f0;
  padding: 0;
  display: flex;
  flex-direction: column;
  border-bottom-left-radius: 0.35rem;
  border-bottom-right-radius: 0.35rem;
`;

const StyledModuleHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  justify-items: center;
  align-items: center;
  background-color: #ff5500;
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

const StyledModuleBody = styled.div`
  padding: 0.5rem;
  padding-top: 1.5rem;
  display: flex;
  flex-direction: row;
  gap: 1rem;

  form {
    display: flex;
    flex-direction: row;
    gap: 0.75rem;
    font-size: 0.75rem;

    label {
      color: #666;
      font-weight: 500;
      text-align: left;
      padding-top: 0.5rem;
    }

    .slider-container {
      padding-bottom: 1rem;
      position: relative;

      &:hover {
        .value {
          opacity: 1;
        }
      }
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
      background-color: #ddd;
      gap: 0.5rem;
      position: relative;
      padding-left: 0.5rem;
      padding-right: 0.5rem;
      border-radius: 0.25rem;
      min-height: 100px;

      h3 {
        margin: 0;
        position: absolute;
        top: -1rem;
        left: 0;
        text-transform: uppercase;
        font-size: 0.65rem;
        color: #999;
        font-weight: 500;
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
  componentKey,
  isOn,
  onActivate,
  onDeactivate,
  children,
}) => {
  const { synth, saveSynthOptions } = React.useContext(SynthContext);

  return (
    <StyledBaseModule>
      <StyledModuleHeader>
        <h2>{name}</h2>
      </StyledModuleHeader>
      <StyledModuleBody>{children}</StyledModuleBody>
    </StyledBaseModule>
  );
};

export default BaseModule;
