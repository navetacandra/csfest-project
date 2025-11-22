import { describe, test, expect, mock, jest, beforeEach } from "bun:test";
import { UserRepository } from "../user.repository";
import { Mahasiswa } from "../../models/mahasiswa.model";
import { Dosen } from "../../models/dosen.model";
import { Admin } from "../../models/admin.model";

// Mock the sqlite dependency
const mockQuery = jest.fn();
mock.module("../..", () => ({
  sqlite: {
    query: mockQuery,
  },
}));

describe("UserRepository", () => {
  const repo = new UserRepository();

  const mahasiswaData: Mahasiswa = {
    id: 1,
    major_id: 1,
    study_program_id: 1,
    nim: "123456789",
    name: "Test Mahasiswa",
    email: "test.mahasiswa@test.com",
    username: "test.mahasiswa",
    password: "password",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  
  const dosenData: Dosen = {
    id: 1,
    nip: "987654321",
    name: "Test Dosen",
    username: "test.dosen",
    password: "password",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const adminData: Admin = {
    id: 1,
    name: "Test Admin",
    username: "test.admin",
    password: "password",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  beforeEach(() => {
    mockQuery.mockReset(); // Resets mock calls and return values
  });

  test("should find a mahasiswa by username", () => {
    mockQuery
      .mockReturnValueOnce([mahasiswaData]) // First call for mahasiswa query
      .mockReturnValueOnce([]) // Second call for dosen query (if first fails)
      .mockReturnValueOnce([]); // Third call for admin query (if second fails)
    const result = repo.findByUsername("test.mahasiswa");
    expect(mockQuery).toHaveBeenCalledTimes(1); // Only calls mahasiswa query
    expect(mockQuery).toHaveBeenCalledWith("SELECT * FROM mahasiswa WHERE username = ?", ["test.mahasiswa"]);
    expect(result).toEqual({ ...mahasiswaData, role: "mahasiswa" });
  });

  test("should find a dosen by username", () => {
    mockQuery
      .mockReturnValueOnce([]) // First call for mahasiswa query
      .mockReturnValueOnce([dosenData]) // Second call for dosen query
      .mockReturnValueOnce([]); // Third call for admin query (if second fails)
    const result = repo.findByUsername("test.dosen");
    expect(mockQuery).toHaveBeenCalledTimes(2); // Calls mahasiswa then dosen
    expect(mockQuery).toHaveBeenCalledWith("SELECT * FROM dosen WHERE username = ?", ["test.dosen"]);
    expect(result).toEqual({ ...dosenData, role: "dosen" });
  });
  
  test("should find an admin by username", () => {
    mockQuery
      .mockReturnValueOnce([]) // First call for mahasiswa query
      .mockReturnValueOnce([]) // Second call for dosen query
      .mockReturnValueOnce([adminData]); // Third call for admin query
    const result = repo.findByUsername("test.admin");
    expect(mockQuery).toHaveBeenCalledTimes(3); // Calls mahasiswa, dosen then admin
    expect(mockQuery).toHaveBeenCalledWith("SELECT * FROM admin WHERE username = ?", ["test.admin"]);
    expect(result).toEqual({ ...adminData, role: "admin" });
  });
  
  test("should return null if user not found by username", () => {
    mockQuery
      .mockReturnValueOnce([]) // mahasiswa
      .mockReturnValueOnce([]) // dosen
      .mockReturnValueOnce([]); // admin
    const result = repo.findByUsername("not.found");
    expect(mockQuery).toHaveBeenCalledTimes(3);
    expect(result).toBeNull();
  });
  
  test("should find a mahasiswa by id and role", () => {
      const { password, ...rest } = mahasiswaData;
      mockQuery.mockReturnValueOnce([rest]);
      const result = repo.findById(1, "mahasiswa");
      expect(mockQuery).toHaveBeenCalledTimes(1);
      expect(mockQuery).toHaveBeenCalledWith("SELECT id, username, name, nim, study_program_id, created_at, updated_at FROM mahasiswa WHERE id = ?", [1]);
      expect(result).toEqual({ ...rest, role: "mahasiswa" });
  });

  test("should find a dosen by id and role", () => {
      const { password, ...rest } = dosenData;
      mockQuery.mockReturnValueOnce([rest]);
      const result = repo.findById(1, "dosen");
      expect(mockQuery).toHaveBeenCalledTimes(1);
      expect(mockQuery).toHaveBeenCalledWith("SELECT id, username, name, created_at, updated_at FROM dosen WHERE id = ?", [1]);
      expect(result).toEqual({ ...rest, role: "dosen" });
  });

  test("should find an admin by id and role", () => {
      const { password, ...rest } = adminData;
      mockQuery.mockReturnValueOnce([rest]);
      const result = repo.findById(1, "admin");
      expect(mockQuery).toHaveBeenCalledTimes(1);
      expect(mockQuery).toHaveBeenCalledWith("SELECT id, username, name, created_at, updated_at FROM admin WHERE id = ?", [1]);
      expect(result).toEqual({ ...rest, role: "admin" });
  });

  test("should return null if user not found by id and role", () => {
      mockQuery.mockReturnValueOnce([]);
      const result = repo.findById(99, "mahasiswa");
      expect(mockQuery).toHaveBeenCalledTimes(1);
      expect(result).toBeNull();
  });
});
