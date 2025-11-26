import type { Class } from "../models/class.model";
import type { Sqlite } from "../config/database";

type ClassForCreate = Omit<
  Class,
  "id" | "created_at" | "updated_at" | "activated_at" | "enroll_key"
>;

export class ClassRepository {
  private db: Sqlite;

  constructor(db: Sqlite) {
    this.db = db;
  }

  create(classData: ClassForCreate, enrollKey: string): number {
    const result = this.db.query(
      `INSERT INTO class (name, schedule, start_time, end_time, enroll_key)
       VALUES (?, ?, ?, ?, ?) RETURNING id`,
      classData.name,
      classData.schedule,
      classData.start_time,
      classData.end_time,
      enrollKey,
    );
    const firstResult = result[0] as { id: number | bigint };
    return firstResult.id as number;
  }

  createWithActivationDate(
    classData: Omit<Class, "id" | "created_at" | "updated_at" | "enroll_key">,
    enrollKey: string,
  ): number {
    const result = this.db.query(
      `INSERT INTO class (name, schedule, start_time, end_time, enroll_key, activated_at)
       VALUES (?, ?, ?, ?, ?, ?) RETURNING id`,
      classData.name,
      classData.schedule,
      classData.start_time,
      classData.end_time,
      enrollKey,
      classData.activated_at,
    );
    const firstResult = result[0] as { id: number | bigint };
    return firstResult.id as number;
  }

  all(page: number = 1, limit: number = 10): Class[] {
    const offset = (page - 1) * limit;
    return this.db.query(
      "SELECT * FROM class LIMIT ? OFFSET ?",
      limit,
      offset,
    ) as Class[];
  }

  findById(id: number): Class | null {
    const result = this.db.query(
      "SELECT * FROM class WHERE id = ?",
      id,
    ) as Class[];
    return result.length > 0 ? result[0]! : null;
  }

  findByEnrollKey(enrollKey: string): Class | null {
    const result = this.db.query(
      "SELECT * FROM class WHERE enroll_key = ?",
      enrollKey,
    ) as Class[];
    return result.length > 0 ? result[0]! : null;
  }

  findByIds(ids: number[], day?: number): Class[] {
    if (ids.length === 0) {
      return [];
    }
    const placeholders = ids.map(() => "?").join(",");
    let query = `SELECT * FROM class WHERE id IN (${placeholders})`;
    const params: (number | string)[] = [...ids];

    if (day !== undefined) {
      query += " AND schedule = ?";
      params.push(day);
    }

    return this.db.query(query, ...params) as Class[];
  }

  update(id: number, classData: Partial<ClassForCreate>): void {
    const fields = Object.keys(classData);
    if (fields.length === 0) {
      return;
    }

    const setClause = fields.map((field) => `${field} = ?`).join(", ");
    const values = fields.map((field) => (classData as any)[field]);
    values.push(id);

    this.db.query(
      `UPDATE class SET ${setClause}, updated_at = STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW') WHERE id = ?`,
      ...values,
    );
  }

  delete(id: number): void {
    this.db.query("DELETE FROM class WHERE id = ?", id);
  }
}
