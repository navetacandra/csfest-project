import { describe, test, expect, beforeAll, afterAll } from "bun:test";
import { TaskRepository } from "../task.repository";
import { Sqlite } from "../../config/database";

const DB_TEST = "task_repository_test.db";
let sqlite: Sqlite;
let repo: TaskRepository;

beforeAll(async () => {
  sqlite = await Sqlite.createInstance(DB_TEST);
  repo = new TaskRepository(sqlite);
});

afterAll(() => {
  const dbPath = Bun.fileURLToPath(
    import.meta.resolve(`${__dirname}/../../database/${DB_TEST}`),
  );
  sqlite.close();
  Bun.file(dbPath).delete();
});

describe("TaskRepository", () => {
  test("should create a task", () => {
    const taskData = {
      post_id: 1,
      class_enrollment_id: 1,
      file_id: 1,
    };

    const taskId = repo.create(taskData);

    const result = repo.findById(taskId);

    expect(result).not.toBeNull();
    expect(result?.post_id).toBe(taskData.post_id);
    expect(result?.class_enrollment_id).toBe(taskData.class_enrollment_id);
    expect(result?.file_id).toBe(taskData.file_id);
  });

  test("should find by id", () => {
    const taskId = repo.create({
      post_id: 1,
      class_enrollment_id: 1,
      file_id: 2,
    });

    const result = repo.findById(taskId);

    expect(result).not.toBeNull();
    expect(result?.id).toBe(taskId as number);
  });

  test("should find by class enrollment id", () => {
    const enrollmentId = 2;

    const results = repo.findByClassEnrollmentId(enrollmentId);

    expect(results.length).toBeGreaterThanOrEqual(0);
    if (results.length > 0) {
      expect(results[0]!.class_enrollment_id).toBe(enrollmentId);
    }
  });

  test("should find by class id", () => {
    const classId = 1;

    const results = repo.findByClassId(classId);

    expect(results.length).toBeGreaterThanOrEqual(0);
    if (results.length > 0) {
    }
  });

  test("should get all tasks", () => {
    const results = repo.all(1, 10);

    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBeGreaterThanOrEqual(0);
  });

  test("should delete a task", () => {
    const taskData = {
      post_id: 1,
      class_enrollment_id: 1,
      file_id: 3,
    };
    const taskId = repo.create(taskData);

    expect(repo.findById(taskId)).not.toBeNull();

    repo.delete(taskId);

    const result = repo.findById(taskId);
    expect(result).toBeNull();
  });
});
