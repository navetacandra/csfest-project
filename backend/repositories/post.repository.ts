import { sqlite } from "..";
import type { Post } from "../models/post.model";

type PostForCreate = Omit<Post, "id" | "created_at" | "updated_at">;
type PostForUpdate = Partial<PostForCreate>;

export class PostRepository {
  create(data: PostForCreate) {
    const result = sqlite.query(
      "INSERT INTO post (class_id, class_enrollment_id, file_id, message, type) VALUES ($class_id, $class_enrollment_id, $file_id, $message, $type) RETURNING id",
      {
        $class_id: data.class_id,
        $class_enrollment_id: data.class_enrollment_id,
        $file_id: data.file_id,
        $message: data.message,
        $type: data.type,
      },
    );
    const firstResult = result[0] as { id: number | bigint };
    return firstResult.id;
  }

  findById(id: number) {
    const result = sqlite.query("SELECT * FROM post WHERE id = ?", [
      id,
    ]) as Post[];
    return result.length > 0 ? result[0] : null;
  }

  findByClassId(classId: number) {
    return sqlite.query("SELECT * FROM post WHERE class_id = ?", [
      classId,
    ]) as Post[];
  }

  all(page: number = 1, limit: number = 10) {
    const offset = (page - 1) * limit;
    return sqlite.query("SELECT * FROM post LIMIT ? OFFSET ?", [
      limit,
      offset,
    ]) as Post[];
  }

  update(id: number, data: PostForUpdate) {
    const fields = Object.keys(data)
      .map((key) => `${key} = ?`)
      .join(", ");
    if (fields.length === 0) {
      return;
    }
    const values = Object.values(data);
    sqlite.query(
      `UPDATE post SET ${fields}, updated_at = STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW') WHERE id = ?`,
      [...values, id],
    );
  }

  delete(id: number) {
    sqlite.query("DELETE FROM post WHERE id = ?", [id]);
  }
}
