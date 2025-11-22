import { describe, test, expect, mock, jest } from "bun:test";
import { StudyProgramRepository } from "../studyProgram.repository";
import { StudyProgram } from "../../models/study_program.model";

// Mock the sqlite dependency
const mockQuery = jest.fn();
mock.module("../..", () => ({
  sqlite: {
    query: mockQuery,
  },
}));

describe("StudyProgramRepository", () => {
  const repo = new StudyProgramRepository();
  const studyProgramData: Omit<StudyProgram, "id" | "created_at" | "updated_at"> = {
    name: "Test Study Program",
    major_id: 1,
  };
  const fullStudyProgramData: StudyProgram = {
    id: 1,
    ...studyProgramData,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  test("should create a study program", () => {
    mockQuery.mockReturnValueOnce([{ id: 1 }]);
    const result = repo.create(studyProgramData);
    expect(mockQuery).toHaveBeenCalledWith(
      "INSERT INTO study_program (name, major_id) VALUES ($name, $major_id) RETURNING id",
      {
        $name: studyProgramData.name,
        $major_id: studyProgramData.major_id,
      }
    );
    expect(result).toBe(1);
  });

  test("should find by id", () => {
    mockQuery.mockReturnValueOnce([fullStudyProgramData]);
    const result = repo.findById(1);
    expect(mockQuery).toHaveBeenCalledWith("SELECT * FROM study_program WHERE id = ?", [1]);
    expect(result).toEqual(fullStudyProgramData);
  });
  
  test("should find by major id", () => {
    mockQuery.mockReturnValueOnce([fullStudyProgramData]);
    const result = repo.findByMajorId(1);
    expect(mockQuery).toHaveBeenCalledWith("SELECT * FROM study_program WHERE major_id = ?", [1]);
    expect(result).toEqual([fullStudyProgramData]);
  });

  test("should update a study program", () => {
    const updateData = { name: "Updated Name" };
    repo.update(1, updateData);
    expect(mockQuery).toHaveBeenCalledWith(
      `UPDATE study_program SET name = ?, updated_at = STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW') WHERE id = ?`,
      ["Updated Name", 1]
    );
  });

  test("should delete a study program", () => {
    repo.delete(1);
    expect(mockQuery).toHaveBeenCalledWith("DELETE FROM study_program WHERE id = ?", [1]);
  });
});
