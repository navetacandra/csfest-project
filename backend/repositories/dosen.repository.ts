import type { Dosen } from "../models/dosen.model";
import type { Sqlite } from "../config/database";

type DosenForCreate = Omit<Dosen, "id" | "created_at" | "updated_at">;
type DosenForUpdate = Partial<DosenForCreate>;

export class DosenRepository {
  private db: Sqlite;

  constructor(db: Sqlite) {
    this.db = db;
  }

  create(dosenData: DosenForCreate): number {
    const result = this.db.query(
      "INSERT INTO dosen (nip, name, username, password) VALUES (?, ?, ?, ?) RETURNING id",
      dosenData.nip,
      dosenData.name,
      dosenData.username,
      dosenData.password,
    );
    const firstResult = result[0] as { id: number | bigint };
    return firstResult.id as number;
  }

  findById(id: number): Dosen | null {
    const result = this.db.query(
      "SELECT id, nip, username, name, created_at, updated_at FROM dosen WHERE id = ?",
      id,
    ) as Dosen[]; // Include nip in the select to match the Dosen interface
    return result.length > 0 ? result[0]! : null;
  }

  findByUsername(username: string): Dosen | null {
    // This method might be used for authentication, so we select the password.
    const result = this.db.query(
      "SELECT * FROM dosen WHERE username = ?",
      username,
    ) as Dosen[];
    return result.length > 0 ? result[0]! : null;
  }

  all(
    page: number = 1,
    limit: number = 10,
    nip?: string,
    name?: string,
  ): Dosen[] {
    const offset = (page - 1) * limit;
    let baseQuery =
      "SELECT id, nip, name, username, created_at, updated_at FROM dosen"; // Include nip to match Dosen interface
    const conditions: string[] = [];
    const params: any[] = [];

    if (nip) {
      conditions.push("nip LIKE ?");
      params.push(`%${nip}%`);
    }
    if (name) {
      conditions.push("name LIKE ?");
      params.push(`%${name}%`);
    }

    if (conditions.length > 0) {
      baseQuery += " WHERE " + conditions.join(" AND ");
    }

    baseQuery += " LIMIT ? OFFSET ?";
    params.push(limit, offset);

    return this.db.query(baseQuery, ...params) as Dosen[];
  }

  update(id: number, dosenData: DosenForUpdate): void {
    const fields = Object.keys(dosenData);
    if (fields.length === 0) {
      return;
    }

    const setClause = fields.map((field) => `${field} = ?`).join(", ");
    const values = fields.map((field) => (dosenData as any)[field]);
    values.push(id); // Add ID for WHERE clause

    this.db.query(
      `UPDATE dosen SET ${setClause}, updated_at = STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW') WHERE id = ?`,
      ...values,
    );
  }

  delete(id: number): void {
    this.db.query("DELETE FROM dosen WHERE id = ?", id);
  }
}
