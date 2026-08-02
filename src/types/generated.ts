// DO NOT EDIT: THIS FILE WAS GENERATED VIA A SCRIPT

import z from "zod";

export const ViewData = z.array(z.record(z.string(), z.array(z.number())));

export type ViewData = z.infer<typeof ViewData>;

export const StatusEnum = { FOUND: "found", FOUNDNT: "foundn't" } as const;

export const Status = z.enum(StatusEnum);

export type Status = z.infer<typeof Status>;

export const LecLabTypeEnum = {
	LECTURE: "lecture",
	LAB: "laboratory",
} as const;

export const LecLabType = z.enum(LecLabTypeEnum);

export type LecLabType = z.infer<typeof LecLabType>;

export const DayTime = z.object({
	day: z.string(),
	startTimeHhmm: z.string(),
	endTimeHhmm: z.string(),
});
export type DayTime = z.infer<typeof DayTime>;

export const Rating = z.object({
	prof: z.string(),
	score: z.number(),
	avg: z.number(),
	nRating: z.number(),
	takeAgain: z.number(),
	difficulty: z.number(),
	status: Status,
	pId: z.union([z.string(), z.null()]),
});
export type Rating = z.infer<typeof Rating>;

export const LecLab = z.object({
	title: z.string(),
	type: z.union([LecLabType, z.null()]),
	prof: z.string(),
	rating: z.union([Rating, z.null()]),
	dayTimes: z.array(DayTime),
});
export type LecLab = z.infer<typeof LecLab>;

export const Section = z.object({
	id: z.string(),
	course: z.string(),
	section: z.string(),
	domain: z.string(),
	code: z.string(),
	title: z.string(),
	leclabs: z.array(LecLab),
	more: z.string(),
	viewData: ViewData,
});
export type Section = z.infer<typeof Section>;

export const SectionsDiff = z.object({
	previousSectionsChanged: z.array(Section),
	sectionsAdded: z.array(z.string()),
	sectionsRemoved: z.array(Section),
});
export type SectionsDiff = z.infer<typeof SectionsDiff>;

export const GlobalAllSections = z.object({
	semester: z.string(),
	sectionsById: z.record(z.string(), Section),
	filename: z.string(),
	sectionsDiff: z.union([SectionsDiff, z.null()]),
	comments: z.array(z.string()),
});
export type GlobalAllSections = z.infer<typeof GlobalAllSections>;

export const ParsedPdf = z.object({
	semester: z.string(),
	sectionsById: z.record(z.string(), Section),
});
export type ParsedPdf = z.infer<typeof ParsedPdf>;
