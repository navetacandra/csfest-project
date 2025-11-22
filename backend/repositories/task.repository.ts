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
