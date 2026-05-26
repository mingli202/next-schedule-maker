export type Code = {
  code: string;
  professors?: string[];
  ratingRange?: { from?: number; to?: number };
  scoreRange?: { from?: number; to?: number };
};
