/**
 * BaseModule.tsx
 * A foundational component that provides consistent styling and structure for all synthesizer modules.
 * This component implements the common layout, styling, and behavior shared across all module types
 * (oscillator, filter, envelope, effects, etc.).
 */

"use client";
import React from "react";
import { useTheme, styled } from "@mui/material";
import { ModuleProvider, defaultModuleContext } from "@/contexts/ModuleContext";

/**
 * BaseModule Props Interface
 * @property {string} name - Display name of the module
 * @property {string} classNames - Optional additional CSS classes
 * @property {string} color - Header background color
 * @property {React.ReactNode} children - Module content
 * @property {React.ReactNode} headerContent - Optional additional header content (e.g., power button)
 * @property {boolean} power - Power state of the module
 */
type BaseModuleOptions = {
  name: string;
  classNames?: string;
  color?: string;
  children?: React.ReactNode;
  headerContent?: React.ReactNode;
  power?: boolean;
};

/**
 * Styled Components
 * Define the consistent visual structure for all synth modules
 */

// Main module container with power state styling
const StyledBaseModule = styled("div")<{ power?: boolean }>(({ theme, power = true }) => ({
  padding: theme.spacing(0),
  display: "flex",
  flexDirection: "column",
  borderBottomLeftRadius: theme.spacing(0.35),
  borderBottomRightRadius: theme.spacing(0.35),
  boxShadow: theme.shadows[1],
  opacity: power ? 1 : 0.5,
  transition: 'opacity 0.2s ease-in-out',
}));

// Module header with title and optional controls
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

// Module body containing controls and displays
const StyledModuleBody = styled("div")(({ theme }) => ({
  padding: "0.5rem",
  gap: "0.5rem",
  display: "flex",
  flexDirection: "row",
  backgroundColor: "#333",
  borderBottomLeftRadius: "0.35rem",
  borderBottomRightRadius: "0.35rem",

  // Form styling for control groups
  "& form": {
    display: "flex",
    flexDirection: "row",
    gap: "0.75rem",
    fontSize: "0.75rem",

    // Label styling
    "& label": {
      fontSize: "0.65rem",
      color: "#fff",
      fontWeight: 400,
      textAlign: "left",
    },

    // Value display styling
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

    // Control group container styling
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

      // Transparent variant for special cases
      "&.transparent": {
        backgroundColor: "transparent",
        border: "none",
        boxShadow: "none",
      },

      // Section header styling
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

  // Column layout variant
  "& form.column": {
    flexDirection: "column",

    "& .control-group": {
      flexDirection: "column",
      padding: 0,
      alignItems: "flex-start",
    },
  },
}));

/**
 * BaseModule Component
 * Provides the foundation for all synthesizer modules with consistent styling and structure.
 * Features:
 * - Customizable header with title and optional controls
 * - Consistent styling for control groups and forms
 * - Power state visual feedback
 * - Accessibility attributes for navigation
 */
const BaseModule: React.FC<BaseModuleOptions> = ({
  name = "Base Module",
  color = defaultModuleContext.color,
  classNames,
  children,
  headerContent,
  power = true,
}) => {
  const theme = useTheme();

  return (
    <ModuleProvider color={color}>
      <StyledBaseModule className={classNames} power={power}>
        <StyledModuleHeader
          role="banner"
          aria-label={`${name} module header`}
          sx={{
            backgroundColor: color,
          }}
        >
          <h2>{name}</h2>
          {headerContent}
        </StyledModuleHeader>
        <StyledModuleBody role="region" aria-label={`${name} module content`}>{children}</StyledModuleBody>
      </StyledBaseModule>
    </ModuleProvider>
  );
};

export default BaseModule;
