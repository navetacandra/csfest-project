import type { StudyProgram } from "../models/study_program.model";
import type { Sqlite } from "../config/database";

type StudyProgramForCreate = Omit<
  StudyProgram,
  "id" | "created_at" | "updated_at"
>;
type StudyProgramForUpdate = Partial<StudyProgramForCreate>;

export class StudyProgramRepository {
  private db: Sqlite;

  constructor(db: Sqlite) {
    this.db = db;
  }

  create(data: StudyProgramForCreate): number {
    const result = this.db.query(
      "INSERT INTO study_program (name, major_id) VALUES (?, ?) RETURNING id",
      data.name,
      data.major_id,
    );
    const firstResult = result[0] as { id: number | bigint };
    return firstResult.id as number;
  }

  findById(id: number): StudyProgram | null {
    const result = this.db.query(
      "SELECT * FROM study_program WHERE id = ?",
      id,
    ) as StudyProgram[];
    return result.length > 0 ? result[0]! : null;
  }

  findByMajorId(majorId: number): StudyProgram[] {
    return this.db.query(
      "SELECT * FROM study_program WHERE major_id = ?",
      majorId,
    ) as StudyProgram[];
  }

  update(id: number, data: StudyProgramForUpdate): void {
    const fields = Object.keys(data);
    if (fields.length === 0) {
      return;
    }

    const setClause = fields.map((field) => `${field} = ?`).join(", ");
    const values = fields.map((field) => (data as any)[field]);
    values.push(id);

    this.db.query(
      `UPDATE study_program SET ${setClause}, updated_at = STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW') WHERE id = ?`,
      ...values,
    );
  }

  delete(id: number): void {
    this.db.query("DELETE FROM study_program WHERE id = ?", id);
  }
}
