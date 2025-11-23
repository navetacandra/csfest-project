import { describe, test, expect, beforeAll, afterAll } from "bun:test";
import { ClassEnrollmentRepository } from "../classEnrollment.repository";
import type { ClassEnrollment } from "../../models/class_enrollment.model";
import { Sqlite } from "../../config/database";

const DB_TEST = "class_enrollment_repository_test.sqlite";
let sqlite: Sqlite;
let repo: ClassEnrollmentRepository;

beforeAll(async () => {
  sqlite = await Sqlite.createInstance(DB_TEST);
  repo = new ClassEnrollmentRepository(sqlite);
});

afterAll(() => {
  const dbPath = Bun.fileURLToPath(
    import.meta.resolve(`${__dirname}/../../database/${DB_TEST}`),
  );
  sqlite.close();
  Bun.file(dbPath).delete();
});

describe("ClassEnrollmentRepository", () => {
  const enrollmentData: Omit<
    ClassEnrollment,
    "id" | "created_at" | "updated_at"
  > = {
    class_id: 1,
    mahasiswa_id: 1,
    dosen_id: null,
    admin_id: null,
  };

  test("should create an enrollment", () => {
    const createdId = repo.create(enrollmentData);

    const result = repo.findById(createdId);
    expect(result).not.toBeNull();
    expect(result?.class_id).toBe(enrollmentData.class_id);
    expect(result?.mahasiswa_id).toBe(enrollmentData.mahasiswa_id);
  });

  test("should find by id", () => {
    const createdEnrollmentId = repo.create({
      ...enrollmentData,
      class_id: 2,
      mahasiswa_id: 2,
    });

    const result = repo.findById(createdEnrollmentId);

    expect(result).not.toBeNull();
    expect(result?.id).toBe(createdEnrollmentId as number);
  });

  test("should find by class id", () => {
    const classId = 3;
    const testEnrollment = {
      ...enrollmentData,
      class_id: classId,
    };
    const createdEnrollmentId = repo.create(testEnrollment);

    const result = repo.findByClassId(classId);

    expect(result).toContainEqual(
      expect.objectContaining({
        id: createdEnrollmentId,
        class_id: classId,
      }),
    );
  });

  test("should find by mahasiswa id", () => {
    const mahasiswaId = 3;
    const testEnrollment = {
      ...enrollmentData,
      mahasiswa_id: mahasiswaId,
      class_id: 4,
    };
    const createdEnrollmentId = repo.create(testEnrollment);

    const result = repo.findByMahasiswaId(mahasiswaId);

    expect(result).toContainEqual(
      expect.objectContaining({
        id: createdEnrollmentId,
        mahasiswa_id: mahasiswaId,
      }),
    );
  });

  test("should find by dosen id", () => {
    const dosenEnrollmentData: Omit<
      ClassEnrollment,
      "id" | "created_at" | "updated_at"
    > = {
      class_id: 5,
      mahasiswa_id: null,
      dosen_id: 1,
      admin_id: null,
    };
    const dosenEnrollmentId = repo.create(dosenEnrollmentData);

    const result = repo.findByDosenId(dosenEnrollmentData.dosen_id!);

    expect(result).toContainEqual(
      expect.objectContaining({
        id: dosenEnrollmentId,
        dosen_id: dosenEnrollmentData.dosen_id,
      }),
    );
  });

  test("should find by admin id", () => {
    const adminEnrollmentData: Omit<
      ClassEnrollment,
      "id" | "created_at" | "updated_at"
    > = {
      class_id: 6,
      mahasiswa_id: null,
      dosen_id: null,
      admin_id: 1,
    };
    const adminEnrollmentId = repo.create(adminEnrollmentData);

    const result = repo.findByAdminId(adminEnrollmentData.admin_id!);

    expect(result).toContainEqual(
      expect.objectContaining({
        id: adminEnrollmentId,
        admin_id: adminEnrollmentData.admin_id,
      }),
    );
  });

  test("should delete an enrollment", () => {
    const testEnrollment = {
      ...enrollmentData,
      class_id: 7,
      mahasiswa_id: 3,
    };
    const createdEnrollmentId = repo.create(testEnrollment);

    expect(repo.findById(createdEnrollmentId)).not.toBeNull();

    repo.delete(createdEnrollmentId);

    const deletedEnrollment = repo.findById(createdEnrollmentId);
    expect(deletedEnrollment).toBeNull();
  });
});
