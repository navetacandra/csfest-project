import { describe, test, expect, beforeAll, afterAll } from "bun:test";
import { ClassService } from "../class.service";
import { Sqlite } from "../../config/database";
import { MahasiswaService } from "../mahasiswa.service";
import { DosenService } from "../dosen.service";

describe("ClassService", () => {
  const DB_TEST = `class_service_test.sqlite`;
  let sqlite: Sqlite;
  let classService: ClassService;
  let mahasiswaService: MahasiswaService;
  let dosenService: DosenService;

  beforeAll(async () => {
    sqlite = await Sqlite.createInstance(DB_TEST);
    classService = new ClassService(sqlite);
    mahasiswaService = new MahasiswaService(sqlite);
    dosenService = new DosenService(sqlite);
  });

  afterAll(() => {
    const dbPath = Bun.fileURLToPath(
      import.meta.resolve(`${__dirname}/../../database/${DB_TEST}`),
    );
    sqlite.close();
    Bun.file(dbPath).delete();
  });

  test("should create a class with unique enroll key", () => {
    const classData = {
      name: "Integration Test Class Service",
      schedule: 1,
      start_time: "09:00",
      end_time: "11:00",
    };

    const result = classService.create(classData);

    expect(result).not.toBeNull();
    expect(result?.name).toBe(classData.name);
    expect(result?.enroll_key).toBeDefined();
    expect(typeof result?.enroll_key).toBe("string");
    expect(result?.enroll_key.length).toBeGreaterThan(0);
  });

  test("should enroll a mahasiswa to a class", async () => {
    const classData = {
      name: "Enrollment Test Class Service",
      schedule: 2,
      start_time: "10:00",
      end_time: "12:00",
    };
    const classResult = classService.create(classData);
    const enrollKey = classResult?.enroll_key;
    expect(enrollKey).toBeDefined();

    const mahasiswaData = {
      major_id: 1,
      study_program_id: 1,
      nim: "987654321",
      name: "Test Mahasiswa Enrollment",
      email: "test.enrollment@example.com",
      username: "test_enrollment_mhs",
      password: "password123",
    };
    const createdMahasiswa = await mahasiswaService.create(mahasiswaData);
    expect(createdMahasiswa).not.toBeNull();

    const enrolledClass = classService.enroll(
      enrollKey!,
      createdMahasiswa!.id!,
      "mahasiswa",
    );

    expect(enrolledClass).not.toBeNull();
    expect(enrolledClass?.id).toBe(classResult!.id);
    expect(enrolledClass?.name).toBe(classData.name);
  });

  test("should enroll a dosen to a class", async () => {
    const classData = {
      name: "Enrollment Test Class Service Dosen",
      schedule: 3,
      start_time: "13:00",
      end_time: "15:00",
    };
    const classResult = classService.create(classData);
    const enrollKey = classResult?.enroll_key;
    expect(enrollKey).toBeDefined();

    const dosenData = {
      nip: "111222333",
      name: "Test Dosen Enrollment",
      username: "test_enrollment_dosen",
      password: "password123",
    };
    const createdDosen = await dosenService.create(dosenData);
    expect(createdDosen).not.toBeNull();

    const enrolledClass = classService.enroll(
      enrollKey!,
      createdDosen!.id!,
      "dosen",
    );

    expect(enrolledClass).not.toBeNull();
    expect(enrolledClass?.id).toBe(classResult!.id);
    expect(enrolledClass?.name).toBe(classData.name);
  });

  test("should throw error when enrolling to non-existent class", async () => {
    const mahasiswaData = {
      major_id: 1,
      study_program_id: 1,
      nim: "111222333",
      name: "Test Mahasiswa Error",
      email: "test.error@example.com",
      username: "test_error_mhs",
      password: "password123",
    };
    const createdMahasiswa = await mahasiswaService.create(mahasiswaData);
    expect(createdMahasiswa).not.toBeNull();

    expect(() => {
      classService.enroll("NONEXISTENTKEY", createdMahasiswa!.id!, "mahasiswa");
    }).toThrow("Class with that enroll key not found.");
  });

  test("should get followed classes for a mahasiswa", async () => {
    const classData = {
      name: "Followed Class Test",
      schedule: 4,
      start_time: "14:00",
      end_time: "16:00",
    };
    const classResult = classService.create(classData);
    expect(classResult).not.toBeNull();

    const mahasiswaData = {
      major_id: 1,
      study_program_id: 1,
      nim: "444555666",
      name: "Test Mahasiswa Follow",
      email: "test.follow@example.com",
      username: "test_follow_mhs",
      password: "password123",
    };
    const createdMahasiswa = await mahasiswaService.create(mahasiswaData);
    expect(createdMahasiswa).not.toBeNull();

    const enrolledClass = classService.enroll(
      classResult!.enroll_key!,
      createdMahasiswa!.id!,
      "mahasiswa",
    );

    const followedClasses = classService.getFollowedClasses(
      createdMahasiswa!.id!,
      "mahasiswa",
    );

    expect(followedClasses).toContainEqual(enrolledClass);
    expect(followedClasses.length).toBeGreaterThanOrEqual(1);
  });
});
