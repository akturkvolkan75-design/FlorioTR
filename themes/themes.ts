export const themes = {
  florio: {
    name: "FlorioTR Premium",

    colors: {
      background: "#F8F3E8",

      foreground: "#17382F",

      muted: "#6E6658",


      card: "#FFFDF7",

      cardBorder: "#D8B56A",


      actionPrimary: "#075E4B",

      actionPrimaryText: "#FFF9E8",


      actionSecondary: "#EFD9A6",

      actionSecondaryText: "#17382F",


      primary: "#075E4B",

      secondary: "#FFFDF7",


      accent: "#D89B3C",
    },
  },
} as const;


export type ThemeName =
  keyof typeof themes;