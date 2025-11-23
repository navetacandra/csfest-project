import type { Post } from "../models/post.model";
import type { Sqlite } from "../config/database";

type PostForCreate = Omit<Post, "id" | "created_at" | "updated_at">;
type PostForUpdate = Partial<PostForCreate>;

export class PostRepository {
  private db: Sqlite;

  constructor(db: Sqlite) {
    this.db = db;
  }

  create(data: PostForCreate): number {
    const result = this.db.query(
      "INSERT INTO post (class_id, class_enrollment_id, file_id, message, type) VALUES (?, ?, ?, ?, ?) RETURNING id",
      data.class_id,
      data.class_enrollment_id,
      data.file_id,
      data.message,
      data.type,
    );
    const firstResult = result[0] as { id: number | bigint };
    return firstResult.id as number;
  }

  findById(id: number): Post | null {
    const result = this.db.query(
      "SELECT * FROM post WHERE id = ?",
      id,
    ) as Post[];
    return result.length > 0 ? result[0]! : null;
  }

  findByClassId(classId: number): Post[] {
    return this.db.query(
      "SELECT * FROM post WHERE class_id = ?",
      classId,
    ) as Post[];
  }

  findTasksByClassIds(classIds: number[]): Post[] {
    if (classIds.length === 0) {
      return [];
    }
    const placeholders = classIds.map(() => "?").join(",");
    return this.db.query(
      `SELECT * FROM post WHERE type = 'task' AND class_id IN (${placeholders})`,
      ...classIds,
    ) as Post[];
  }

  all(page: number = 1, limit: number = 10): Post[] {
    const offset = (page - 1) * limit;
    return this.db.query(
      "SELECT * FROM post LIMIT ? OFFSET ?",
      limit,
      offset,
    ) as Post[];
  }

  update(id: number, data: PostForUpdate): void {
    const fields = Object.keys(data);
    if (fields.length === 0) {
      return;
    }

    const setClause = fields.map((field) => `${field} = ?`).join(", ");
    const values = fields.map((field) => (data as any)[field]);
    values.push(id); // Add ID for WHERE clause

    this.db.query(
      `UPDATE post SET ${setClause}, updated_at = STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW') WHERE id = ?`,
      ...values,
    );
  }

  delete(id: number): void {
    this.db.query("DELETE FROM post WHERE id = ?", id);
  }
}
