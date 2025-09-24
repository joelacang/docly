import { Mode } from "@/types";
import { Color } from "@prisma/client";

export type ColorPalette = {
  lightest: string; // Very light background/surface
  light: string; // Light background/hover states
  primary: string; // Main/primary color
  dark: string; // Darker variant for emphasis
  darkest: string; // Darkest variant/text on light
  accent: string; // Complementary accent color
};

export const Colors: Record<Color, ColorPalette> = {
  BLUE: {
    lightest: "#EFF6FF",
    light: "#DBEAFE",
    primary: "#3B82F6",
    dark: "#1D4ED8",
    darkest: "#1E3A8A",
    accent: "#60A5FA",
  },
  RED: {
    lightest: "#FEF2F2",
    light: "#FEE2E2",
    primary: "#EF4444",
    dark: "#C53030",
    darkest: "#7F1D1D",
    accent: "#F87171",
  },
  TEAL: {
    lightest: "#F0FDFA",
    light: "#CCFBF1",
    primary: "#14B8A6",
    dark: "#0F766E",
    darkest: "#115E59",
    accent: "#5EEAD4",
  },
  ORANGE: {
    lightest: "#FFF7ED",
    light: "#FFEDD5",
    primary: "#F97316",
    dark: "#C2410C",
    darkest: "#7C2D12",
    accent: "#FDBA74",
  },
  PINK: {
    lightest: "#FDF2F8",
    light: "#FCE7F3",
    primary: "#EC4899",
    dark: "#BE185D",
    darkest: "#831843",
    accent: "#F9A8D4",
  },
  PURPLE: {
    lightest: "#FAF5FF",
    light: "#EDE9FE",
    primary: "#8B5CF6",
    dark: "#7C3AED",
    darkest: "#4C1D95",
    accent: "#C4B5FD",
  },
  GREEN: {
    lightest: "#F0FDF4",
    light: "#DCFCE7",
    primary: "#22C55E",
    dark: "#15803D",
    darkest: "#14532D",
    accent: "#86EFAC",
  },
  CYAN: {
    lightest: "#ECFEFF",
    light: "#CFFAFE",
    primary: "#06B6D4",
    dark: "#0E7490",
    darkest: "#164E63",
    accent: "#67E8F9",
  },
  GRAY: {
    lightest: "#F9FAFB",
    light: "#F3F4F6",
    primary: "#6B7280",
    dark: "#374151",
    darkest: "#111827",
    accent: "#9CA3AF",
  },
  INDIGO: {
    lightest: "#EEF2FF",
    light: "#E0E7FF",
    primary: "#6366F1",
    dark: "#4338CA",
    darkest: "#312E81",
    accent: "#A5B4FC",
  },
  YELLOW: {
    lightest: "#FFFBEB",
    light: "#FEF3C7",
    primary: "#F59E0B",
    dark: "#D97706",
    darkest: "#92400E",
    accent: "#7C3AED",
  },
};

export const FOREGROUND_LIGHT: ColorPalette = {
  lightest: "#1F2937", // Primary text
  light: "#374151", // Secondary text
  primary: "#111827", // Emphasis text
  dark: "#6B7280", // Muted text
  darkest: "#9CA3AF", // Disabled text
  accent: "#3B82F6", // Accent text
};

export const FOREGROUND_DARK: ColorPalette = {
  lightest: "#F9FAFB", // Primary text
  light: "#F3F4F6", // Secondary text
  primary: "#FFFFFF", // Emphasis text
  dark: "#D1D5DB", // Muted text
  darkest: "#9CA3AF", // Disabled text
  accent: "#60A5FA", // Accent text
};

export const BACKGROUND_LIGHT: ColorPalette = {
  lightest: "#EFF6FF",
  light: "#DBEAFE",
  primary: "#3B82F6",
  dark: "#1D4ED8",
  darkest: "#1E3A8A",
  accent: "#60A5FA",
};

export const BACKGROUND_DARK: ColorPalette = {
  lightest: "#1F2937", // Lightest dark surface
  light: "#374151", // Card backgrounds
  primary: "#111827", // Main background
  dark: "#0F172A", // Darker sections
  darkest: "#020617", // Deepest backgrounds
  accent: "#1E40AF", // Accent backgrounds
};
// Helper function to get color values
export const getColorValue = (
  color: Color,
  shade: keyof ColorPalette,
): string => {
  return Colors[color][shade];
};

export function getModeColor(mode: Mode): Color {
  switch (mode) {
    case Mode.INFO:
      return Color.BLUE;
    case Mode.SUCCESS:
      return Color.GREEN;
    case Mode.DEFAULT:
      return Color.GRAY;
    case Mode.ERROR:
      return Color.RED;
    case Mode.HELP:
      return Color.TEAL;
    default:
      return Color.GRAY;
  }
}
