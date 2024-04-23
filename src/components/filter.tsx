import React, { useEffect, useState } from 'react';
import * as Tone from 'tone';

type FilterModuleOptions = {
  name: string;
  filter: Tone.Filter;
  isOn: boolean;
};

const FilterModule:React.FC<FilterModuleOptions> = ({
  name = "Filter",
  filter,
  isOn,
}) => {
  const [isActive, setIsActive] = useState(isOn);

  // start and stop filter when isPlaying changes
  const handleToggle = () => {
    setIsActive(!isActive);
  };



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
          filter.frequency.value = frequency;
        }}
      />

        <label htmlFor="q">Q:</label>
        <input
          type="range"
          id="q"
          min="0"
          max="20"
          defaultValue="10"
          onChange={(event) => {
            const q = parseInt(event.target.value, 10);
            filter.Q.value = q;
          }}
        />


      <button onClick={handleToggle}>
        {isActive ? `Stop ${name}` : `Start ${name}`}
      </button>
    </div>
  );
}

export default FilterModule;