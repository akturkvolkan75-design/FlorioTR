export const themes = {
  florio: {
    name: "Florio Sunshine",

    colors: {
      background: "#FFFEF8",
      foreground: "#403B30",
      muted: "#81796B",

      card: "#FFFFFF",
      cardBorder: "#F1DEA1",

      primary: "#F1D36B",
      primaryHover: "#E7C451",

      secondary: "#FFF9DC",
      secondaryHover: "#FFF2BD",

      accent: "#E8C15C",
      accentHover: "#D7A93B",
      accentSoft: "#FFF4C9",

      actionPrimary: "#F2D46D",
      actionPrimaryHover: "#E6C552",
      actionPrimaryText: "#463B20",

      actionSecondary: "#FFFBEA",
      actionSecondaryHover: "#FFF3C4",
      actionSecondaryText: "#4A4130",

      surfaceSoft: "#FFFDF3",
      surfaceStrong: "#F8EAB5",

      // ÜRÜN YAZILARI
      productTitle: "#4B3B21",
      productDescription: "#81745C",
      productPrice: "#C89425",

      success: "#6E9070",
      warning: "#E8C15C",
      danger: "#C65B5B",
    },
  },

  night: {
    name: "Florio Night",

    colors: {
      background: "#0D2521",
      foreground: "#FFF7EE",
      muted: "#C4B8AE",

      card: "#16352F",
      cardBorder: "#7E6945",

      primary: "#E3B866",
      primaryHover: "#F0C978",

      secondary: "#1C4038",
      secondaryHover: "#285047",

      accent: "#D98CA2",
      accentHover: "#E9A3B6",
      accentSoft: "#563A43",

      actionPrimary: "#E3B866",
      actionPrimaryHover: "#F0C978",
      actionPrimaryText: "#173029",

      actionSecondary: "#21453D",
      actionSecondaryHover: "#2D594F",
      actionSecondaryText: "#FFF7EE",

      surfaceSoft: "#122E29",
      surfaceStrong: "#24483F",

      // ÜRÜN YAZILARI
      productTitle: "#FFF6E8",
      productDescription: "#CDBFAE",
      productPrice: "#F0C978",

      success: "#6EB39C",
      warning: "#E3B866",
      danger: "#E07A88",
    },
  },
} as const;

export type ThemeName = keyof typeof themes;