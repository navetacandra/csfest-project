import type { Presence } from "../models/presence.model";
import type { Sqlite } from "../config/database";

type PresenceForCreate = Omit<Presence, "id" | "created_at" | "updated_at">;

export class PresenceRepository {
  private db: Sqlite;

  constructor(db: Sqlite) {
    this.db = db;
  }

  create(data: PresenceForCreate): number {
    const result = this.db.query(
      "INSERT INTO presence (class_enrollment_id, schedule_date, status, late_time) VALUES (?, ?, ?, ?) RETURNING id",
      data.class_enrollment_id,
      data.schedule_date,
      data.status,
      data.late_time,
    );
    const firstResult = result[0] as { id: number | bigint };
    return firstResult.id as number;
  }

  findById(id: number): Presence | null {
    const result = this.db.query(
      "SELECT * FROM presence WHERE id = ?",
      id,
    ) as Presence[];
    return result.length > 0 ? result[0]! : null;
  }

  findByClassEnrollmentId(classEnrollmentId: number): Presence[] {
    return this.db.query(
      "SELECT * FROM presence WHERE class_enrollment_id = ?",
      classEnrollmentId,
    ) as Presence[];
  }

  findByClass(classId: number): any[] {
    const query = `
      SELECT p.*, ce.mahasiswa_id
      FROM presence p
      INNER JOIN class_enrollment ce ON p.class_enrollment_id = ce.id
      WHERE ce.class_id = ?
    `;
    return this.db.query(query, classId) as any[];
  }

  findByEnrollmentIds(enrollmentIds: number[]): any[] {
    if (enrollmentIds.length === 0) {
      return [];
    }
    const placeholders = enrollmentIds.map(() => "?").join(",");
    const query = `
      SELECT p.id, p.status, p.late_time, p.schedule_date, p.class_enrollment_id, c.id as class_id, c.name as class_name
      FROM presence p
      JOIN class_enrollment ce ON p.class_enrollment_id = ce.id
      JOIN class c ON ce.class_id = c.id
      WHERE p.class_enrollment_id IN (${placeholders})
    `;
    return this.db.query(query, ...enrollmentIds);
  }

  delete(id: number): void {
    this.db.query("DELETE FROM presence WHERE id = ?", id);
  }

  findByEnrollmentIdAndDate(
    enrollmentId: number,
    date: string,
  ): Presence | null {
    const result = this.db.query(
      "SELECT * FROM presence WHERE class_enrollment_id = ? AND schedule_date = ?",
      enrollmentId,
      date,
    ) as Presence[];
    return result.length > 0 ? result[0]! : null;
  }

  update(
    id: number,
    data: Partial<Omit<Presence, "id" | "created_at" | "updated_at">>,
  ): void {
    const fields = Object.keys(data);
    if (fields.length === 0) {
      return;
    }

    const setClause = fields.map((field) => `${field} = ?`).join(", ");
    const values = fields.map((field) => (data as any)[field]);
    values.push(id);

    this.db.query(
      `UPDATE presence SET ${setClause}, updated_at = STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW') WHERE id = ?`,
      ...values,
    );
  }

  createOrUpdateMany(
    presences: {
      class_enrollment_id: number;
      schedule_date: string;
      status: "hadir" | "sakit" | "izin" | "alpha";
      late_time: number;
    }[],
  ): void {
    for (const p of presences) {
      const existing = this.findByEnrollmentIdAndDate(
        p.class_enrollment_id,
        p.schedule_date,
      );
      if (existing) {
        this.update(existing.id, {
          status: p.status,
          late_time: p.late_time,
        });
      } else {
        this.create(p);
      }
    }
  }

  findByMahasiswaIdAndClassId(
    mahasiswaId: number,
    classId: number,
  ): Presence[] {
    const query = `
      SELECT p.*
      FROM presence p
      INNER JOIN class_enrollment ce ON p.class_enrollment_id = ce.id
      WHERE ce.mahasiswa_id = ? AND ce.class_id = ?
    `;
    return this.db.query(query, mahasiswaId, classId) as Presence[];
  }
}
