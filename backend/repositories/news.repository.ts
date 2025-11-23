import { sqlite } from "..";
import type { News } from "../models/news.model";

type NewsForCreate = Omit<News, "id" | "created_at" | "updated_at">;
type NewsForUpdate = Partial<NewsForCreate>;

export class NewsRepository {
  create(data: NewsForCreate) {
    const result = sqlite.query(
      "INSERT INTO news (title, content, thumbnail_file_id) VALUES ($title, $content, $thumbnail_file_id) RETURNING id",
      {
        $title: data.title,
        $content: data.content,
        $thumbnail_file_id: data.thumbnail_file_id,
      },
    );
    const firstResult = result[0] as { id: number | bigint };
    return firstResult.id;
  }

  findById(id: number) {
    const query = `
      SELECT n.id, n.title, n.content, f.random_name as thumbnail
      FROM news n
      JOIN file f ON n.thumbnail_file_id = f.id
      WHERE n.id = ?
    `;
    const result = sqlite.query(query, [id]) as any[];
    return result.length > 0 ? result[0] : null;
  }

  all(page: number = 1, limit: number = 10) {
    const offset = (page - 1) * limit;
    return sqlite.query(
      "SELECT id, title FROM news ORDER BY created_at DESC LIMIT ? OFFSET ?",
      [limit, offset]
    ) as { id: number, title: string }[];
  }

  update(id: number, data: NewsForUpdate) {
    const fields = Object.keys(data)
      .map((key) => `${key} = ?`)
      .join(", ");
    if (fields.length === 0) {
      return;
    }
    const values = Object.values(data);
    sqlite.query(
      `UPDATE news SET ${fields}, updated_at = STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW') WHERE id = ?`,
      [...values, id],
    );
  }

  delete(id: number) {
    sqlite.query("DELETE FROM news WHERE id = ?", [id]);
  }
}
