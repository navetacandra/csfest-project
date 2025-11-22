import { describe, test, expect, mock, jest } from "bun:test";
import { ClassEnrollmentRepository } from "../classEnrollment.repository";

// Mock the sqlite dependency
const mockQuery = jest.fn();
mock.module("../..", () => ({
  sqlite: {
    query: mockQuery,
  },
}));

describe("ClassEnrollmentRepository", () => {
  const repo = new ClassEnrollmentRepository();
  const enrollmentData = {
    id: 1,
    class_id: 1,
    mahasiswa_id: 1,
    dosen_id: null,
    admin_id: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  test("should find by id", () => {
    mockQuery.mockReturnValueOnce([enrollmentData]);
    const result = repo.findById(1);
    expect(mockQuery).toHaveBeenCalledWith("SELECT * FROM class_enrollment WHERE id = ?", [1]);
    expect(result).toEqual(enrollmentData);
  });

  test("should find by class id", () => {
    mockQuery.mockReturnValueOnce([enrollmentData]);
    const result = repo.findByClassId(1);
    expect(mockQuery).toHaveBeenCalledWith("SELECT * FROM class_enrollment WHERE class_id = ?", [1]);
    expect(result).toEqual([enrollmentData]);
  });

  test("should find by mahasiswa id", () => {
    mockQuery.mockReturnValueOnce([enrollmentData]);
    const result = repo.findByMahasiswaId(1);
    expect(mockQuery).toHaveBeenCalledWith("SELECT * FROM class_enrollment WHERE mahasiswa_id = ?", [1]);
    expect(result).toEqual([enrollmentData]);
  });
  
  test("should find by dosen id", () => {
    const dosenEnrollment = {...enrollmentData, mahasiswa_id: null, dosen_id: 1};
    mockQuery.mockReturnValueOnce([dosenEnrollment]);
    const result = repo.findByDosenId(1);
    expect(mockQuery).toHaveBeenCalledWith("SELECT * FROM class_enrollment WHERE dosen_id = ?", [1]);
    expect(result).toEqual([dosenEnrollment]);
  });

  test("should find by admin id", () => {
    const adminEnrollment = {...enrollmentData, mahasiswa_id: null, admin_id: 1};
    mockQuery.mockReturnValueOnce([adminEnrollment]);
    const result = repo.findByAdminId(1);
    expect(mockQuery).toHaveBeenCalledWith("SELECT * FROM class_enrollment WHERE admin_id = ?", [1]);
    expect(result).toEqual([adminEnrollment]);
  });
  
  test("should delete an enrollment", () => {
    repo.delete(1);
    expect(mockQuery).toHaveBeenCalledWith("DELETE FROM class_enrollment WHERE id = ?", [1]);
  });
});
