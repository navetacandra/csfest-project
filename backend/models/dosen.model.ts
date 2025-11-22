import { z } from "zod";

export interface Dosen {
  id: number;
  nip: string;
  name: string;
  username: string;
  password?: string;
  created_at: string;
  updated_at: string;
}

export const createDosenSchema = z.object({
  nip: z.string().min(1, "NIP cannot be empty"),
  name: z.string().min(1, "Name cannot be empty"),
});

export const updateDosenSchema = createDosenSchema;
