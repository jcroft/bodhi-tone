import { styled } from "@mui/material/styles";
import Select from "@mui/material/Select";

export const StyledOscillatorIcon = styled("img")({
  width: "1rem",
  height: "1rem",
  backgroundColor: "white",
  marginRight: "0.5rem",
});

export const StyledSelect = styled(Select)({
  minWidth: "120px",
  "& .MuiSelect-select": {
    display: "flex",
    alignItems: "center",
  },
});