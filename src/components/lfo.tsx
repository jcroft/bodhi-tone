import React, { useEffect, useState } from 'react';
import * as Tone from 'tone';

type OscillatorModuleOptions = {
    name: string;
    lfo: Tone.LFO;
    isOn: boolean;
  };

const LFOModule: React.FC<OscillatorModuleOptions> = ({
    name = "LFO",
    lfo,
    isOn,
}) => {
    const [isActive, setIsActive] = useState(isOn);
    console.log('lfo', lfo.context)

    return (
        <div>
            <h2>{name}</h2>

            <label htmlFor="frequency">Frequency:</label>
            <input
                type="range"
                id="frequency"
                min="0.1"
                max="10"
                step="0.1"
                defaultValue="1"
                onChange={(event) => {
                    const frequency = parseFloat(event.target.value);
                    lfo.frequency.value = frequency;
                }}
            />

            <label htmlFor="amplitude">Amplitude:</label>
            <input
                type="range"
                id="amplitude"
                min="0"
                max="1"
                step="0.1"
                defaultValue="0.5"
                onChange={(event) => {
                    const amplitude = parseFloat(event.target.value);
                    lfo.amplitude.value = amplitude;
                }}
            />

            <label htmlFor="type">Type:</label>
            <select
                id="type"
                onChange={(event) => {
                    const type = event.target.value as Tone.ToneOscillatorType;
                    lfo.type = type;
                }}
            >
                <option value="sine">Sine</option>
                <option value="square">Square</option>
                <option value="sawtooth">Sawtooth</option>
                <option value="triangle">Triangle</option>
            </select>
        </div>
    );
}

export default LFOModule;