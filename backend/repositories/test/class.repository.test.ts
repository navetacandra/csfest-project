import { describe, test, expect, mock, jest } from "bun:test";
import { ClassRepository } from "../class.repository";

// Mock the sqlite dependency before it's imported by the repository
const mockQuery = jest.fn();
mock.module("../..", () => ({
  sqlite: {
    query: mockQuery,
  },
}));

describe("ClassRepository", () => {
  const classRepo = new ClassRepository();
  const classData = {
    name: "Test Class",
    schedule: 1,
    start_time: "08:00",
    end_time: "10:00",
  };
  const enrollKey = "TESTKEY123";

  test("should create a class", () => {
    mockQuery.mockReturnValueOnce([{ id: 1 }]);

    const result = classRepo.create(classData, enrollKey);
    
    expect(mockQuery).toHaveBeenCalledWith(
      `INSERT INTO class (name, schedule, start_time, end_time, enroll_key)
       VALUES ($name, $schedule, $start_time, $end_time, $enroll_key)
       RETURNING id`,
      {
        $name: classData.name,
        $schedule: classData.schedule,
        $start_time: classData.start_time,
        $end_time: classData.end_time,
        $enroll_key: enrollKey,
      }
    );
    expect(result).toBe(1);
  });

  test("should get all classes with pagination", () => {
    const mockClasses = [{ id: 1, ...classData, enroll_key: enrollKey }];
    mockQuery.mockReturnValueOnce(mockClasses);

    const result = classRepo.all(1, 10);

    expect(mockQuery).toHaveBeenCalledWith(
      "SELECT * FROM class LIMIT ? OFFSET ?",
      [10, 0]
    );
    expect(result).toEqual(mockClasses);
  });

  test("should find a class by id", () => {
    const mockClass = { id: 1, ...classData, enroll_key: enrollKey };
    mockQuery.mockReturnValueOnce([mockClass]);

    const result = classRepo.findById(1);

    expect(mockQuery).toHaveBeenCalledWith(
      "SELECT * FROM class WHERE id = ?",
      [1]
    );
    expect(result).toEqual(mockClass);
  });

  test("should find a class by enroll key", () => {
    const mockClass = { id: 1, ...classData, enroll_key: enrollKey };
    mockQuery.mockReturnValueOnce([mockClass]);

    const result = classRepo.findByEnrollKey(enrollKey);

    expect(mockQuery).toHaveBeenCalledWith(
      "SELECT * FROM class WHERE enroll_key = ?",
      [enrollKey]
    );
    expect(result).toEqual(mockClass);
  });
  
  test("should update a class", () => {
    const updateData = { name: "Updated Class Name" };
    
    classRepo.update(1, updateData);

    expect(mockQuery).toHaveBeenCalledWith(
        `UPDATE class SET name = ?, updated_at = STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW') WHERE id = ?`,
        ["Updated Class Name", 1]
    );
  });

  test("should delete a class", () => {
    classRepo.delete(1);

    expect(mockQuery).toHaveBeenCalledWith(
        "DELETE FROM class WHERE id = ?",
        [1]
    );
  });
});
