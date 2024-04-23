'use client';

import FilterModule from '@/components/filter';
import LFOModule from '@/components/lfo';
import OscillatorModule from '@/components/oscillator';
import React, { useEffect } from 'react';
import * as Tone from 'tone';
import { ToneOscillatorType } from 'tone';
import { Frequency, Time } from 'tone/build/esm/core/type/Units';

type SynthOptions = {
  power: boolean;
  osc1: {
    frequency: Frequency;
    volume: number;
  };
  osc2: {
    frequency: Frequency;
    volume: number;
  };
  filter: {
    frequency: Frequency;
  };
  envelope: {
    attack: Time;
    decay: Time;
    sustain: number;
    release: Time;
  };
  lfo1: {
    waveform: ToneOscillatorType;
    frequency: Frequency;
    amplitude: number;
  };
  lfo2: {
    waveform: ToneOscillatorType;
    frequency: Frequency;
    amplitude: number;
  };
};

const DEFAULT_SYNTH_OPTIONS: SynthOptions = {
  power: false,
  osc1: {
    frequency: 440,
    volume: 6,
  },
  osc2: {
    frequency: 440,
    volume: 6,
  },
  filter: {
    frequency: 1000,
  },
  envelope: {
    attack: 0.1,
    decay: 0.2,
    sustain: 0.5,
    release: 1,
  },
  lfo1: {
    waveform: 'sine',
    frequency: '1000Hz' as Frequency,
    amplitude: 0.5,
  },
  lfo2: {
    waveform: 'square',
    frequency: '1000Hz' as Frequency,
    amplitude: 1,
  },
};

const Synthesizer: React.FC = () => {
  const options = DEFAULT_SYNTH_OPTIONS;
  const [synthOptions, setSynthOptions] = React.useState(options);

  console.log(options)

  const osc1 = new Tone.Oscillator().toDestination();
  const osc2 = new Tone.Oscillator().toDestination();
  const filter = new Tone.Filter(
    synthOptions.filter.frequency,
    'lowpass',
    -24 as Tone.FilterRollOff,
  ).toDestination();
  const envelope = new Tone.AmplitudeEnvelope().toDestination();
  const lfo1 = React.useMemo(() => new Tone.LFO(synthOptions.lfo1.frequency, 200, 10000), [synthOptions.lfo1.frequency]);
  const lfo2 = React.useMemo(() => new Tone.LFO(synthOptions.lfo2.frequency, 200, 10000), [synthOptions.lfo2.frequency]);

  // Connect the oscillators to the filter and envelope
  osc1.connect(filter);
  osc2.connect(filter);
  filter.connect(envelope);
          envelope.connect(Tone.Destination);
          lfo1.connect(osc1.frequency);
          lfo2.connect(filter.frequency);


  useEffect(() => {
    if (synthOptions.power) {
      Tone.start();
      osc1.start();
      osc2.start();
      lfo1.start();
      lfo2.start();
    } else {
      osc1.stop();
      osc2.stop();
      lfo1.stop();
      lfo2.stop();
    }
  }, [synthOptions.power, osc1, osc2 , filter, envelope, lfo1, lfo2]);

  useEffect(() => {
    osc1.frequency.value = synthOptions.osc1.frequency;
    osc1.volume.value = synthOptions.osc1.volume;

    osc2.frequency.value = synthOptions.osc2.frequency;
    osc2.volume.value = synthOptions.osc2.volume;

    filter.frequency.value = synthOptions.filter.frequency;

    envelope.attack = synthOptions.envelope.attack;
    envelope.decay = synthOptions.envelope.decay;
    envelope.sustain = synthOptions.envelope.sustain;
    envelope.release = synthOptions.envelope.release;

    return () => {
      osc1.dispose();
      osc2.dispose();
      filter.dispose();
      envelope.dispose();
    };
  }, [synthOptions, osc1, osc2, filter, envelope]);

  console.log(Tone.getContext())

  return (
    <div>
      <h1>Synthesizer</h1>
      <OscillatorModule name="Oscillator 1" oscillator={osc1} isOn={true} />
      <OscillatorModule name="Oscillator 2"  oscillator={osc2} isOn={true} />
      <FilterModule name="Filter" filter={filter} isOn={true} />
      <LFOModule name="LFO 1" lfo={lfo1} isOn={true} />
      <LFOModule name="LFO 2" lfo={lfo2} isOn={true} />

      <button onClick={() => {
        setSynthOptions({ ...synthOptions, power: !synthOptions.power });
        console.log(Tone.getContext())
      }}>Power Button ({synthOptions.power ? 'On' : 'Off'})</button>
    </div>
  );
}

export default Synthesizer;

