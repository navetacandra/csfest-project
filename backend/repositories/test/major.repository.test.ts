import { describe, test, expect, mock, jest } from "bun:test";
import { MajorRepository } from "../major.repository";
import { Major } from "../../models/major.model";

// Mock the sqlite dependency
const mockQuery = jest.fn();
mock.module("../..", () => ({
  sqlite: {
    query: mockQuery,
  },
}));

describe("MajorRepository", () => {
  const repo = new MajorRepository();
  const majorData: Omit<Major, "id" | "created_at" | "updated_at"> = {
    name: "Test Major",
  };
  const fullMajorData: Major = {
    id: 1,
    ...majorData,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  test("should create a major", () => {
    mockQuery.mockReturnValueOnce([{ id: 1 }]);
    const result = repo.create(majorData);
    expect(mockQuery).toHaveBeenCalledWith(
      "INSERT INTO major (name) VALUES ($name) RETURNING id",
      {
        $name: majorData.name,
      }
    );
    expect(result).toBe(1);
  });

  test("should find by id", () => {
    mockQuery.mockReturnValueOnce([fullMajorData]);
    const result = repo.findById(1);
    expect(mockQuery).toHaveBeenCalledWith("SELECT * FROM major WHERE id = ?", [1]);
    expect(result).toEqual(fullMajorData);
  });

  test("should update a major", () => {
    const updateData = { name: "Updated Name" };
    repo.update(1, updateData);
    expect(mockQuery).toHaveBeenCalledWith(
      `UPDATE major SET name = ?, updated_at = STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW') WHERE id = ?`,
      ["Updated Name", 1]
    );
  });

  test("should delete a major", () => {
    repo.delete(1);
    expect(mockQuery).toHaveBeenCalledWith("DELETE FROM major WHERE id = ?", [1]);
  });
});
