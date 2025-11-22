import { describe, test, expect, mock, jest } from "bun:test";
import { TaskRepository } from "../task.repository";
import { Task } from "../../models/task.model";

// Mock the sqlite dependency
const mockQuery = jest.fn();
mock.module("../..", () => ({
  sqlite: {
    query: mockQuery,
  },
}));

describe("TaskRepository", () => {
  const repo = new TaskRepository();
  const taskData: Omit<Task, "id" | "created_at" | "updated_at"> = {
    post_id: 1,
    class_enrollment_id: 1,
    file_id: 1,
  };
  const fullTaskData: Task = {
    id: 1,
    ...taskData,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  test("should create a task", () => {
    mockQuery.mockReturnValueOnce([{ id: 1 }]);
    const result = repo.create(taskData);
    expect(mockQuery).toHaveBeenCalledWith(
      "INSERT INTO task (post_id, class_enrollment_id, file_id) VALUES ($post_id, $class_enrollment_id, $file_id) RETURNING id",
      {
        $post_id: taskData.post_id,
        $class_enrollment_id: taskData.class_enrollment_id,
        $file_id: taskData.file_id,
      }
    );
    expect(result).toBe(1);
  });

  test("should find by id", () => {
    mockQuery.mockReturnValueOnce([fullTaskData]);
    const result = repo.findById(1);
    expect(mockQuery).toHaveBeenCalledWith("SELECT * FROM task WHERE id = ?", [1]);
    expect(result).toEqual(fullTaskData);
  });
  
  test("should find by class enrollment id", () => {
    mockQuery.mockReturnValueOnce([fullTaskData]);
    const result = repo.findByClassEnrollmentId(1);
    expect(mockQuery).toHaveBeenCalledWith("SELECT * FROM task WHERE class_enrollment_id = ?", [1]);
    expect(result).toEqual([fullTaskData]);
  });
  
  test("should find by class id", () => {
    mockQuery.mockReturnValueOnce([fullTaskData]);
    const result = repo.findByClassId(1);
    expect(mockQuery).toHaveBeenCalledWith(`
        SELECT t.* FROM task t
        INNER JOIN class_enrollment ce ON t.class_enrollment_id = ce.id
        WHERE ce.class_id = ?
    `, [1]);
    expect(result).toEqual([fullTaskData]);
  });
  
  test("should get all tasks", () => {
      mockQuery.mockReturnValueOnce([fullTaskData]);
      const result = repo.all(1, 10);
      expect(mockQuery).toHaveBeenCalledWith("SELECT * FROM task LIMIT ? OFFSET ?", [10, 0]);
      expect(result).toEqual([fullTaskData]);
  });

  test("should delete a task", () => {
    repo.delete(1);
    expect(mockQuery).toHaveBeenCalledWith("DELETE FROM task WHERE id = ?", [1]);
  });
});
