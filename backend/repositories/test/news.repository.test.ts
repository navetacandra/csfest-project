import { describe, test, expect, beforeAll, afterAll, jest } from "bun:test";
import { NewsRepository } from "../news.repository";
import type { News } from "../../models/news.model";
import { Sqlite } from "../../config/database";

const DB_TEST = "news_repository_test.sqlite";
let sqlite: Sqlite = await Sqlite.createInstance(DB_TEST);
let repo: NewsRepository = new NewsRepository(sqlite);

beforeAll(async () => {
  sqlite = await Sqlite.createInstance(DB_TEST);
  repo = new NewsRepository(sqlite);
});

afterAll(() => {
  const dbPath = Bun.fileURLToPath(
    import.meta.resolve(`${__dirname}/../../database/${DB_TEST}`),
  );
  sqlite.close();
  Bun.file(dbPath).delete();
});

describe("NewsRepository", () => {
  const newsData: Omit<News, "id" | "created_at" | "updated_at"> = {
    title: "Integration Test News",
    content: "This is an integration test news.",
    thumbnail_file_id: 1,
  };

  test("should create a news", () => {
    const createdId = repo.create(newsData);

    // Verifikasi bahwa data benar-benar ada di database dengan mengaksesnya kembali
    const result = repo.findById(createdId);

    expect(result).not.toBeNull();
    expect(result?.title).toContain("Integration Test News");
    expect(result?.content).toBe(newsData.content);
  });

  test("should find by id", () => {
    const createdId = repo.create({
      ...newsData,
      title: `Find By ID Test News ${Date.now()}`, // Make unique
    });

    const result = repo.findById(createdId);

    expect(result).not.toBeNull();
    expect(result?.id).toBe(createdId);
  });

  test("should get all news", () => {
    const result = repo.all(1, 10);

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThanOrEqual(0);
  });

  test("should update a news", () => {
    const createdId = repo.create({
      ...newsData,
      title: `Update Test News ${Date.now()}`, // Make unique
    });

    const updateData = { title: "Updated Integration Test News" };

    repo.update(createdId, updateData);

    const updatedResult = repo.findById(createdId);
    expect(updatedResult?.title).toBe(updateData.title);
  });

  test("should delete a news", () => {
    // Buat news baru untuk dihapus
    const testData: Omit<News, "id" | "created_at" | "updated_at"> = {
      title: "Test Delete News",
      content: "This is a test news for deletion.",
      thumbnail_file_id: 1,
    };

    const testNewsId = repo.create(testData);

    // Pastikan news ada sebelum dihapus
    expect(repo.findById(testNewsId)).not.toBeNull();

    repo.delete(testNewsId);

    // Verifikasi bahwa news sudah dihapus
    const deletedNews = repo.findById(testNewsId);
    expect(deletedNews).toBeNull();
  });
});
