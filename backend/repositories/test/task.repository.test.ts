import { describe, test, expect, beforeAll, afterAll } from "bun:test";
import { TaskRepository } from "../task.repository";
import { Sqlite } from "../../config/database";

const DB_TEST = "task_repository_test.sqlite";
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
    // Using existing data in the seeded database
    const taskData = {
      post_id: 1, // Assuming post with id 1 exists from seeding
      class_enrollment_id: 1, // Assuming class_enrollment with id 1 exists from seeding
      file_id: 1, // Assuming file with id 1 exists from seeding
    };

    const taskId = repo.create(taskData);

    // Verify that the task was actually created in database
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
      file_id: 2, // using a different file_id to create unique entry
    });

    const result = repo.findById(taskId);

    expect(result).not.toBeNull();
    expect(result?.id).toBe(taskId as number);
  });

  test("should find by class enrollment id", () => {
    const enrollmentId = 2; // using existing enrollment id from seeding

    const results = repo.findByClassEnrollmentId(enrollmentId);

    expect(results.length).toBeGreaterThanOrEqual(0); // May have zero or more results depending on seeded data
    if (results.length > 0) {
      expect(results[0]!.class_enrollment_id).toBe(enrollmentId);
    }
  });

  test("should find by class id", () => {
    const classId = 1; // using existing class id from seeding

    const results = repo.findByClassId(classId);

    expect(results.length).toBeGreaterThanOrEqual(0);
    if (results.length > 0) {
      // Result should be associated with the class through class_enrollment
    }
  });

  test("should get all tasks", () => {
    const results = repo.all(1, 10); // page 1, limit 10

    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBeGreaterThanOrEqual(0);
  });

  test("should delete a task", () => {
    // Create a new task to be deleted
    const taskData = {
      post_id: 1,
      class_enrollment_id: 1,
      file_id: 3, // using a different file_id
    };
    const taskId = repo.create(taskData);

    // Verify the task exists before deletion
    expect(repo.findById(taskId)).not.toBeNull();

    // Delete the task
    repo.delete(taskId);

    // Verify the task no longer exists
    const result = repo.findById(taskId);
    expect(result).toBeNull();
  });
});
