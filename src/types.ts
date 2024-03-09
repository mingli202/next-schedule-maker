import { Dispatch, SetStateAction } from "react";

export type UserPublic = {
  email: string;
  name: string;
  uid: string;
  schedules?: Record<string, Saved>;
  visible?: boolean;
};

export type SharedCurrentClasses = {
  id: string;
  bgColor?: string;
  textColor?: string;
};

export type StateType =
  | {
      type: "dispatch";
      dispatch: Dispatch<ActionType>;
    }
  | {
      type: "setStateAction";
      dispatch: Dispatch<SetStateAction<SharedCurrentClasses[]>>;
    }
  | "none";

export type ActionType =
  | {
      type: "add";
      cl: SharedCurrentClasses;
    }
  | {
      type: "delete";
      id: string;
    }
  | {
      type: "set";
      schedule: SharedCurrentClasses[];
    };

export type Class = {
  count: number;
  program: string;
  course: string;
  code: string;
  codeHeader: string;
  section: string;
  disc: string;
  lecture: {
    prof: string;
    title: string;
    rating: Rating;
  };
  lab: {
    prof: string;
    title: string;
    rating: Rating;
  };
  more: string;
  viewData: Time[];
};

export type Rating = {
  prof: string;
  score: number;
  avg: number;
  nRating: number;
  takeAgain: number;
  difficulty: number;
  status: string;
};

export type Time = {
  "1"?: number[];
  "2"?: number[];
  "3"?: number[];
  "4"?: number[];
  "5"?: number[];
};

export type Saved = {
  id?: string;
  data?: SharedCurrentClasses[];
  name?: string;
  semester?: "winter" | "fall";
};
