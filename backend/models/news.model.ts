import { z } from "zod";

export interface News {
  id: number;
  title: string;
  thumbnail_file_id: number;
  content: string;
  created_at: string;
  updated_at: string;
}

export const createNewsSchema = z.object({
  title: z.string().min(1, "Title cannot be empty"),
  content: z.string().min(1, "Content cannot be empty"),
  thumbnail_file_id: z.number().int(),
});

export const updateNewsSchema = createNewsSchema.partial();
