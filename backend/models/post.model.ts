import { z } from "zod";

export type PostType = "post" | "task";

export interface Post {
  id: number;
  class_id: number;
  class_enrollment_id: number;
  file_id: number | null;
  message: string | null;
  type: PostType;
  created_at: string;
  updated_at: string;
}

export const createPostSchema = z.object({
  title: z.string().min(1, "Title cannot be empty"),
  message: z.string().min(1, "Message cannot be empty"),
  type: z.enum(["post", "task"]),
});
