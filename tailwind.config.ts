import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#24302f",
        meadow: "#1784a1",
        leaf: "#8bbf66",
        honey: "#f6bd45",
        coral: "#f46f56",
        linen: "#fff7ea",
        sky: "#1784a1",
        berry: "#a04ea6",
        mint: "#c9f2dd",
        sunshine: "#ffe48a"
      },
      boxShadow: {
        soft: "0 18px 48px rgba(36, 48, 47, 0.12)",
        joyful: "0 24px 70px rgba(244, 111, 86, 0.18), 0 12px 34px rgba(33, 124, 102, 0.16)"
      }
    }
  },
  plugins: []
};

export default config;
