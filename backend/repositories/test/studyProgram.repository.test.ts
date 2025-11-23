import { describe, test, expect, beforeAll, afterAll } from "bun:test";
import { StudyProgramRepository } from "../studyProgram.repository";
import type { StudyProgram } from "../../models/study_program.model";
import { Sqlite } from "../../config/database";

const DB_TEST = "study_program_repository_test.sqlite";
let sqlite: Sqlite;
let repo: StudyProgramRepository;

beforeAll(async () => {
  sqlite = await Sqlite.createInstance(DB_TEST);
  repo = new StudyProgramRepository(sqlite);
});

afterAll(() => {
  const dbPath = Bun.fileURLToPath(
    import.meta.resolve(`${__dirname}/../../database/${DB_TEST}`),
  );
  sqlite.close();
  Bun.file(dbPath).delete();
});

describe("StudyProgramRepository", () => {
  const studyProgramData: Omit<
    StudyProgram,
    "id" | "created_at" | "updated_at"
  > = {
    name: "Integration Test Study Program",
    major_id: 1,
  };
  let createdStudyProgramId: number;

  test("should create a study program", () => {
    createdStudyProgramId = repo.create(studyProgramData) as number;

    // Verifikasi bahwa data benar-benar ada di database dengan mengaksesnya kembali
    const result = repo.findById(createdStudyProgramId);
    expect(result).not.toBeNull();
    expect(result?.name).toBe(studyProgramData.name);
    expect(result?.major_id).toBe(studyProgramData.major_id);
  });

  test("should find by id", () => {
    const result = repo.findById(createdStudyProgramId);

    expect(result).not.toBeNull();
    expect(result?.id).toBe(createdStudyProgramId);
  });

  test("should find by major id", () => {
    const result = repo.findByMajorId(studyProgramData.major_id);

    expect(result).toContainEqual(
      expect.objectContaining({
        id: createdStudyProgramId,
        major_id: studyProgramData.major_id,
      }),
    );
  });

  test("should update a study program", () => {
    const updateData = { name: "Updated Integration Test Study Program" };

    repo.update(createdStudyProgramId, updateData);

    const updatedResult = repo.findById(createdStudyProgramId);
    expect(updatedResult?.name).toBe(updateData.name);
  });

  test("should delete a study program", () => {
    // Buat data baru untuk dihapus
    const testData: Omit<StudyProgram, "id" | "created_at" | "updated_at"> = {
      ...studyProgramData,
      name: "Test Delete Study Program",
    };
    const testStudyProgramId = repo.create(testData);

    // Pastikan data ada sebelum dihapus
    expect(repo.findById(testStudyProgramId)).not.toBeNull();

    repo.delete(testStudyProgramId);

    // Verifikasi bahwa data sudah dihapus
    const deletedStudyProgram = repo.findById(testStudyProgramId);
    expect(deletedStudyProgram).toBeNull();
  });
});
