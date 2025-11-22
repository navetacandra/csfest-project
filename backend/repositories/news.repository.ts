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
    const result = sqlite.query("SELECT * FROM news WHERE id = ?", [
      id,
    ]) as News[];
    return result.length > 0 ? result[0] : null;
  }

  all(page: number = 1, limit: number = 10) {
    const offset = (page - 1) * limit;
    return sqlite.query("SELECT * FROM news LIMIT ? OFFSET ?", [
      limit,
      offset,
    ]) as News[];
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
