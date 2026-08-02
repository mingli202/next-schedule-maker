// DO NOT EDIT: THIS FILE WAS GENERATED VIA A SCRIPT

import { v } from "convex/values";

export const ViewData = v.array(v.record(v.string(), v.array(v.number())));

export type ViewData = typeof ViewData.type;

export const StatusEnum = { FOUND: "found", FOUNDNT: "foundn't" } as const;

export const Status = v.union(v.literal("found"), v.literal("foundn't"));

export type Status = typeof Status.type;

export const LecLabTypeEnum = {
	LECTURE: "lecture",
	LAB: "laboratory",
} as const;

export const LecLabType = v.union(
	v.literal("lecture"),
	v.literal("laboratory"),
);

export type LecLabType = typeof LecLabType.type;

export const DayTime = v.object({
	day: v.string(),
	startTimeHhmm: v.string(),
	endTimeHhmm: v.string(),
});
export type DayTime = typeof DayTime.type;

export const Rating = v.object({
	prof: v.string(),
	score: v.number(),
	avg: v.number(),
	nRating: v.number(),
	takeAgain: v.number(),
	difficulty: v.number(),
	status: Status,
	pId: v.union(v.string(), v.null()),
});
export type Rating = typeof Rating.type;

export const LecLab = v.object({
	title: v.string(),
	type: v.union(LecLabType, v.null()),
	prof: v.string(),
	rating: v.union(Rating, v.null()),
	dayTimes: v.array(DayTime),
});
export type LecLab = typeof LecLab.type;

export const Section = v.object({
	id: v.string(),
	course: v.string(),
	section: v.string(),
	domain: v.string(),
	code: v.string(),
	title: v.string(),
	leclabs: v.array(LecLab),
	more: v.string(),
	viewData: ViewData,
});
export type Section = typeof Section.type;

export const SectionsDiff = v.object({
	previousSectionsChanged: v.array(Section),
	sectionsAdded: v.array(v.string()),
	sectionsRemoved: v.array(Section),
});
export type SectionsDiff = typeof SectionsDiff.type;

export const GlobalAllSections = v.object({
	semester: v.string(),
	sectionsById: v.record(v.string(), Section),
	filename: v.string(),
	sectionsDiff: v.union(SectionsDiff, v.null()),
	comments: v.array(v.string()),
});
export type GlobalAllSections = typeof GlobalAllSections.type;

export const ParsedPdf = v.object({
	semester: v.string(),
	sectionsById: v.record(v.string(), Section),
});
export type ParsedPdf = typeof ParsedPdf.type;
