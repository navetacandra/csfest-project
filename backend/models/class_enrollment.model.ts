import { z } from "zod";

export interface ClassEnrollment {
  id: number;
  class_id: number;
  mahasiswa_id: number | null;
  dosen_id: number | null;
  admin_id: number | null;
  created_at: string;
  updated_at: string;
}

export const enrollClassSchema = z.object({
  enroll_key: z.string().min(1, "Enrollment key cannot be empty"),
});
