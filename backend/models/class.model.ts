import { z } from "zod";

// Using "ClassModel" to avoid conflict with the reserved keyword "class"
export interface ClassModel {
  id: number;
  name: string;
  enroll_key: string;
  schedule: number;
  start_time: string;
  end_time: string;
  created_at: string;
  updated_at: string;
}

export const createClassSchema = z.object({
  name: z.string().min(1, "Name cannot be empty"),
  schedule: z
    .number({ message: "Schedule must be a number" })
    .int()
    .min(1, "Schedule must be between 1 (Monday) and 7 (Sunday)")
    .max(7, "Schedule must be between 1 (Monday) and 7 (Sunday)"),
});
