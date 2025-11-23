import { Sqlite } from "../config/database";
import type { Admin } from "../models/admin.model";

export class AdminRepository {
  private db: Sqlite;

  constructor(db: Sqlite) {
    this.db = db;
  }

  create(data: Omit<Admin, "id" | "created_at" | "updated_at">): number {
    const { name, username, password } = data;
    const result = this.db.query(
      `INSERT INTO admin (name, username, password) VALUES (?, ?, ?) RETURNING id`,
      name,
      username,
      password,
    );

    const firstResult = result[0] as { id: number | bigint };
    return firstResult.id as number;
  }

  findById(id: number): Admin | null {
    const result = this.db.query(
      `SELECT id, name, username, password, created_at, updated_at FROM admin WHERE id = ? LIMIT 1`,
      id,
    ) as Admin[];

    return result.length > 0 ? result[0]! : null;
  }

  findByUsername(username: string): Admin | null {
    const result = this.db.query(
      `SELECT id, name, username, password, created_at, updated_at FROM admin WHERE username = ? LIMIT 1`,
      username,
    ) as Admin[];

    return result.length > 0 ? result[0]! : null;
  }

  all(page: number = 1, limit: number = 10): Admin[] {
    const offset = (page - 1) * limit;
    const result = this.db.query(
      `SELECT id, name, username, password, created_at, updated_at FROM admin LIMIT ? OFFSET ?`,
      limit,
      offset,
    ) as Admin[];

    return result;
  }

  update(
    id: number,
    data: Partial<Omit<Admin, "id" | "created_at" | "updated_at">>,
  ): void {
    const fields = Object.keys(data);
    if (fields.length === 0) return;

    const setClause = fields.map((field) => `${field} = ?`).join(", ");
    const values = fields.map((field) => (data as any)[field]);
    values.push(id); // Add ID for WHERE clause

    this.db.query(`UPDATE admin SET ${setClause} WHERE id = ?`, ...values);
  }

  delete(id: number): void {
    this.db.query(`DELETE FROM admin WHERE id = ?`, id);
  }
}
