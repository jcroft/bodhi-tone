import React, { useEffect, useState } from 'react';
import * as Tone from 'tone';

type OscillatorModuleOptions = {
  name: string;
  oscillator: Tone.Oscillator;
  isOn: boolean;
};

const OscillatorModule:React.FC<OscillatorModuleOptions> = ({
  name = "Oscillator",
  oscillator,
  isOn,
}) => {
  const [isActive, setIsActive] = useState(isOn);

  return (
    <div>
      <h2>{name}</h2>


      <label htmlFor="frequency">Frequency:</label>
      <input
        type="range"
        id="frequency"
        min="20"
        max="20000"
        defaultValue="1000"
        onChange={(event) => {
          const frequency = parseInt(event.target.value, 10);
          oscillator.frequency.value = frequency;
        }}
      />

      <label htmlFor="volume">Volume:</label>
      <input
        type="range"
        id="volume"
        min="-100"
        max="0"
        defaultValue="-6"
        onChange={(event) => {
          const volume = parseInt(event.target.value, 10);
          oscillator.volume.value = volume;
        }}
      />

      <label htmlFor="type">Type:</label>

      <select
        id="type"
        onChange={(event) => {
          const type = event.target.value as Tone.ToneOscillatorType;
          oscillator.type = type;
        }}
      >
        <option value="sine">Sine</option>
        <option value="square">Square</option>
        <option value="sawtooth">Sawtooth</option>
        <option value="triangle">Triangle</option>
      </select>

      {/* <button onClick={handleToggle}>
        {isActive ? `Stop ${name}` : `Start ${name}`}
      </button> */}
    </div>
  );
}

export default OscillatorModule;