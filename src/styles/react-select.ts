import type { SearchOption } from "@/types";

import { useTheme } from "next-themes";
import type { StylesConfig } from "react-select";

const useSelectStyles = <T>() => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const background = isDarkMode ? "#0a0a0a" : "#f8f8f8";
  const foreground = isDarkMode ? "#d6d8d9" : "#0a0a0a";
  const card = isDarkMode ? "oklch(0.205 0 0)" : "#ffffff";
  const cardForeground = isDarkMode ? "#d6d8d9" : "#0a0a0a";
  const primary = "#0089d7";
  const primaryForeground = isDarkMode ? "#edeff0" : "#fafafa";
  const muted = isDarkMode ? "#262626" : "#f5f5f5";
  const mutedForeground = isDarkMode ? "#a1a1a1" : "#737373";
  const destructive = isDarkMode ? "#82181a" : "#e7000b";
  const input = isDarkMode ? "#262626" : "#e5e5e5";
  const ring = isDarkMode ? "#525252" : "#a1a1a1";
  return {
    control: (base, state) => ({
      ...base,
      display: "flex",
      minWidth: 0,
      width: "100%",
      fontSize: 14, // base text size, md:text-sm is 14px
      fontWeight: 400,

      backgroundColor: isDarkMode ? `${input}80` : "transparent",
      color: destructive,
      borderRadius: "0.375rem",
      border: `1.5px solid ${input}`,
      transition: "color 0.3s, box-shadow 0.3s",
      outline: "none",
      paddingLeft: 4,
      paddingTop: 4,
      paddingBottom: 4,
      ":focus-visible": {
        border: ring,
        boxShadow: `0 0 0 3px ${ring}`,
      },

      "::selection": {
        backgroundColor: primary,
        color: primaryForeground,
      },
      pointerEvents: state.isDisabled ? "none" : "auto",
      cursor: state.isDisabled ? "not-allowed" : "default",
      opacity: state.isDisabled ? 0.5 : 1,
      "::placeholder": {
        color: mutedForeground,
      },
    }),
    input: (base, state) => ({
      ...base,
      color: foreground,
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: muted,
      border: `1px solid ${input}`,
      boxShadow: `0 1px 3px rgba(0, 0, 0, 0.1)`, // subtle shadow
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: mutedForeground,
      fontWeight: "600",
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: mutedForeground,
      cursor: "pointer",
      ":hover": {
        backgroundColor: destructive,
        color: primaryForeground,
      },
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? primary : background,
      color: state.isFocused ? primaryForeground : foreground,
      cursor: "pointer",
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: card,
      borderRadius: "0.625rem", // same as your --radius
      boxShadow: isDarkMode
        ? "0 4px 6px rgba(0, 0, 0, 0.9)"
        : "0 4px 6px rgba(0, 0, 0, 0.1)",
    }),
  } as StylesConfig<T, boolean>;
};

export default useSelectStyles;
