import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "John Abbott College (JAC) Dream Schedule Builder",
    short_name: "JAC Dream Builder",
    description:
      "The schedule builder that John Abbott College is missing. You can create and visualize your dream schedules with all the information in one place with just a few clicks!",
    display: "standalone",
    start_url: "/",
    background_color: "#02131d",
    theme_color: "#02131d",
    icons: [
      {
        src: "/assets/logo.png",
        sizes: "any",
        type: "image/png",
      },
    ],
  };
}
