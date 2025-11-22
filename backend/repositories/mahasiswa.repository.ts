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

  all(page: number = 1, limit: number = 10) {
    const offset = (page - 1) * limit;
    return sqlite.query(
      "SELECT id, username, name, nim, study_program_id, created_at, updated_at FROM mahasiswa LIMIT ? OFFSET ?",
      [limit, offset],
    ) as Omit<Mahasiswa, "password">[];
  }

  findById(id: number) {
    const result = sqlite.query(
      "SELECT id, username, name, nim, study_program_id, created_at, updated_at FROM mahasiswa WHERE id = ?",
      [id],
    ) as Omit<Mahasiswa, "password">[];
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
