import type { News } from "../models/news.model";
import type { Sqlite } from "../config/database";

type NewsForCreate = Omit<News, "id" | "created_at" | "updated_at">;
type NewsForUpdate = Partial<NewsForCreate>;

export class NewsRepository {
  private db: Sqlite;

  constructor(db: Sqlite) {
    this.db = db;
  }

  create(data: NewsForCreate): number {
    const result = this.db.query(
      "INSERT INTO news (title, content, thumbnail_file_id) VALUES (?, ?, ?) RETURNING id",
      data.title,
      data.content,
      data.thumbnail_file_id,
    );
    const firstResult = result[0] as { id: number | bigint };
    return firstResult.id as number;
  }

  findById(id: number): any {
    // Using any because JOIN returns a custom object
    const query = `
      SELECT n.id, n.title, n.content, f.random_name as thumbnail
      FROM news n
      JOIN file f ON n.thumbnail_file_id = f.id
      WHERE n.id = ?
    `;
    const result = this.db.query(query, id);
    return result.length > 0 ? result[0]! : null;
  }

  all(page: number = 1, limit: number = 10): { id: number; title: string }[] {
    const offset = (page - 1) * limit;
    return this.db.query(
      "SELECT id, title FROM news ORDER BY created_at DESC LIMIT ? OFFSET ?",
      limit,
      offset,
    ) as { id: number; title: string }[];
  }

  update(id: number, data: NewsForUpdate): void {
    const fields = Object.keys(data);
    if (fields.length === 0) {
      return;
    }

    const setClause = fields.map((field) => `${field} = ?`).join(", ");
    const values = fields.map((field) => (data as any)[field]);
    values.push(id); // Add ID for WHERE clause

    this.db.query(
      `UPDATE news SET ${setClause}, updated_at = STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW') WHERE id = ?`,
      ...values,
    );
  }

  delete(id: number): void {
    this.db.query("DELETE FROM news WHERE id = ?", id);
  }
}
