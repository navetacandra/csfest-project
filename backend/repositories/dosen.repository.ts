import { sqlite } from "..";
import type { Dosen } from "../models/dosen.model";

type DosenForCreate = Omit<Dosen, "id" | "created_at" | "updated_at">;
type DosenForUpdate = Partial<DosenForCreate>;

export class DosenRepository {
  create(dosenData: DosenForCreate) {
    const result = sqlite.query(
      "INSERT INTO dosen (nip, name, username, password) VALUES ($nip, $name, $username, $password) RETURNING id",
      {
        $nip: dosenData.nip,
        $name: dosenData.name,
        $username: dosenData.username,
        $password: dosenData.password,
      },
    );

    const firstResult = result[0] as { id: number | bigint };
    return firstResult.id;
  }

  findById(id: number) {
    const result = sqlite.query(
      "SELECT id, username, name, created_at, updated_at FROM dosen WHERE id = ?",
      [id],
    ) as Omit<Dosen, "password">[];
    return result.length > 0 ? result[0] : null;
  }

  findByUsername(username: string) {
    // This method might be used for authentication, so we select the password.
    const result = sqlite.query("SELECT * FROM dosen WHERE username = ?", [
      username,
    ]) as Dosen[];
    return result.length > 0 ? result[0] : null;
  }

  all(page: number = 1, limit: number = 10, nip?: string, name?: string) {
    const offset = (page - 1) * limit;
    let baseQuery = "SELECT id, nip, name, username, created_at, updated_at FROM dosen";
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

    return sqlite.query(baseQuery, params) as Omit<Dosen, "password">[];
  }

  update(id: number, dosenData: DosenForUpdate) {
    const fields = Object.keys(dosenData)
      .map((key) => `${key} = ?`)
      .join(", ");
    if (fields.length === 0) {
      return;
    }
    const values = Object.values(dosenData);
    sqlite.query(
      `UPDATE dosen SET ${fields}, updated_at = STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW') WHERE id = ?`,
      [...values, id],
    );
  }

  delete(id: number) {
    sqlite.query("DELETE FROM dosen WHERE id = ?", [id]);
  }
}
