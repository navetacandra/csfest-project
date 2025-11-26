import { z } from "zod";

export interface Class {
  id: number;
  name: string;
  enroll_key: string;
  schedule: number;
  start_time: string;
  end_time: string;
  activated_at: string;
  created_at: string;
  updated_at: string;
}

export const createClassSchema = z.object({
  name: z.string().min(1, "Name cannot be empty"),
  schedule: z
    .number({ message: "Schedule must be a number" })
    .int()
    .min(0, "Schedule must be between 0 (Sunday) and 6 (Saturday)")
    .max(6, "Schedule must be between 0 (Sunday) and 6 (Saturday)"),
  start_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  end_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
});

export const updateClassSchema = createClassSchema.partial();
