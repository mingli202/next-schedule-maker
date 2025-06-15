import { Fraunces, Poppins } from "next/font/google";

// headings
export const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--fraunces",
});

// body text
export const poppins = Poppins({
  weight: ["100", "400", "700"],
  subsets: ["latin"],
  variable: "--poppins",
});
