import { sqlite } from "..";
import type { Mahasiswa } from "../models/mahasiswa.model";

type MahasiswaForCreate = Omit<Mahasiswa, "id" | "created_at" | "updated_at">;
type MahasiswaForUpdate = Partial<MahasiswaForCreate>;

export class MahasiswaRepository {
  create(data: MahasiswaForCreate) {
    const result = sqlite.query(
      "INSERT INTO mahasiswa (major_id, study_program_id, nim, name, email, username, password) VALUES ($major_id, $study_program_id, $nim, $name, $email, $username, $password) RETURNING id",
      {
        $major_id: data.major_id,
        $study_program_id: data.study_program_id,
        $nim: data.nim,
        $name: data.name,
        $email: data.email,
        $username: data.username,
        $password: data.password,
      },
    );
    const firstResult = result[0] as { id: number | bigint };
    return firstResult.id;
  }

  all(page: number = 1, limit: number = 10, name?: string, major_id?: number, study_program_id?: number) {
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

    return sqlite.query(baseQuery, params);
  }

  findById(id: number) {
    const query = `
      SELECT m.id, m.name, m.nim, m.email, m.username, mj.name as major, sp.name as study_program
      FROM mahasiswa m
      JOIN major mj ON m.major_id = mj.id
      JOIN study_program sp ON m.study_program_id = sp.id
      WHERE m.id = ?
    `;
    const result = sqlite.query(query, [id]);
    return result.length > 0 ? result[0] : null;
  }

  findByUsername(username: string) {
    // This method might be used for authentication, so we select the password.
    const result = sqlite.query("SELECT * FROM mahasiswa WHERE username = ?", [
      username,
    ]) as Mahasiswa[];
    return result.length > 0 ? result[0] : null;
  }

  update(id: number, data: MahasiswaForUpdate) {
    const fields = Object.keys(data)
      .map((key) => `${key} = ?`)
      .join(", ");
    if (fields.length === 0) {
      return;
    }
    const values = Object.values(data);
    sqlite.query(
      `UPDATE mahasiswa SET ${fields}, updated_at = STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW') WHERE id = ?`,
      [...values, id],
    );
  }

  delete(id: number) {
    sqlite.query("DELETE FROM mahasiswa WHERE id = ?", [id]);
  }
}
