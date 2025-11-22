import { sqlite } from "..";
import type { Presence } from "../models/presence.model";

type PresenceForCreate = Omit<Presence, "id" | "created_at" | "updated_at">;

export class PresenceRepository {
  create(data: PresenceForCreate) {
    const result = sqlite.query(
      "INSERT INTO presence (class_enrollment_id, status, late_time) VALUES ($class_enrollment_id, $status, $late_time) RETURNING id",
      {
        $class_enrollment_id: data.class_enrollment_id,
        $status: data.status,
        $late_time: data.late_time,
      },
    );
    const firstResult = result[0] as { id: number | bigint };
    return firstResult.id;
  }

  findById(id: number) {
    const result = sqlite.query("SELECT * FROM presence WHERE id = ?", [
      id,
    ]) as Presence[];
    return result.length > 0 ? result[0] : null;
  }

  findByClassEnrollmentId(classEnrollmentId: number) {
    return sqlite.query(
      "SELECT * FROM presence WHERE class_enrollment_id = ?",
      [classEnrollmentId],
    ) as Presence[];
  }

  findByClass(classId: number) {
    const query = `
      SELECT p.*
      FROM presence p
      INNER JOIN class_enrollment ce ON p.class_enrollment_id = ce.id
      WHERE ce.class_id = ?
    `;
    return sqlite.query(query, [classId]) as Presence[];
  }

  delete(id: number) {
    sqlite.query("DELETE FROM presence WHERE id = ?", [id]);
  }
}
