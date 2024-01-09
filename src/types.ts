import { AuthError, UserCredential } from "firebase/auth";

export type AuthType =
  | {
      info: UserCredential;
      status: "success";
    }
  | {
      info: AuthError;
      status: "error";
    };

export type SharedCurrentClasses = {
  id: string;
  bgColor?: string;
  textColor?: string;
};

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

export type UserType = {
  email: string;
  uid: string;
  name?: string;
  schedules?: Saved[];
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
  id: number;
  data: Class[];
  name?: string;
};
