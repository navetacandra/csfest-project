import { z } from "zod";

export interface Admin {
  id: number;
  name: string;
  username: string;
  password: string;
  created_at: string;
  updated_at: string;
}

export const adminSchema = z.object({
  name: z.string().min(1),
  username: z.string().min(1),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});
