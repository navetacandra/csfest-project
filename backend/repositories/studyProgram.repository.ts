import { sqlite } from "..";
import type { StudyProgram } from "../models/study_program.model";

type StudyProgramForCreate = Omit<
  StudyProgram,
  "id" | "created_at" | "updated_at"
>;
type StudyProgramForUpdate = Partial<StudyProgramForCreate>;

export class StudyProgramRepository {
  create(data: StudyProgramForCreate) {
    const result = sqlite.query(
      "INSERT INTO study_program (name, major_id) VALUES ($name, $major_id) RETURNING id",
      {
        $name: data.name,
        $major_id: data.major_id,
      },
    );
    const firstResult = result[0] as { id: number | bigint };
    return firstResult.id;
  }

  findById(id: number) {
    const result = sqlite.query("SELECT * FROM study_program WHERE id = ?", [
      id,
    ]) as StudyProgram[];
    return result.length > 0 ? result[0] : null;
  }

  findByMajorId(majorId: number) {
    return sqlite.query("SELECT * FROM study_program WHERE major_id = ?", [
      majorId,
    ]) as StudyProgram[];
  }

  update(id: number, data: StudyProgramForUpdate) {
    const fields = Object.keys(data)
      .map((key) => `${key} = ?`)
      .join(", ");
    if (fields.length === 0) {
      return;
    }
    const values = Object.values(data);
    sqlite.query(
      `UPDATE study_program SET ${fields}, updated_at = STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW') WHERE id = ?`,
      [...values, id],
    );
  }

  delete(id: number) {
    sqlite.query("DELETE FROM study_program WHERE id = ?", [id]);
  }
}
