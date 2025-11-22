import { describe, test, expect, mock, jest } from "bun:test";
import { PresenceRepository } from "../presence.repository";
import { Presence } from "../../models/presence.model";

// Mock the sqlite dependency
const mockQuery = jest.fn();
mock.module("../..", () => ({
  sqlite: {
    query: mockQuery,
  },
}));

describe("PresenceRepository", () => {
  const repo = new PresenceRepository();
  const presenceData: Omit<Presence, "id" | "created_at" | "updated_at"> = {
    class_enrollment_id: 1,
    status: "hadir",
    late_time: 0,
  };
  const fullPresenceData: Presence = {
    id: 1,
    ...presenceData,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  test("should create a presence record", () => {
    mockQuery.mockReturnValueOnce([{ id: 1 }]);
    const result = repo.create(presenceData);
    expect(mockQuery).toHaveBeenCalledWith(
      "INSERT INTO presence (class_enrollment_id, status, late_time) VALUES ($class_enrollment_id, $status, $late_time) RETURNING id",
      {
        $class_enrollment_id: presenceData.class_enrollment_id,
        $status: presenceData.status,
        $late_time: presenceData.late_time,
      }
    );
    expect(result).toBe(1);
  });

  test("should find by id", () => {
    mockQuery.mockReturnValueOnce([fullPresenceData]);
    const result = repo.findById(1);
    expect(mockQuery).toHaveBeenCalledWith("SELECT * FROM presence WHERE id = ?", [1]);
    expect(result).toEqual(fullPresenceData);
  });
  
  test("should find by class enrollment id", () => {
      mockQuery.mockReturnValueOnce([fullPresenceData]);
      const result = repo.findByClassEnrollmentId(1);
      expect(mockQuery).toHaveBeenCalledWith("SELECT * FROM presence WHERE class_enrollment_id = ?", [1]);
      expect(result).toEqual([fullPresenceData]);
  });
  
  test("should find by class id", () => {
    mockQuery.mockReturnValueOnce([fullPresenceData]);
    const result = repo.findByClass(1);
    expect(mockQuery).toHaveBeenCalledWith(`
      SELECT p.*
      FROM presence p
      INNER JOIN class_enrollment ce ON p.class_enrollment_id = ce.id
      WHERE ce.class_id = ?
    `, [1]);
    expect(result).toEqual([fullPresenceData]);
  });

  test("should delete a presence record", () => {
    repo.delete(1);
    expect(mockQuery).toHaveBeenCalledWith("DELETE FROM presence WHERE id = ?", [1]);
  });
});
