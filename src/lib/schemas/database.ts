import { z } from "zod/v4";
import { ViewData } from "./pdf";

export const ScheduleData = z.object({
  data: z.array(ViewData),
  name: z.string(),
  semester: z.literal("fall2025"),
});

export const Database = z.object({
  users: z.record(
    z.string(),
    z.object({
      schedules: ScheduleData,
    }),
  ),
});
