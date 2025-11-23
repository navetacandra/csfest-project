import { describe, test, expect, beforeAll, afterAll } from "bun:test";
import { NewsService } from "../news.service";
import { Sqlite } from "../../config/database";

describe("NewsService", () => {
  const DB_TEST = `news_service_test.db`;
  let sqlite: Sqlite;
  let newsService: NewsService;

  beforeAll(async () => {
    sqlite = await Sqlite.createInstance(DB_TEST);
    newsService = new NewsService(sqlite);
  });

  afterAll(() => {
    const dbPath = Bun.fileURLToPath(
      import.meta.resolve(`${__dirname}/../../database/${DB_TEST}`),
    );
    sqlite.close();
    Bun.file(dbPath).delete();
  });

  test("should create a news", () => {
    const newsData = {
      title: "Integration Test News Service",
      content: "This is an integration test news from service.",
      thumbnail_file_id: 1,
    };

    const result = newsService.create(newsData);

    expect(result).not.toBeNull();
    expect(result?.title).toBe(newsData.title);
    expect(result?.content).toBe(newsData.content);
  });

  test("should get all news with pagination", () => {
    const result = newsService.getAll(1, 10);

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThanOrEqual(0);
  });

  test("should get a news by id", () => {
    const newsData = {
      title: "Get By ID Test News Service",
      content: "This is a get by ID test news from service.",
      thumbnail_file_id: 1,
    };
    const createdNews = newsService.create(newsData);
    expect(createdNews).not.toBeNull();

    const result = newsService.getById(createdNews!.id!);

    expect(result).not.toBeNull();
    expect(result.id).toBe(createdNews!.id);
    expect(result.title).toBe(newsData.title);
  });

  test("should update a news", () => {
    const newsData = {
      title: "Update Test News Service",
      content: "This is an update test news from service.",
      thumbnail_file_id: 1,
    };
    const createdNews = newsService.create(newsData);
    expect(createdNews).not.toBeNull();

    const updateData = { title: "Updated Integration Test News Service" };
    const updatedNews = newsService.update(createdNews!.id!, updateData);

    expect(updatedNews).not.toBeNull();
    expect(updatedNews?.title).toBe(updateData.title);
  });

  test("should delete a news", () => {
    const newsData = {
      title: "Delete Test News Service",
      content: "This is a delete test news from service.",
      thumbnail_file_id: 1,
    };
    const createdNews = newsService.create(newsData);
    expect(createdNews).not.toBeNull();

    const newsBeforeDelete = newsService.getById(createdNews!.id!);
    expect(newsBeforeDelete).not.toBeNull();

    const deletedNews = newsService.delete(createdNews!.id!);

    expect(deletedNews).not.toBeNull();
    expect(deletedNews.id).toBe(createdNews!.id);

    expect(() => {
      newsService.getById(createdNews!.id!);
    }).toThrow("News not found");
  });

  test("should throw error when getting non-existent news by id", () => {
    expect(() => {
      newsService.getById(999999);
    }).toThrow("News not found");
  });

  test("should throw error when deleting non-existent news", () => {
    expect(() => {
      newsService.delete(999999);
    }).toThrow("News not found");
  });
});
