import { sqlite } from "..";
import type { Class } from "../models/class.model";

type ClassForCreate = Omit<
  Class,
  "id" | "created_at" | "updated_at" | "actived_at" | "enroll_key"
>;

export class ClassRepository {
  create(classData: ClassForCreate, enrollKey: string) {
    const result = sqlite.query(
      `INSERT INTO class (name, schedule, start_time, end_time, enroll_key)
       VALUES ($name, $schedule, $start_time, $end_time, $enroll_key)
       RETURNING id`,
      {
        $name: classData.name,
        $schedule: classData.schedule,
        $start_time: classData.start_time,
        $end_time: classData.end_time,
        $enroll_key: enrollKey,
      },
    );
    const firstResult = result[0] as { id: number | bigint };
    return firstResult.id;
  }

  all(page: number = 1, limit: number = 10) {
    const offset = (page - 1) * limit;
    return sqlite.query("SELECT * FROM class LIMIT ? OFFSET ?", [
      limit,
      offset,
    ]) as Class[];
  }

  findById(id: number) {
    const result = sqlite.query("SELECT * FROM class WHERE id = ?", [
      id,
    ]) as Class[];
    return result.length > 0 ? result[0] : null;
  }

  findByEnrollKey(enrollKey: string) {
    const result = sqlite.query("SELECT * FROM class WHERE enroll_key = ?", [
      enrollKey,
    ]) as Class[];
    return result.length > 0 ? result[0] : null;
  }

  findByIds(ids: number[]) {
    if (ids.length === 0) {
      return [];
    }
    const placeholders = ids.map(() => '?').join(',');
    return sqlite.query(`SELECT * FROM class WHERE id IN (${placeholders})`, ids) as Class[];
  }

  update(id: number, classData: Partial<ClassForCreate>) {
    const fields = Object.keys(classData)
      .map((key) => `${key} = ?`)
      .join(", ");
    if (fields.length === 0) {
      return;
    }
    const values = Object.values(classData);
    sqlite.query(
      `UPDATE class SET ${fields}, updated_at = STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW') WHERE id = ?`,
      [...values, id],
    );
  }

  delete(id: number) {
    sqlite.query("DELETE FROM class WHERE id = ?", [id]);
  }
}
