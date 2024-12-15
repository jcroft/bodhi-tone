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
  
  // Use refs to store audio nodes
  const compressorRef = useRef<Tone.Compressor | null>(null);
  const limiterRef = useRef<Tone.Limiter | null>(null);

  // Debounce parameter updates to reduce audio glitches
  const debouncedUpdate = useCallback(
    debounce((paramName: string, value: number) => {
      if (!compressorRef.current || !limiterRef.current) return;

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
    }, 50),
    []
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
        value={value}
        sliderProps={{
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

  // Initialize nodes only once
  useEffect(() => {
    if (!compressorRef.current) {
      compressorRef.current = effects.masterBus.compressor;
    }
    if (!limiterRef.current) {
      limiterRef.current = effects.masterBus.limiter;
    }
  }, [effects.masterBus]);

  const [controls] = useState(() => ({
    threshold: -24,
    ratio: 4,
    attack: 0.003,
    release: 0.25,
    knee: 30,
    limiterThreshold: -1.0,
    masterVolume: 0
  }));

  return (
    <BaseModule name={name} color="#ff5252">
      <StyledControlGroup>
        {createFader("masterVolume", "Volume", controls.masterVolume, -60, 6, 0.1, 
          value => debouncedUpdate('masterVolume', value))}
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography variant="subtitle2">Compressor</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
            {createFader("threshold", "Thresh", controls.threshold, -60, 0, 0.5,
              value => debouncedUpdate('threshold', value))}
            {createFader("ratio", "Ratio", controls.ratio, 1, 20, 0.5,
              value => debouncedUpdate('ratio', value))}
            {createFader("attack", "Atk", controls.attack * 1000, 0.1, 100, 0.1,
              value => debouncedUpdate('attack', value / 1000))}
            {createFader("release", "Rel", controls.release * 1000, 10, 1000, 10,
              value => debouncedUpdate('release', value / 1000))}
            {createFader("knee", "Knee", controls.knee, 0, 40, 1,
              value => debouncedUpdate('knee', value))}
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography variant="subtitle2">Limiter</Typography>
          {createFader("limiterThreshold", "Thresh", controls.limiterThreshold, -20, 0, 0.1,
            value => debouncedUpdate('limiterThreshold', value))}
        </Box>
      </StyledControlGroup>
    </BaseModule>
  );
};

export default MasterBusModule;
