import type { Major } from "../models/major.model";
import type { Sqlite } from "../config/database";

type MajorForCreate = Omit<Major, "id" | "created_at" | "updated_at">;
type MajorForUpdate = Partial<MajorForCreate>;

export class MajorRepository {
  private db: Sqlite;

  constructor(db: Sqlite) {
    this.db = db;
  }

  create(data: MajorForCreate): number {
    const result = this.db.query(
      "INSERT INTO major (name) VALUES (?) RETURNING id",
      data.name,
    );
    const firstResult = result[0] as { id: number | bigint };
    return firstResult.id as number;
  }

  findById(id: number): Major | null {
    const result = this.db.query(
      "SELECT * FROM major WHERE id = ?",
      id,
    ) as Major[];
    return result.length > 0 ? result[0]! : null;
  }

  all(): Major[] {
    return this.db.query("SELECT * FROM major") as Major[];
  }

  update(id: number, data: MajorForUpdate): void {
    const fields = Object.keys(data);
    if (fields.length === 0) {
      return;
    }

    const setClause = fields.map((field) => `${field} = ?`).join(", ");
    const values = fields.map((field) => (data as any)[field]);
    values.push(id); // Add ID for WHERE clause

    this.db.query(
      `UPDATE major SET ${setClause}, updated_at = STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW') WHERE id = ?`,
      ...values,
    );
  }

  delete(id: number): void {
    this.db.query("DELETE FROM major WHERE id = ?", id);
  }
}
