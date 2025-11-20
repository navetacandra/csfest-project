import { z } from "zod";

export interface Major {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export const createMajorSchema = z.object({
  name: z
    .string()
    .nonempty({ message: "Name is required" })
    .min(1, "Name cannot be empty"),
});
