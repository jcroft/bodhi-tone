import App from 'next/app';
import React, { useState } from 'react';

interface SliderProps {
    label: string;
    key: string;
    min: number;
    max: number;
    step?: number;
    defaultValue?: number | string;
    value?: number | string;
    onChange: (event:React.ChangeEvent<HTMLInputElement>, newValue: string | number) => void;
}

const Slider: React.FC<SliderProps> = ({ label, key, min, max, value,defaultValue, onChange }) => {
    const [sliderValue, setSliderValue] = useState(value);

    const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseFloat(event.target.value);
        setSliderValue(newValue);
        onChange(event, newValue);
    };

    const containerStyles = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '10px',
    } as React.CSSProperties;

    const styles = {
            appearance: 'slider-vertical' as any,
            width: '8px',
            height: '175px',
        } as React.CSSProperties

    return (
        <div
            style={containerStyles}
        >
            <label htmlFor={key}>{label}</label>
            <input
                id={key}
                style={styles}
                type="range"
                min={min}
                max={max}
                defaultValue={defaultValue}
                value={sliderValue}
                onChange={handleSliderChange}
            />
            <span>{sliderValue}</span>
        </div>
    );
};

export default Slider;