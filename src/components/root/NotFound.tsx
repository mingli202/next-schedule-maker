"use client";

import { Link } from "@tanstack/react-router";

export function NotFound() {
  return (
    <div className="flex h-dvh w-dvw flex-col items-center justify-center">
      <h1 className="font-heading text-3xl font-bold">Route not found :(</h1>
      <Link to="/">Back to home page</Link>
      <div className="text-center">
        Want to fix it yourself? Consider contributing!{" "}
        <a
          className="text-primary underline"
          href="https://github.com/mingli202/next-schedule-maker?tab=readme-ov-file#contributing"
        >
          README
        </a>
      </div>
    </div>
  );
}
