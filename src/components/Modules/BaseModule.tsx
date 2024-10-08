"use client";
import React from "react";
import { useTheme, styled } from "@mui/material";
import { ModuleProvider, defaultModuleContext } from "@/contexts/ModuleContext";

type BaseModuleOptions = {
  name: string;
  classNames?: string;
  color?: string;
  children?: React.ReactNode;
};

const StyledBaseModule = styled("div")(({ theme }) => ({
  padding: theme.spacing(0),
  display: "flex",
  flexDirection: "column",
  borderBottomLeftRadius: theme.spacing(0.35),
  borderBottomRightRadius: theme.spacing(0.35),
  boxShadow: theme.shadows[1],
}));

const StyledModuleHeader = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  justifyItems: "center",
  alignItems: "center",
  color: "#fff",
  padding: theme.spacing(0.25),
  borderTopLeftRadius: theme.spacing(0.35),
  borderTopRightRadius: theme.spacing(0.35),
  borderBottom: `1px solid ${theme.palette.divider}`,
  fontSize: theme.typography.body2.fontSize,

  h2: {
    margin: 0,
    padding: "0 0 0 0.25rem",
    fontSize: ".75rem",
    textTransform: "uppercase",
    fontWeight: "500",
  },

  input: {
    margin: 0,
    padding: 0,
  },
}));

const StyledModuleBody = styled("div")(({ theme }) => ({
  padding: "0.5rem",
  gap: "0.5rem",
  display: "flex",
  flexDirection: "row",
  backgroundColor: "#333",
  borderBottomLeftRadius: "0.35rem",
  borderBottomRightRadius: "0.35rem",

  "& form": {
    display: "flex",
    flexDirection: "row",
    gap: "0.75rem",
    fontSize: "0.75rem",

    "& label": {
      fontSize: "0.65rem",
      color: "#fff",
      fontWeight: 400,
      textAlign: "left",
    },

    "& .value": {
      position: "absolute",
      left: 0,
      bottom: 0,
      width: "100%",
      textAlign: "center",
      opacity: 0,
      fontSize: "0.65rem",
      transition: "opacity 0.3s ease-in-out",
    },

    "& .control-group": {
      display: "flex",
      flexDirection: "row",
      backgroundColor: "#424242",
      gap: "0.5rem",
      position: "relative",
      paddingTop: "0.5rem",
      paddingLeft: "0.5rem",
      paddingRight: "0.5rem",
      borderRadius: "0.3rem",
      minHeight: "138px",
      border: "1.5px solid #606060",
      boxShadow: "inset 0 0 0.25rem rgba(0, 0, 0, 0.35)",

      "&.transparent": {
        backgroundColor: "transparent",
        border: "none",
        boxShadow: "none",
      },

      "& h3": {
        margin: 0,
        position: "absolute",
        bottom: "-1px",
        right: "-1px",
        textTransform: "uppercase",
        lineHeight: "0.8rem",
        fontSize: "0.5rem",
        color: "#fff",
        fontWeight: 500,
        padding: "0 0.25rem",
        backgroundColor: "#666",
        borderTopLeftRadius: "0.3rem",
        borderBottomRightRadius: "0.3rem",
        border: "0.5px solid #777",
        borderRight: "none",
        borderBottom: "none",
      },
    },
  },

  "& form.column": {
    flexDirection: "column",

    "& .control-group": {
      flexDirection: "column",
      padding: 0,
      alignItems: "flex-start",
    },
  },
}));

const BaseModule: React.FC<BaseModuleOptions> = ({
  name = "Base Module",
  color = defaultModuleContext.color,
  classNames,
  children,
}) => {
  const theme = useTheme();

  return (
    <ModuleProvider>
      <StyledBaseModule>
        <StyledModuleHeader
          role="banner"
          aria-label={`${name} module header`}
          sx={{
            backgroundColor: color,
          }}
        >
          <h2>{name}</h2>
        </StyledModuleHeader>
        <StyledModuleBody role="region" aria-label={`${name} module content`}>
          {children}
        </StyledModuleBody>
      </StyledBaseModule>
    </ModuleProvider>
  );
};

export default BaseModule;
