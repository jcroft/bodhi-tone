"use client";

import EnvelopeModule from "@/components/envelope";
import FilterModule from "@/components/filter";
import LFOModule from "@/components/lfo";
import OscillatorModule from "@/components/oscillator";
import React, { useEffect } from "react";
import * as Tone from "tone";
import { ToneOscillatorType } from "tone";
import { Frequency, Time } from "tone/build/esm/core/type/Units";

export type SynthOptions = {
  power: boolean;
  osc1: {
    isOn: boolean;
    waveform: ToneOscillatorType;
    frequency: Frequency;
    volume: number;
  };
  osc2: {
    isOn: boolean;
    waveform: ToneOscillatorType;
    frequency: Frequency;
    volume: number;
  };
  filter1: {
    isOn: boolean;
    frequency: Frequency;
  };
  ampEnvelope: {
    isOn: boolean;
    attack: Time;
    decay: Time;
    sustain: number;
    release: Time;

  };
  filterEnvelope: {
    isOn: boolean;
    attack: Time;
    decay: Time;
    sustain: number;
    release: Time;

  };
  lfo1: {
    isOn: boolean;
    waveform: ToneOscillatorType;
    frequency: Frequency;
    amplitude: number;
    destination: 'osc1' | 'osc2' | 'filter1' | 'amplitude';
  };
  lfo2: {
    isOn: boolean;
    waveform: ToneOscillatorType;
    frequency: Frequency;
    amplitude: number;
    destination: 'osc1' | 'osc2' | 'filter1' | 'amplitude';
  };
};

const DEFAULT_SYNTH_OPTIONS: SynthOptions = {
  power: false,
  osc1: {
    isOn: true,
    waveform: "sine",
    frequency: 440,
    volume: 6,
  },
  osc2: {
    isOn: true,
    waveform: "sawtooth",
    frequency: 880,
    volume: 6,
  },
  filter1: {
    isOn: true,
    frequency: 1200,
  },
  ampEnvelope: {
    isOn: true,
    attack: 0.1,
    decay: 0.2,
    sustain: 0.5,
    release: 1,
  },
  filterEnvelope: {
    isOn: true,
    attack: 0.1,
    decay: 0.2,
    sustain: 0.5,
    release: 1,
  },
  lfo1: {
    isOn: true,
    waveform: "sine",
    frequency: 440,
    amplitude: 0.5,
    destination: 'osc1',
  },
  lfo2: {
    isOn: true,
    waveform: "square",
    frequency: 440,
    amplitude: 1,
    destination: 'osc2',
  },
};

const Synthesizer: React.FC = () => {
  const options = DEFAULT_SYNTH_OPTIONS;
  const [synthOptions, setSynthOptions] = React.useState(options);

  const osc1 = React.useMemo(() => new Tone.Oscillator(
    synthOptions.osc1.frequency,
    synthOptions.osc1.waveform
  ), [synthOptions.osc1.frequency, synthOptions.osc1.waveform]);

  const osc2 = React.useMemo(() => new Tone.Oscillator(
    synthOptions.osc2.frequency,
    synthOptions.osc2.waveform
  ), [synthOptions.osc2.frequency, synthOptions.osc2.waveform]);

  osc1.volume.value = synthOptions.osc1.volume;
  osc2.volume.value = synthOptions.osc2.volume;

  const filter1 = React.useMemo(
    () =>
      new Tone.Filter(
        synthOptions.filter1.frequency,
        "lowpass",
        -12
      ),
    [synthOptions.filter1.frequency]
  );

  const filterEnvelope = new Tone.FrequencyEnvelope(
    synthOptions.filterEnvelope.attack,
    synthOptions.filterEnvelope.decay,
    synthOptions.filterEnvelope.sustain,
    synthOptions.filterEnvelope.release
  );

  const ampEnvelope = new Tone.AmplitudeEnvelope(
    synthOptions.ampEnvelope.attack,
    synthOptions.ampEnvelope.decay,
    synthOptions.ampEnvelope.sustain,
    synthOptions.ampEnvelope.release
  );

  const lfo1 = React.useMemo(
    () => new Tone.LFO(options.lfo1.frequency, 0.1, 10),
    [options.lfo1.frequency]
  );
  const lfo2 = React.useMemo(
    () => new Tone.LFO(options.lfo2.frequency, 0.1, 10),
    [options.lfo2.frequency]
  );

  // connect the filter envelope
  // filterEnvelope.connect(filter1.frequency);


  // connect the amp envelope
  ampEnvelope.connect(Tone.Destination);

  // connect the oscillators
  osc1.connect(ampEnvelope);
  osc2.connect(ampEnvelope);

  // connect the filter
  filter1.connect(ampEnvelope);

  // connect the lfos
  // lfo1.connect(osc1.frequency);
  // lfo2.connect(osc2.frequency);




  // Tone requires a user gesture to start the audio context, so let's have a power button
  useEffect(() => {
    if (options.power) {
      Tone.start();
    }


  }, [options.power]);

  const containerStyles={
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  } as React.CSSProperties;

  const styles={
    display: 'flex',
    flexDirection: 'row',
    gap: '1rem',
  } as React.CSSProperties;


  console.log(Tone.getContext(), Tone.getContext().state);

  return (
    <div style={containerStyles}>
    <div style={styles}>
      <OscillatorModule name="Oscillator 1" oscillator={osc1} key="osc1" isOn={synthOptions.osc1.isOn} setSynthOptions={setSynthOptions} />
      <OscillatorModule name="Oscillator 2" oscillator={osc2} key="osc2" isOn={synthOptions.osc2.isOn} setSynthOptions={setSynthOptions} />
      <FilterModule name="Filter 1" key="filter1" filter={filter1} isOn={
        options.filter1.isOn
      } setSynthOptions={setSynthOptions} />
      <LFOModule name="LFO 1" key="lfo1" lfo={lfo1} isOn={
        options.lfo1.isOn
      } setSynthOptions={setSynthOptions}  />
      <LFOModule name="LFO 2" key="lfo2" lfo={lfo2} isOn={
        options.lfo2.isOn
      } setSynthOptions={setSynthOptions}  />
      <EnvelopeModule key="env-amp" name="Amp Envelope" envelope={ampEnvelope} isOn={
        options.ampEnvelope.isOn
      } setSynthOptions={setSynthOptions}  />
            <EnvelopeModule key="env-filter" name="Filter Envelope" envelope={filterEnvelope} isOn={
        options.filterEnvelope.isOn
      } setSynthOptions={setSynthOptions}  />
    </div>

    <button
        onClick={() => {
          setSynthOptions({ ...synthOptions, power: !synthOptions.power });
          console.log(Tone.getContext());
        }}
      >
        Power Button ({synthOptions.power ? "On" : "Off"})
      </button>

      <button onClick={() => ampEnvelope.triggerAttackRelease(
        '1n'
      )}>
        Trigger Envelope
      </button>
    </div>
  );
};

export default Synthesizer;
