import type { Task } from "../models/task.model";
import type { Sqlite } from "../config/database";

type TaskForCreate = Omit<Task, "id" | "created_at" | "updated_at">;

export class TaskRepository {
  private db: Sqlite;

  constructor(db: Sqlite) {
    this.db = db;
  }

  create(data: TaskForCreate): number {
    const result = this.db.query(
      "INSERT INTO task (post_id, class_enrollment_id, file_id) VALUES (?, ?, ?) RETURNING id",
      data.post_id,
      data.class_enrollment_id,
      data.file_id,
    );
    const firstResult = result[0] as { id: number | bigint };
    return firstResult.id as number;
  }

  findById(id: number): Task | null {
    const result = this.db.query(
      "SELECT * FROM task WHERE id = ?",
      id,
    ) as Task[];
    return result.length > 0 ? result[0]! : null;
  }

  findByClassEnrollmentId(classEnrollmentId: number): Task[] {
    return this.db.query(
      "SELECT * FROM task WHERE class_enrollment_id = ?",
      classEnrollmentId,
    ) as Task[];
  }

  findByClassId(classId: number): Task[] {
    const query = `
        SELECT t.* FROM task t
        INNER JOIN class_enrollment ce ON t.class_enrollment_id = ce.id
        WHERE ce.class_id = ?
    `;
    return this.db.query(query, classId) as Task[];
  }

  findByPostIdAndStudentId(postId: number, studentId: number): Task[] {
    const query = `
        SELECT t.*
        FROM task t
        INNER JOIN class_enrollment ce ON t.class_enrollment_id = ce.id
        WHERE t.post_id = ? AND ce.mahasiswa_id = ?
    `;
    return this.db.query(query, postId, studentId) as Task[];
  }

  findByPostIdWithStudent(postId: number): any[] {
    // Using any due to JOIN query returning custom object
    const query = `
          SELECT t.*, m.name as mahasiswa_name, m.nim as mahasiswa_nim, f.upload_name, f.random_name
          FROM task t
          INNER JOIN class_enrollment ce ON t.class_enrollment_id = ce.id
          INNER JOIN mahasiswa m ON ce.mahasiswa_id = m.id
          INNER JOIN file f ON t.file_id = f.id
          WHERE t.post_id = ?
          ORDER BY m.name
      `;
    return this.db.query(query, postId);
  }

  findByStudentId(studentId: number): Task[] {
    const query = `
        SELECT t.*
        FROM task t
        INNER JOIN class_enrollment ce ON t.class_enrollment_id = ce.id
        WHERE ce.mahasiswa_id = ?
    `;
    return this.db.query(query, studentId) as Task[];
  }

  all(page: number = 1, limit: number = 10): Task[] {
    const offset = (page - 1) * limit;
    return this.db.query(
      "SELECT * FROM task LIMIT ? OFFSET ?",
      limit,
      offset,
    ) as Task[];
  }

  delete(id: number): void {
    this.db.query("DELETE FROM task WHERE id = ?", id);
  }
}
