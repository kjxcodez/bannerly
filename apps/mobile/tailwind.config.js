/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        cream: "#FAF6EE",
        "cream-deep": "#F2ECDD",
        ink: "#2B2621",
        "ink-muted": "#6B5F52",
        coral: "#E8623D",
        "coral-pressed": "#C94F2E",
        "coral-tint": "#FBE4DA",
        gold: "#C99A3A",
        "gold-tint": "#F6EBD2",
        border: "#E4DBC9",
        success: "#4A7A5E",
        error: "#B14538",
      },
      borderRadius: {
        lg: "8px", // chips
        xl: "12px", // buttons
        "2xl": "16px", // cards
      },
      fontFamily: {
        fraunces: ["Fraunces-SemiBold"],
        inter: ["Inter-Regular"],
        "inter-medium": ["Inter-Medium"],
        "inter-semibold": ["Inter-SemiBold"],
      },
    },
  },
  plugins: [],
};
