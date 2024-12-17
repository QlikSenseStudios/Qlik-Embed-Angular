/** @type {import('tailwindcss').Config} */

const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./src/**/*.{html,ts}"],
  darkMode: "class",
  theme: {
    colors: {
      // Material colors
      primary: "var(--sys-primary)",
      "on-primary": "var(--sys-on-primary)",
      "primary-container": "var(--sys-primary-container)",
      "on-primary-container": "var(--sys-on-primary-container)",
      secondary: "var(--sys-secondary)",
      "on-secondary": "var(--sys-on-secondary)",
      "secondary-container": "var(--sys-secondary-container)",
      "on-secondary-container": "var(--sys-on-secondary-container)",
      tertiary: "var(--sys-tertiary)",
      "on-tertiary": "var(--sys-on-tertiary)",
      "tertiary-container": "var(--sys-tertiary-container)",
      "on-tertiary-container": "var(--sys-on-tertiary-container)",
      error: "var(--sys-error)",
      "on-error": "var(--sys-on-error)",
      "error-container": "var(--sys-error-container)",
      "on-error-container": "var(--sys-on-error-container)",
      background: "var(--sys-background)",
      "on-background": "var(--sys-on-background)",
      surface: "var(--sys-surface)",
      "on-surface": "var(--sys-on-surface)",
      "surface-variant": "var(--sys-surface-variant)",
      "on-surface-variant": "var(--sys-on-surface-variant)",
      "inverse-surface": "var(--sys-inverse-surface)",
      outline: "var(--sys-outline)",
      "outline-variant": "var(--sys-outline-variant)",
      "surface-container": "var(--sys-surface-container)",
      "surface-container-high": "var(--sys-surface-container-high)",

      // Tailwind colors
      gray: colors.gray,
      white: colors.white,
      blue: colors.blue,
    },
    extend: {},
  },
  plugins: [require("@tailwindcss/typography")],
};

//
