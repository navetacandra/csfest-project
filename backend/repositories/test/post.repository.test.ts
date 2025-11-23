import { describe, test, expect, beforeAll, afterAll } from "bun:test";
import { PostRepository } from "../post.repository";
import { Sqlite } from "../../config/database";

const DB_TEST = "post_repository_test.sqlite";
let sqlite: Sqlite;
let repo: PostRepository;

beforeAll(async () => {
  sqlite = await Sqlite.createInstance(DB_TEST);
  repo = new PostRepository(sqlite);
});

afterAll(() => {
  const dbPath = Bun.fileURLToPath(
    import.meta.resolve(`${__dirname}/../../database/${DB_TEST}`),
  );
  sqlite.close();
  Bun.file(dbPath).delete();
});

describe("PostRepository", () => {
  test("should create a post with correct ID return", () => {
    const postData = {
      class_id: 1,
      class_enrollment_id: 1,
      file_id: 1,
      message: `Test Post ${Date.now()}`,
      type: "post",
    };

    const result = repo.create(postData);

    expect(typeof result).toBe("number");
    expect(result).toBeGreaterThan(0);
  });

  test("should create and find a post", () => {
    const postData = {
      class_id: 2,
      class_enrollment_id: 2,
      file_id: 2,
      message: `Test Post Find ${Date.now()}`,
      type: "post",
    };

    const createdId = repo.create(postData);

    expect(createdId).toBeGreaterThan(0);

    const result = repo.findById(createdId);
    expect(result).not.toBeNull();
    expect(result?.id).toBe(createdId);
    expect(result?.message).toBe(postData.message);
  });
});
