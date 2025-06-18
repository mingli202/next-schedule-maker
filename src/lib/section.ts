import { z } from "zod/v4";

export const ViewData = z.array(
  z.record(z.number().min(1).max(5), z.array(z.number().min(1).max(20))),
);
export type ViewData = z.infer<typeof ViewData>;

export const Time = z.record(
  z.enum<string[]>(["M", "T", "W", "R", "F"]),
  z.array(z.string()),
);
export type Time = z.infer<typeof Time>;

export class Rating {
  score: number = 0;
  avg: number = 0;
  nRating: number = 0;
  takeAgain: number = 0;
  difficulty: number = 0;
  status: "found" | "foundn't" = "foundn't";
  prof: string = "";
}

class LecLab {
  title: string = "";
  prof: string = "";
  time: Time = {};
  rating?: Rating;
}

export class Section {
  program: string = "";
  count: number = 0;
  section: string = "";
  course: string = "";
  code: string = "";
  lecture?: LecLab;
  lab?: LecLab;
  more: string = "";
  viewData: ViewData = [];

  public getTimes(time?: "lecture" | "lab"): string[][] {
    let times: string[][] = [];

    if ((!time || time === "lecture") && this.lecture) {
      const time = Object.entries(this.lecture.time).flatMap(([d, ts]) =>
        ts.map((t) => [d, t]),
      );
      times = [...times, ...time];
    }

    if ((!time || time === "lab") && this.lab) {
      const time = Object.entries(this.lab.time).flatMap(([d, ts]) =>
        ts.map((t) => [d, t]),
      );
      times = [...times, ...time];
    }

    return times;
  }
}
