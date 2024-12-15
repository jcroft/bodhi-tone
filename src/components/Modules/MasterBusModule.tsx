import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as Tone from 'tone';
import BaseModule from './BaseModule';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import Fader from '../Input/Fader';
import { useSynth } from '@/contexts/SynthContext';
import debounce from 'lodash.debounce';

const StyledControlGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  gap: theme.spacing(1),
  padding: theme.spacing(1),
  '& .MuiSlider-root': {
    color: theme.palette.primary.main,
  },
}));

interface MasterBusModuleProps {
  name?: string;
}

const MasterBusModule: React.FC<MasterBusModuleProps> = ({ name = "Master Bus" }) => {
  const { effects } = useSynth();
  
  // Use refs to store audio nodes and parameter state
  const compressorRef = useRef<Tone.Compressor | null>(null);
  const limiterRef = useRef<Tone.Limiter | null>(null);
  const parameterStateRef = useRef<{[key: string]: number}>({});

  // Smooth parameter changes with exponential ramping
  const smoothParameter = useCallback((paramName: string, value: number, rampTime = 0.05) => {
    if (!compressorRef.current || !limiterRef.current) return;

    // Store the target value
    parameterStateRef.current[paramName] = value;

    try {
      switch (paramName) {
        case 'threshold':
          compressorRef.current.threshold.rampTo(value, rampTime);
          break;
        case 'ratio':
          compressorRef.current.ratio.rampTo(value, rampTime);
          break;
        case 'attack':
          compressorRef.current.attack.rampTo(value, rampTime);
          break;
        case 'release':
          compressorRef.current.release.rampTo(value, rampTime);
          break;
        case 'knee':
          compressorRef.current.knee.rampTo(value, rampTime);
          break;
        case 'limiterThreshold':
          limiterRef.current.threshold.rampTo(value, rampTime);
          break;
        case 'masterVolume':
          Tone.Destination.volume.rampTo(value, rampTime);
          break;
      }
    } catch (error) {
      console.warn(`Failed to smooth parameter ${paramName}:`, error);
      // Fallback to instant value change if ramping fails
      switch (paramName) {
        case 'threshold':
          compressorRef.current.threshold.value = value;
          break;
        case 'ratio':
          compressorRef.current.ratio.value = value;
          break;
        case 'attack':
          compressorRef.current.attack.value = value;
          break;
        case 'release':
          compressorRef.current.release.value = value;
          break;
        case 'knee':
          compressorRef.current.knee.value = value;
          break;
        case 'limiterThreshold':
          limiterRef.current.threshold.value = value;
          break;
        case 'masterVolume':
          Tone.Destination.volume.value = value;
          break;
      }
    }
  }, []);

  // Optimize parameter updates with RAF and debounce
  const debouncedUpdate = useCallback(
    debounce((paramName: string, value: number) => {
      requestAnimationFrame(() => {
        smoothParameter(paramName, value);
      });
    }, 16), // ~60fps
    [smoothParameter]
  );

  // Memoize fader creation
  const createFader = useCallback(
    (
      id: string,
      label: string,
      value: number,
      min: number,
      max: number,
      step: number,
      onChange: (value: number) => void
    ) => (
      <Fader
        key={`master-${id}`}
        id={`master-${id}`}
        label={label}
        value={parameterStateRef.current[id] ?? value}
        sliderProps={{
          valueLabelDisplay: "auto",
          orientation: "vertical",
          min,
          max,
          step,
          onChange: (_, newValue) => {
            const value = newValue as number;
            onChange(value);
            debouncedUpdate(id, value);
          },
        }}
      />
    ),
    [debouncedUpdate]
  );

  // Initialize nodes and restore parameters
  useEffect(() => {
    if (!compressorRef.current) {
      compressorRef.current = effects.masterBus.compressor;
    }
    if (!limiterRef.current) {
      limiterRef.current = effects.masterBus.limiter;
    }

    // Restore any existing parameter values
    Object.entries(parameterStateRef.current).forEach(([param, value]) => {
      smoothParameter(param, value, 0); // Apply immediately
    });
  }, [effects.masterBus, smoothParameter]);

  // Initialize default control values
  const [controls] = useState(() => ({
    threshold: -24,
    ratio: 4,
    attack: 0.003,
    release: 0.25,
    knee: 30,
    limiterThreshold: -1.0,
    masterVolume: 0
  }));

  const masterVolumeFader = createFader(
    "masterVolume",
    "Volume",
    controls.masterVolume,
    -60,
    6,
    0.1,
    value => debouncedUpdate('masterVolume', value)
  );

  const compressorFaders = [
    createFader(
      "threshold",
      "Thresh",
      controls.threshold,
      -60,
      0,
      0.5,
      value => debouncedUpdate('threshold', value)
    ),
    createFader(
      "ratio",
      "Ratio",
      controls.ratio,
      1,
      20,
      0.5,
      value => debouncedUpdate('ratio', value)
    ),
    createFader(
      "attack",
      "Atk",
      controls.attack * 1000,
      0.1,
      100,
      0.1,
      value => debouncedUpdate('attack', value / 1000)
    ),
    createFader(
      "release",
      "Rel",
      controls.release * 1000,
      10,
      1000,
      10,
      value => debouncedUpdate('release', value / 1000)
    ),
    createFader(
      "knee",
      "Knee",
      controls.knee,
      0,
      40,
      1,
      value => debouncedUpdate('knee', value)
    )
  ];

  const limiterFader = createFader(
    "limiterThreshold",
    "Thresh",
    controls.limiterThreshold,
    -20,
    0,
    0.1,
    value => debouncedUpdate('limiterThreshold', value)
  );

  return (
    <BaseModule name={name} color="#ff5252">
      <form>
        <div className="control-group transparent">
          {masterVolumeFader}
        </div>
        <div className="control-group">
          <h3>Compressor</h3>
          {compressorFaders}
        </div>
        <div className="control-group">
          <h3>Limiter</h3>
          {limiterFader}
        </div>
      </form>
    </BaseModule>
  );
};

export default MasterBusModule;
