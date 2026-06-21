import type { DayTime, LecLab, Rating } from "src/types/generated";

export const ratingFrom = (
  prof: string,
  avg: number,
  score: number,
  status: Rating["status"] = "found",
): Rating => ({
  prof,
  score,
  avg,
  nRating: 10,
  takeAgain: 60,
  difficulty: 3,
  status,
  pId: null,
});

export function dayTimeFrom(
  _id: number,
  _leclabId: number,
  day: string,
  start: string,
  end: string,
): DayTime;
export function dayTimeFrom(day: string, start: string, end: string): DayTime;
export function dayTimeFrom(...args: unknown[]): DayTime {
  if (args.length === 3) {
    const [day, start, end] = args as [string, string, string];
    return {
      day,
      startTimeHhmm: start,
      endTimeHhmm: end,
    };
  }

  const [, , day, start, end] = args as [number, number, string, string, string];
  return {
    day,
    startTimeHhmm: start,
    endTimeHhmm: end,
  };
}

export function leclabFrom(
  id: number,
  _sectionId: number,
  prof: string,
  rating: Rating | null,
  dayTimes: DayTime[],
): LecLab;
export function leclabFrom(
  title: string,
  type: LecLab["type"],
  prof: string,
  dayTimes: DayTime[],
): LecLab;
export function leclabFrom(...args: unknown[]): LecLab {
  if (args.length === 4) {
    const [title, type, prof, dayTimes] = args as [
      string,
      LecLab["type"],
      string,
      DayTime[],
    ];
    return {
      title,
      type,
      prof,
      rating: null,
      dayTimes,
    };
  }

  const [id, , prof, rating, dayTimes] = args as [
    number,
    number,
    string,
    Rating | null,
    DayTime[],
  ];
  return {
    title: `L${id}`,
    type: "lecture",
    prof,
    rating,
    dayTimes,
  };
}
