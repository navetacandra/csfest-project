import { describe, test, expect, mock, jest } from "bun:test";
import { NewsRepository } from "../news.repository";
import { News } from "../../models/news.model";

// Mock the sqlite dependency
const mockQuery = jest.fn();
mock.module("../..", () => ({
  sqlite: {
    query: mockQuery,
  },
}));

describe("NewsRepository", () => {
  const repo = new NewsRepository();
  const newsData: Omit<News, "id" | "created_at" | "updated_at"> = {
    title: "Test News",
    content: "This is a test news.",
    thumbnail_file_id: 1,
  };
  const fullNewsData: News = {
    id: 1,
    ...newsData,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  test("should create a news", () => {
    mockQuery.mockReturnValueOnce([{ id: 1 }]);
    const result = repo.create(newsData);
    expect(mockQuery).toHaveBeenCalledWith(
      "INSERT INTO news (title, content, thumbnail_file_id) VALUES ($title, $content, $thumbnail_file_id) RETURNING id",
      {
        $title: newsData.title,
        $content: newsData.content,
        $thumbnail_file_id: newsData.thumbnail_file_id,
      }
    );
    expect(result).toBe(1);
  });

  test("should find by id", () => {
    mockQuery.mockReturnValueOnce([fullNewsData]);
    const result = repo.findById(1);
    expect(mockQuery).toHaveBeenCalledWith("SELECT * FROM news WHERE id = ?", [1]);
    expect(result).toEqual(fullNewsData);
  });
  
  test("should get all news", () => {
      mockQuery.mockReturnValueOnce([fullNewsData]);
      const result = repo.all(1, 10);
      expect(mockQuery).toHaveBeenCalledWith("SELECT * FROM news LIMIT ? OFFSET ?", [10, 0]);
      expect(result).toEqual([fullNewsData]);
  });

  test("should update a news", () => {
    const updateData = { title: "Updated Title" };
    repo.update(1, updateData);
    expect(mockQuery).toHaveBeenCalledWith(
      `UPDATE news SET title = ?, updated_at = STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW') WHERE id = ?`,
      ["Updated Title", 1]
    );
  });

  test("should delete a news", () => {
    repo.delete(1);
    expect(mockQuery).toHaveBeenCalledWith("DELETE FROM news WHERE id = ?", [1]);
  });
});
