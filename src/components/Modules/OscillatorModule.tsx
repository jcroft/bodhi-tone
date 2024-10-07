"use client";
import React from "react";
import * as Tone from "tone";
import BaseModule from "./BaseModule";
import Select from "@mui/material/Select";
import { OmniOscillatorType } from "tone/build/esm/source/oscillator/OscillatorInterface";
import {
  Divider,
  InputLabel,
  ListItemIcon,
  MenuItem,
  styled,
  Typography,
} from "@mui/material";
import Fader from "../Input/Fader";
import { DEFAULT_SYNTH_OPTIONS, useSynth } from "@/contexts/SynthContext";

type OscillatorModuleOptions = {
  name: string;
};

const StyledOscillatorIcon = styled("img")({
  width: "1rem",
  height: "1rem",
  backgroundColor: "white",
  borderRadius: "0.25rem",
});

const StyledSelect = styled(Select)({
  width: "100%",
  minWidth: "135px",
  fontSize: "0.75rem",

  img: {
    width: "1rem",
    height: "1rem",
    display: "inline-block",
  },

  ".MuiListItemIcon-root": {
    minWidth: "24px",
    position: "relative",
    top: ".125rem",
  },

  "& .MuiSelect-select": {
    padding: ".25rem .5rem",
    paddingRight: "2rem !important",
    minHeight: "unset",
  },
});

const StyledMenuItem = styled(MenuItem)({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",

  fontSize: "0.75rem",
  ".MuiListItemIcon-root": {
    minWidth: "24px",
  },
});

const StyledMenuGroupHeader = styled(Typography)({
  fontSize: "0.5rem",
  fontWeight: "bold",
  padding: "0 .5rem",
  color: "#999",
});

const OscillatorModule: React.FC<OscillatorModuleOptions> = ({
  name = "Oscillator",
}) => {
  const { synth } = useSynth();
  const synthState = synth?.get() as Tone.MonoSynthOptions;

  const [selectedOscillator, setSelectedOscillator] = React.useState(
    synthState?.oscillator?.type ||
      DEFAULT_SYNTH_OPTIONS.options?.oscillator?.type
  );

  const updateSynthSettings = (options: Partial<Tone.MonoSynthOptions>) => {
    synth?.set(options);
  };

  const oscillatorChoices: {
    value: OmniOscillatorType;
    label: string;
    iconUrl?: string;
  }[] = React.useMemo(
    () => [
      {
        value: "sine",
        label: "Sine",
        iconUrl: "/images/icons/sine-wave.svg",
      },
      {
        value: "fatsine",
        label: "Sines",
        iconUrl: "/images/icons/sine-wave.svg",
      },

      {
        value: "triangle",
        label: "Triangle",
        iconUrl: "/images/icons/triangle-wave.svg",
      },
      {
        value: "fattriangle",
        label: "Triangles",
        iconUrl: "/images/icons/triangle-wave.svg",
      },

      {
        value: "sawtooth",
        label: "Sawtooth",
        iconUrl: "/images/icons/saw-wave.svg",
      },
      {
        value: "fatsawtooth",
        label: "Sawtooths",
        iconUrl: "/images/icons/saw-wave.svg",
      },

      {
        value: "square",
        label: "Square",
        iconUrl: "/images/icons/pulse-wave.svg",
      },
      {
        value: "fatsquare",
        label: "Squares",
        iconUrl: "/images/icons/pulse-wave.svg",
      },
      {
        value: "pwm",
        label: "Square (PWM)",
        iconUrl: "/images/icons/pulse-wave.svg",
      },

      {
        value: "fmsine",
        label: "FM Sines",
        iconUrl: "/images/icons/sine-wave.svg",
      },
      {
        value: "fmtriangle",
        label: "FM Triangles",
        iconUrl: "/images/icons/triangle-wave.svg",
      },
      {
        value: "fmsawtooth",
        label: "FM Saws",
        iconUrl: "/images/icons/saw-wave.svg",
      },
      {
        value: "fmsquare",
        label: "FM Squares",
        iconUrl: "/images/icons/pulse-wave.svg",
      },

      {
        value: "amsine",
        label: "AM Sines",
        iconUrl: "/images/icons/sine-wave.svg",
      },
      {
        value: "amtriangle",
        label: "AM Triangles",
        iconUrl: "/images/icons/triangle-wave.svg",
      },
      {
        value: "amsawtooth",
        label: "AM Saws",
        iconUrl: "/images/icons/saw-wave.svg",
      },
      {
        value: "amsquare",
        label: "AM Squares",
        iconUrl: "/images/icons/pulse-wave.svg",
      },
    ],
    []
  );

  const basicOscillatorChoices = oscillatorChoices.filter(
    (choice) =>
      choice.value === "sine" ||
      choice.value === "triangle" ||
      choice.value === "sawtooth" ||
      choice.value === "square"
  );
  const fatOscillatorChoices = oscillatorChoices.filter((choice) =>
    choice?.value?.startsWith("fat")
  );
  const amOscillatorChoices = oscillatorChoices.filter((choice) =>
    choice?.value?.startsWith("am")
  );
  const fmOscillatorChoices = oscillatorChoices.filter((choice) =>
    choice?.value?.startsWith("fm")
  );

  return (
    <BaseModule name={name}>
      <form className="column">
        <div
          className="control-group transparent"
          style={{
            position: "relative",
            top: "-.4rem",
          }}
        >
          <InputLabel
            color="primary"
            id="osc-engine-select-label"
            style={{
              position: "relative",
              top: ".875rem",
              left: "0.75rem",
              padding: "0 0.25rem",
              backgroundColor: "#333",
              zIndex: 100,
            }}
          >
            Engine
          </InputLabel>
          <StyledSelect
            value={selectedOscillator}
            defaultValue=""
            label="Engine"
            labelId="osc-engine--select-label"
            onChange={(event) => {
              const newValue = event.target.value as OmniOscillatorType;
              setSelectedOscillator(
                oscillatorChoices.find((o) => o.value === newValue)?.value ||
                  "sine"
              );
              updateSynthSettings({
                oscillator: {
                  type: newValue,
                } as Tone.OmniOscillatorOptions,
              });
            }}
            size="small"
          >
            <StyledMenuGroupHeader variant="overline">
              Single Cycle
            </StyledMenuGroupHeader>
            {basicOscillatorChoices.map((choice) => (
              <StyledMenuItem key={choice.value} value={choice.value}>
                <ListItemIcon>
                  {choice.iconUrl ? (
                    <StyledOscillatorIcon src={choice.iconUrl} />
                  ) : null}
                </ListItemIcon>

                {choice.label}
              </StyledMenuItem>
            ))}
            <Divider />
            <StyledMenuGroupHeader variant="overline">
              Wave Stack
            </StyledMenuGroupHeader>
            {fatOscillatorChoices.map((choice) => (
              <StyledMenuItem key={choice.value} value={choice.value}>
                <ListItemIcon>
                  {choice.iconUrl ? (
                    <StyledOscillatorIcon src={choice.iconUrl} />
                  ) : null}
                </ListItemIcon>

                {choice.label}
              </StyledMenuItem>
            ))}
            <Divider />
            <StyledMenuGroupHeader variant="overline">
              Frequency Modulation
            </StyledMenuGroupHeader>
            {fmOscillatorChoices.map((choice) => (
              <StyledMenuItem key={choice.value} value={choice.value}>
                <ListItemIcon>
                  {choice.iconUrl ? (
                    <StyledOscillatorIcon src={choice.iconUrl} />
                  ) : null}
                </ListItemIcon>

                {choice.label}
              </StyledMenuItem>
            ))}
            <Divider />
            <StyledMenuGroupHeader variant="overline">
              Amplitude Modulation
            </StyledMenuGroupHeader>
            {amOscillatorChoices.map((choice) => (
              <StyledMenuItem key={choice.value} value={choice.value}>
                <ListItemIcon>
                  {choice.iconUrl ? (
                    <StyledOscillatorIcon src={choice.iconUrl} />
                  ) : null}
                </ListItemIcon>

                {choice.label}
              </StyledMenuItem>
            ))}
          </StyledSelect>

          {synthState?.oscillator?.type === "pwm" && (
            <Fader
              id="pulse-width"
              label="PWM"
              value={parseFloat(
                synthState?.oscillator.modulationFrequency.toString()
              )}
              sliderProps={{
                valueLabelDisplay: "auto",
                orientation: "horizontal",
                min: 0,
                max: 1,
                step: 0.01,
                onChange: (event, newValue) => {
                  updateSynthSettings({
                    oscillator: {
                      modulationFrequency: newValue,
                    } as Tone.PWMOscillatorOptions,
                  });
                },
              }}
            />
          )}

          {synthState?.oscillator?.type === "fatsawtooth" ||
          synthState?.oscillator?.type === "fatsine" ||
          synthState?.oscillator?.type === "fattriangle" ||
          synthState?.oscillator?.type === "fatsquare" ? (
            <>
              <Fader
                id="count"
                label="Count"
                value={parseFloat(synthState?.oscillator.count.toString())}
                sliderProps={{
                  valueLabelDisplay: "auto",
                  orientation: "horizontal",
                  defaultValue: 1,
                  min: 1,
                  max: 8,
                  step: 1,
                  onChange: (event, newValue) => {
                    updateSynthSettings({
                      oscillator: {
                        count: newValue,
                      } as Tone.OmniOscillatorOptions,
                    });
                  },
                }}
              />

              <Fader
                id="spread"
                label="Spread"
                value={parseFloat(synthState?.oscillator.spread.toString())}
                sliderProps={{
                  valueLabelDisplay: "auto",
                  orientation: "horizontal",
                  min: 0,
                  max: 100,
                  step: 1,
                  onChange: (event, newValue) => {
                    updateSynthSettings({
                      oscillator: {
                        spread: newValue,
                      } as Tone.OmniOscillatorOptions,
                    });
                  },
                }}
              />
            </>
          ) : null}

          {synthState?.oscillator?.type === "fmsine" ||
          synthState?.oscillator?.type === "fmsawtooth" ||
          synthState?.oscillator?.type === "fmtriangle" ||
          synthState?.oscillator?.type === "fmsquare" ? (
            <>
              <Fader
                id="modulation-index"
                label="Mod"
                value={parseFloat(
                  synthState?.oscillator.modulationIndex.toString()
                )}
                sliderProps={{
                  valueLabelDisplay: "auto",
                  orientation: "horizontal",
                  min: 0,
                  max: 100,
                  step: 1,
                  onChange: (event, newValue) => {
                    updateSynthSettings({
                      oscillator: {
                        modulationIndex: newValue,
                      } as Tone.OmniOscillatorOptions,
                    });
                  },
                }}
              />

              <Fader
                id="harmonicity"
                label="Ratio"
                value={parseFloat(
                  synthState?.oscillator.harmonicity.toString()
                )}
                sliderProps={{
                  valueLabelDisplay: "auto",
                  orientation: "horizontal",
                  min: 0,
                  max: 100,
                  step: 1,
                  onChange: (event, newValue) => {
                    updateSynthSettings({
                      oscillator: {
                        harmonicity: newValue,
                      } as Tone.OmniOscillatorOptions,
                    });
                  },
                }}
              />
            </>
          ) : null}

          {synthState?.oscillator?.type === "amsine" ||
          synthState?.oscillator?.type === "amsawtooth" ||
          synthState?.oscillator?.type === "amtriangle" ||
          synthState?.oscillator?.type === "amsquare" ? (
            <>
              <Fader
                id="harmonicity"
                label="Ratio"
                value={parseFloat(
                  synthState?.oscillator.harmonicity.toString()
                )}
                sliderProps={{
                  valueLabelDisplay: "auto",
                  orientation: "horizontal",
                  min: 0,
                  max: 100,
                  step: 1,
                  onChange: (event, newValue) => {
                    updateSynthSettings({
                      oscillator: {
                        harmonicity: newValue,
                      } as Tone.OmniOscillatorOptions,
                    });
                  },
                }}
              />
            </>
          ) : null}
        </div>
      </form>
      <form>
        <div className="control-group">
          <h3>Tuning</h3>
          <Fader
            id="detune"
            label="Coarse"
            value={parseFloat(synthState?.detune.toString())}
            sliderProps={{
              valueLabelDisplay: "auto",
              valueLabelFormat: (value: number) => `${value / 100} st`,
              orientation: "vertical",
              min: -1200,
              max: 1200,
              step: 100,
              track: false,
              onChange: (event, newValue) => {
                if (typeof newValue === "number") {
                  updateSynthSettings({
                    detune: newValue,
                  });
                }
              },
            }}
          />

          <Fader
            id="detune"
            label="Fine"
            value={parseFloat(synthState?.detune.toString())}
            sliderProps={{
              valueLabelDisplay: "auto",
              valueLabelFormat: (value: number) => `${value.toFixed()} ct`,
              orientation: "vertical",
              min: -100,
              max: 100,
              step: 1,
              track: false,
              onChange: (event, newValue) => {
                if (typeof newValue === "number") {
                  updateSynthSettings({
                    detune: newValue,
                  });
                }
              },
            }}
          />
        </div>
      </form>
    </BaseModule>
  );
};

export default OscillatorModule;
