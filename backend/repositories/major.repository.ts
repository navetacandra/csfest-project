import { sqlite } from "..";
import type { Major } from "../models/major.model";

type MajorForCreate = Omit<Major, "id" | "created_at" | "updated_at">;
type MajorForUpdate = Partial<MajorForCreate>;

export class MajorRepository {
  create(data: MajorForCreate) {
    const result = sqlite.query(
      "INSERT INTO major (name) VALUES ($name) RETURNING id",
      {
        $name: data.name,
      },
    );
    const firstResult = result[0] as { id: number | bigint };
    return firstResult.id;
  }

  findById(id: number) {
    const result = sqlite.query("SELECT * FROM major WHERE id = ?", [
      id,
    ]) as Major[];
    return result.length > 0 ? result[0] : null;
  }

  update(id: number, data: MajorForUpdate) {
    const fields = Object.keys(data)
      .map((key) => `${key} = ?`)
      .join(", ");
    if (fields.length === 0) {
      return;
    }
    const values = Object.values(data);
    sqlite.query(
      `UPDATE major SET ${fields}, updated_at = STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW') WHERE id = ?`,
      [...values, id],
    );
  }

  delete(id: number) {
    sqlite.query("DELETE FROM major WHERE id = ?", [id]);
  }
}
