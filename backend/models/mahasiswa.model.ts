import { z } from "zod";

export interface Mahasiswa {
  id: number;
  major_id: number;
  study_program_id: number;
  nim: string;
  name: string;
  email: string;
  username: string;
  password: string;
  created_at: string;
  updated_at: string;
}

export const createMahasiswaSchema = z.object({
  nim: z.string().min(1, "NIM cannot be empty"),
  name: z.string().min(1, "Name cannot be empty"),
  major_id: z.number().int().positive(),
  study_program_id: z.number().int().positive(),
  email: z.string().email("Invalid email format"),
  username: z.string().min(1, "Username cannot be empty"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const updateMahasiswaSchema = createMahasiswaSchema.partial();
