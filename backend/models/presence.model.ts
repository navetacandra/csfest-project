import { z } from "zod";

export type PresenceStatus = "hadir" | "sakit" | "izin" | "alpha";
const presenceStatusEnum = z.enum(["hadir", "sakit", "izin", "alpha"]);

export interface Presence {
  id: number;
  class_enrollment_id: number;
  status: PresenceStatus;
  late_time: number;
  created_at: string;
  updated_at: string;
}

export const setPresenceSchema = z.object({
  status: presenceStatusEnum,
  mahasiswa_id: z.number().int().positive().optional(),
  late_time: z.number().int().min(0).optional(),
});
