import { describe, test, expect, beforeAll, afterAll } from "bun:test";
import { StudyProgramService } from "../studyProgram.service";
import { Sqlite } from "../../config/database";
import { MajorService } from "../major.service";

describe("StudyProgramService", () => {
  const DB_TEST = `study_program_service_test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.sqlite`;
  let sqlite: Sqlite;
  let studyProgramService: StudyProgramService;
  let majorService: MajorService;

  beforeAll(async () => {
    sqlite = await Sqlite.createInstance(DB_TEST);
    studyProgramService = new StudyProgramService(sqlite);
    majorService = new MajorService(sqlite);
  });

  afterAll(() => {
    const dbPath = Bun.fileURLToPath(
      import.meta.resolve(`${__dirname}/../../database/${DB_TEST}`),
    );
    sqlite.close();
    Bun.file(dbPath).delete();
  });

  test("should create a study program", async () => {
    // Create a major first
    const majorData = {
      name: "Test Major for Study Program Service",
    };
    const createdMajor = majorService.create(majorData);
    expect(createdMajor).not.toBeNull();
    expect(createdMajor?.id).toBeGreaterThan(0);

    const studyProgramData = {
      name: "Integration Test Study Program Service",
      major_id: createdMajor!.id!,
    };

    const result = studyProgramService.create(studyProgramData);

    expect(result).not.toBeNull();
    expect(result?.name).toBe(studyProgramData.name);
    expect(result?.major_id).toBe(studyProgramData.major_id);
  });

  test("should get study programs by major id", async () => {
    // Create a major first
    const majorData = {
      name: "Test Major Get By Major for Study Program Service",
    };
    const createdMajor = majorService.create(majorData);
    expect(createdMajor).not.toBeNull();

    // Create a study program for the major
    const studyProgramData = {
      name: "Get By Major Test Study Program Service",
      major_id: createdMajor!.id!,
    };
    const createdStudyProgram = studyProgramService.create(studyProgramData);
    expect(createdStudyProgram).not.toBeNull();

    const result = studyProgramService.getByMajorId(createdMajor!.id!);

    expect(Array.isArray(result)).toBe(true);
    expect(result).toContainEqual(
      expect.objectContaining({
        id: createdStudyProgram?.id,
        major_id: createdMajor!.id,
      })
    );
  });

  test("should delete a study program", async () => {
    // Create a major first
    const majorData = {
      name: "Test Major Delete for Study Program Service",
    };
    const createdMajor = majorService.create(majorData);
    expect(createdMajor).not.toBeNull();

    // Create a study program to delete
    const studyProgramData = {
      name: "Delete Test Study Program Service",
      major_id: createdMajor!.id!,
    };
    const createdStudyProgram = studyProgramService.create(studyProgramData);
    expect(createdStudyProgram).not.toBeNull();

    // Verify study program exists before deletion by attempting to delete again (should work the first time)
    // We can check if it still exists by trying to delete it again and expecting an error
    const deletedStudyProgram = studyProgramService.delete(createdStudyProgram!.id!);

    expect(deletedStudyProgram).not.toBeNull();
    expect(deletedStudyProgram.id).toBe(createdStudyProgram!.id);

    // Verify study program was deleted by trying to delete it again (should throw an error)
    expect(() => {
      studyProgramService.delete(createdStudyProgram!.id!); // This should throw since it's already deleted
    }).toThrow("Study Program not found");
  });

  test("should throw error when deleting non-existent study program", () => {
    expect(() => {
      studyProgramService.delete(999999);
    }).toThrow("Study Program not found");
  });
});