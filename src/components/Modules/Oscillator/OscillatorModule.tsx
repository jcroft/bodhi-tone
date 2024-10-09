import React from "react";
import BaseModule from "../BaseModule";
import { useSynth } from "@/contexts/SynthContext";
import OscillatorTypeSelect from "./OscillatorTypeSelect";
import { OscillatorModuleProps } from "./oscillatorTypes";
import * as Tone from "tone";
import BasicOscillatorFaders from "./BasicOscillatorFaders";
import AdditionalOscillatorFaders from "./AdditionalOscillatorFaders";
import { RecursivePartial } from "tone/build/esm/core/util/Interface";

const OscillatorModule: React.FC<OscillatorModuleProps> = ({
  name = "Oscillator",
}) => {
  const { synth } = useSynth();
  const synthState = synth?.get() as Tone.MonoSynthOptions;

  const updateSynthSettings = React.useCallback(
    (options: RecursivePartial<Tone.MonoSynthOptions>) => {
      synth?.set(options);
    },
    [synth]
  );

  const oscillatorType = synthState?.oscillator?.type as OscillatorType;

  return (
    <BaseModule name={name}>
      <form className="column">
        <div className="control-group transparent">
          <OscillatorTypeSelect
            synthState={synthState}
            updateSynthSettings={updateSynthSettings}
          />
          <AdditionalOscillatorFaders
            synthState={synthState}
            updateSynthSettings={updateSynthSettings}
            oscillatorType={oscillatorType}
          />
        </div>
      </form>
      <form>
        <div className="control-group">
          <h3>Tuning</h3>
          <BasicOscillatorFaders
            synthState={synthState}
            updateSynthSettings={updateSynthSettings}
          />
        </div>
      </form>
    </BaseModule>
  );
};

export default OscillatorModule;
