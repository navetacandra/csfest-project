import type { Mahasiswa } from "../models/mahasiswa.model";
import type { Sqlite } from "../config/database";

type MahasiswaForCreate = Omit<Mahasiswa, "id" | "created_at" | "updated_at">;
type MahasiswaForUpdate = Partial<MahasiswaForCreate>;

export class MahasiswaRepository {
  private db: Sqlite;

  constructor(db: Sqlite) {
    this.db = db;
  }

  create(data: MahasiswaForCreate): number {
    const result = this.db.query(
      "INSERT INTO mahasiswa (major_id, study_program_id, nim, name, email, username, password) VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING id",
      data.major_id,
      data.study_program_id,
      data.nim,
      data.name,
      data.email,
      data.username,
      data.password,
    );
    const firstResult = result[0] as { id: number | bigint };
    return firstResult.id as number;
  }

  all(
    page: number = 1,
    limit: number = 10,
    name?: string,
    major_id?: number,
    study_program_id?: number,
  ): any[] {
    const offset = (page - 1) * limit;
    let baseQuery = `
        SELECT m.id, m.name, mj.name as major, sp.name as study_program
        FROM mahasiswa m
        JOIN major mj ON m.major_id = mj.id
        JOIN study_program sp ON m.study_program_id = sp.id
      `;
    const conditions: string[] = [];
    const params: any[] = [];

    if (name) {
      conditions.push("m.name LIKE ?");
      params.push(`%${name}%`);
    }
    if (major_id) {
      conditions.push("m.major_id = ?");
      params.push(major_id);
    }
    if (study_program_id) {
      conditions.push("m.study_program_id = ?");
      params.push(study_program_id);
    }

    if (conditions.length > 0) {
      baseQuery += " WHERE " + conditions.join(" AND ");
    }

    baseQuery += " LIMIT ? OFFSET ?";
    params.push(limit, offset);

    return this.db.query(baseQuery, ...params);
  }

  findById(id: number): any {
    const query = `
      SELECT m.id, m.name, m.nim, m.email, m.username, mj.name as major, sp.name as study_program
      FROM mahasiswa m
      JOIN major mj ON m.major_id = mj.id
      JOIN study_program sp ON m.study_program_id = sp.id
      WHERE m.id = ?
    `;
    const result = this.db.query(query, id);
    return result.length > 0 ? result[0]! : null;
  }

  findByUsername(username: string): Mahasiswa | null {
    const result = this.db.query(
      "SELECT * FROM mahasiswa WHERE username = ?",
      username,
    ) as Mahasiswa[];
    return result.length > 0 ? result[0]! : null;
  }

  findByClassId(classId: number) {
    const result = this.db.query(
      "SELECT m.name, m.nim FROM class_enrollment ce JOIN mahasiswa m ON m.id=ce.mahasiswa_id WHERE ce.class_id = ?",
      classId,
    );
    return result;
  }

  findMembersByClassId(
    classId: number,
  ): { id: number; name: string; nim: string }[] {
    const query = `
      SELECT m.id, m.name, m.nim
      FROM mahasiswa m
      INNER JOIN class_enrollment ce ON m.id = ce.mahasiswa_id
      WHERE ce.class_id = ?
    `;
    return this.db.query(query, classId) as {
      id: number;
      name: string;
      nim: string;
    }[];
  }

  update(id: number, data: MahasiswaForUpdate): void {
    const fields = Object.keys(data);
    if (fields.length === 0) {
      return;
    }

    const setClause = fields.map((field) => `${field} = ?`).join(", ");
    const values = fields.map((field) => (data as any)[field]);
    values.push(id);

    this.db.query(
      `UPDATE mahasiswa SET ${setClause}, updated_at = STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW') WHERE id = ?`,
      ...values,
    );
  }

  delete(id: number): void {
    this.db.query("DELETE FROM mahasiswa WHERE id = ?", id);
  }
}
