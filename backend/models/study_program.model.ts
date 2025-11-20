import { z } from "zod";

export interface StudyProgram {
  id: number;
  major_id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export const createStudyProgramSchema = z.object({
  name: z
    .string()
    .nonempty({ message: "Name is required" })
    .min(1, "Name cannot be empty"),
});
