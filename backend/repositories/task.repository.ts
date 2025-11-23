import { sqlite } from "..";
import type { Task } from "../models/task.model";

type TaskForCreate = Omit<Task, "id" | "created_at" | "updated_at">;

export class TaskRepository {
  create(data: TaskForCreate) {
    const result = sqlite.query(
      "INSERT INTO task (post_id, class_enrollment_id, file_id) VALUES ($post_id, $class_enrollment_id, $file_id) RETURNING id",
      {
        $post_id: data.post_id,
        $class_enrollment_id: data.class_enrollment_id,
        $file_id: data.file_id,
      },
    );
    const firstResult = result[0] as { id: number | bigint };
    return firstResult.id;
  }

  findById(id: number) {
    const result = sqlite.query("SELECT * FROM task WHERE id = ?", [
      id,
    ]) as Task[];
    return result.length > 0 ? result[0] : null;
  }

  findByClassEnrollmentId(classEnrollmentId: number) {
    return sqlite.query("SELECT * FROM task WHERE class_enrollment_id = ?", [
      classEnrollmentId,
    ]) as Task[];
  }

  findByClassId(classId: number) {
    const query = `
        SELECT t.* FROM task t
        INNER JOIN class_enrollment ce ON t.class_enrollment_id = ce.id
        WHERE ce.class_id = ?
    `;
    return sqlite.query(query, [classId]) as Task[];
  }

  findByPostIdAndStudentId(postId: number, studentId: number) {
    const query = `
        SELECT t.*
        FROM task t
        INNER JOIN class_enrollment ce ON t.class_enrollment_id = ce.id
        WHERE t.post_id = ? AND ce.mahasiswa_id = ?
    `;
    return sqlite.query(query, [postId, studentId]) as Task[];
  }
  
  findByPostIdWithStudent(postId: number) {
      const query = `
          SELECT t.*, m.name as mahasiswa_name, m.nim as mahasiswa_nim, f.upload_name, f.random_name
          FROM task t
          INNER JOIN class_enrollment ce ON t.class_enrollment_id = ce.id
          INNER JOIN mahasiswa m ON ce.mahasiswa_id = m.id
          INNER JOIN file f ON t.file_id = f.id
          WHERE t.post_id = ?
          ORDER BY m.name
      `;
      return sqlite.query(query, [postId]);
  }

  findByStudentId(studentId: number) {
    const query = `
        SELECT t.*
        FROM task t
        INNER JOIN class_enrollment ce ON t.class_enrollment_id = ce.id
        WHERE ce.mahasiswa_id = ?
    `;
    return sqlite.query(query, [studentId]) as Task[];
  }

  all(page: number = 1, limit: number = 10) {
    const offset = (page - 1) * limit;
    return sqlite.query("SELECT * FROM task LIMIT ? OFFSET ?", [
      limit,
      offset,
    ]) as Task[];
  }

  delete(id: number) {
    sqlite.query("DELETE FROM task WHERE id = ?", [id]);
  }
}
