import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/ui/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bgPrimary: "#02131d",
        bgSecondary: "#062c43",
        primary: "#9ccddc",
        secondary: "#054569",
        third: "#5591a9",
        slate: "#ced7e0",
        text: "#e2f1ff",
      },
      fontFamily: {
        heading: "var(--fraunces)",
        body: "var(--poppins)",
      },
    },
  },
  plugins: [],
};
export default config;
