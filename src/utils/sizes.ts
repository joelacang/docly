import { SIZE } from "@/types";
import type { Color } from "@prisma/client";

export const getAvatarSize = (size: SIZE) => {
  switch (size) {
    case SIZE.MICRO:
      return "size-5";
    case SIZE.SMALL:
      return "size-8";
    case SIZE.MEDIUM:
      return "size-12";
    case SIZE.LARGE:
      return "size-16";
    case SIZE.XLARGE:
      return "size-24";
  }
};

export const getAvatarText = (size: SIZE) => {
  switch (size) {
    case SIZE.MICRO:
      return "text-xs";
    case SIZE.SMALL:
      return "text-lg";
    case SIZE.MEDIUM:
      return "text-2xl";
    case SIZE.LARGE:
      return "text-4xl";
    case SIZE.XLARGE:
      return "text-6xl";
  }
};
