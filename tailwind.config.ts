import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        hutan: {
          DEFAULT: "#1d3627",
          deep: "#12251a",
          soft: "#2c4a37",
        },
        kertas: {
          DEFAULT: "#f4efdd",
          dim: "#e9e2c8",
        },
        bata: "#8b2f31",
        padi: "#f2c94c",
        lumut: "#47533f",
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans Variable"', "system-ui", "sans-serif"],
        serif: ['"Fraunces Variable"', "Georgia", "serif"],
      },
      borderRadius: {
        gapura: "999px 999px 18px 18px",
      },
    },
  },
  plugins: [],
};
export default config;
