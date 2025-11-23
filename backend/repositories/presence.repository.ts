import { sqlite } from "..";
import type { Presence } from "../models/presence.model";

type PresenceForCreate = Omit<Presence, "id" | "created_at" | "updated_at">;

export class PresenceRepository {
  create(data: PresenceForCreate) {
    const result = sqlite.query(
      "INSERT INTO presence (class_enrollment_id, schedule_date, status, late_time) VALUES ($class_enrollment_id, $schedule_date, $status, $late_time) RETURNING id",
      {
        $class_enrollment_id: data.class_enrollment_id,
        $schedule_date: data.schedule_date,
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

  findByEnrollmentIds(enrollmentIds: number[]) {
    if (enrollmentIds.length === 0) {
      return [];
    }
    const placeholders = enrollmentIds.map(() => '?').join(',');
    const query = `
      SELECT p.id, p.status, p.late_time, p.class_enrollment_id, c.id as class_id, c.name as class_name
      FROM presence p
      JOIN class_enrollment ce ON p.class_enrollment_id = ce.id
      JOIN class c ON ce.class_id = c.id
      WHERE p.class_enrollment_id IN (${placeholders})
    `;
    return sqlite.query(query, enrollmentIds) as any[];
  }

  delete(id: number) {
    sqlite.query("DELETE FROM presence WHERE id = ?", [id]);
  }
  
  findByEnrollmentIdAndDate(enrollmentId: number, date: string) {
    const result = sqlite.query(
      "SELECT * FROM presence WHERE class_enrollment_id = ? AND schedule_date = ?",
      [enrollmentId, date]
    ) as Presence[];
    return result.length > 0 ? result[0] : null;
  }
  
  update(id: number, data: Partial<Omit<Presence, 'id' | 'created_at' | 'updated_at'>>) {
    const fields = Object.keys(data)
      .map((key) => `${key} = ?`)
      .join(", ");
    if (fields.length === 0) {
      return;
    }
    const values = Object.values(data);
    sqlite.query(
      `UPDATE presence SET ${fields}, updated_at = STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW') WHERE id = ?`,
      [...values, id]
    );
  }
}
