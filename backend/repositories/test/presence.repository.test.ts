import {
  describe,
  test,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
} from "bun:test";
import { PresenceRepository } from "../presence.repository";
import { Sqlite } from "../../config/database";
import { unlinkSync } from "node:fs";

describe("PresenceRepository", () => {
  let sqlite: Sqlite;
  let repo: PresenceRepository;
  const DB_TEST = "presence_repository_test.db"; // Use a specific name for the test database

  beforeAll(async () => {
    sqlite = await Sqlite.createInstance(DB_TEST);
    repo = new PresenceRepository(sqlite);
  });

  beforeEach(() => {
    // Clean up and seed data before each test
    // Assuming sqlite.query returns the actual Sqlite instance, or has a way to execute raw queries
    sqlite.query("DELETE FROM presence");
    sqlite.query("DELETE FROM class_enrollment");
    sqlite.query("DELETE FROM class");
    sqlite.query("DELETE FROM mahasiswa");
    sqlite.query("DELETE FROM study_program");
    sqlite.query("DELETE FROM major");

    // Seed data
    sqlite.query("INSERT INTO major (id, name) VALUES (1, 'Test Major')");
    sqlite.query(
      "INSERT INTO study_program (id, name, major_id) VALUES (1, 'Test SP', 1)",
    );
    sqlite.query(
      "INSERT INTO mahasiswa (id, name, nim, email, username, password, major_id, study_program_id) VALUES (100, 'Test Student', '123', 'test@test.com', 'test', 'test', 1, 1)",
    );
    sqlite.query(
      "INSERT INTO class (id, name, enroll_key, schedule, start_time, end_time, activated_at) VALUES (1, 'Test Class', 'TEST1', 1, '10:00', '12:00', '2025-01-01 00:00:00')",
    );
    sqlite.query(
      "INSERT INTO class (id, enroll_key, name, schedule, start_time, end_time, activated_at) VALUES (2, 'TEST2', 'Test Class 2', 2, '13:00', '15:00', '2025-01-01 00:00:00')",
    );
    sqlite.query(
      "INSERT INTO class_enrollment (id, class_id, mahasiswa_id) VALUES (1, 1, 100)",
    );
    sqlite.query(
      "INSERT INTO class_enrollment (id, class_id, mahasiswa_id) VALUES (2, 2, 100)",
    );
  });

  afterAll(() => {
    sqlite.close();
    try {
      unlinkSync(sqlite.database_path); // Use the database_path from the instance
    } catch (e) {
      // ignore
    }
  });

  test("should create and find a presence record", () => {
    const p = {
      class_enrollment_id: 1,
      schedule_date: "2025-01-01",
      status: "hadir" as const,
      late_time: 0,
    };
    const id = repo.create(p);
    const found = repo.findById(id);
    expect(found).not.toBeNull();
    expect(found?.id).toBe(id);
    expect(found?.status).toBe("hadir");
  });

  test("should find by class id", () => {
    repo.create({
      class_enrollment_id: 1,
      schedule_date: "2025-01-01",
      status: "hadir",
      late_time: 0,
    });
    const result = repo.findByClass(1);
    expect(result.length).toBe(1);
    expect(result[0]?.mahasiswa_id).toBe(100);
  });

  test("should find by enrollment ids", () => {
    repo.create({
      class_enrollment_id: 1,
      schedule_date: "2025-01-01",
      status: "hadir",
      late_time: 0,
    });
    repo.create({
      class_enrollment_id: 2,
      schedule_date: "2025-01-02",
      status: "alpha",
      late_time: 0,
    });

    const result = repo.findByEnrollmentIds([1, 2]);
    expect(result.length).toBe(2);
    const p1 = result.find((r) => r.class_enrollment_id === 1);
    expect(p1).toBeDefined();
    expect(p1.class_id).toBe(1);
    expect(p1.class_name).toBe("Test Class");
    expect(p1.schedule_date).toBe("2025-01-01");
    expect(p1.status).toBe("hadir");
  });

  test("should find by mahasiswa id and class id", () => {
    repo.create({
      class_enrollment_id: 1,
      schedule_date: "2025-01-01",
      status: "hadir",
      late_time: 0,
    });
    repo.create({
      class_enrollment_id: 2,
      schedule_date: "2025-01-02",
      status: "alpha",
      late_time: 0,
    });

    const result = repo.findByMahasiswaIdAndClassId(100, 1);
    expect(result.length).toBe(1);
    expect(result[0]?.class_enrollment_id).toBe(1);
  });

  test("should create or update many (create)", () => {
    const presences = [
      {
        class_enrollment_id: 1,
        schedule_date: "2025-01-01",
        status: "hadir" as const,
        late_time: 0,
      },
      {
        class_enrollment_id: 2,
        schedule_date: "2025-01-02",
        status: "alpha" as const,
        late_time: 0,
      },
    ];
    repo.createOrUpdateMany(presences);
    const result = repo.findByEnrollmentIds([1, 2]);
    expect(result.length).toBe(2);
  });

  test("should create or update many (update)", () => {
    const newPresence = {
      class_enrollment_id: 1,
      schedule_date: "2025-01-01",
      status: "hadir" as const,
      late_time: 0,
    };
    const id = repo.create(newPresence);

    const presences = [
      {
        class_enrollment_id: 1,
        schedule_date: "2025-01-01",
        status: "sakit" as const,
        late_time: 0,
      },
    ];
    repo.createOrUpdateMany(presences);
    const result = repo.findById(id);
    expect(result?.status).toBe("sakit");
  });

  test("should delete a presence record", () => {
    const id = repo.create({
      class_enrollment_id: 1,
      schedule_date: "2025-01-01",
      status: "hadir",
      late_time: 0,
    });
    expect(repo.findById(id)).not.toBeNull();
    repo.delete(id);
    expect(repo.findById(id)).toBeNull();
  });
});