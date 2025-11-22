import { describe, test, expect, mock, jest } from "bun:test";
import { DosenRepository } from "../dosen.repository";
import { Dosen } from "../../models/dosen.model";

// Mock the sqlite dependency
const mockQuery = jest.fn();
mock.module("../..", () => ({
  sqlite: {
    query: mockQuery,
  },
}));

describe("DosenRepository", () => {
  const repo = new DosenRepository();
  const dosenData: Omit<Dosen, "id" | "created_at" | "updated_at" | "password"> & { password?: string } = {
    nip: "123456789",
    name: "Test Dosen",
    username: "test.dosen",
    password: "password",
  };
  const fullDosenData: Dosen = {
    id: 1,
    ...dosenData,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  test("should create a dosen", () => {
    mockQuery.mockReturnValueOnce([{ id: 1 }]);
    const result = repo.create(dosenData);
    expect(mockQuery).toHaveBeenCalledWith(
      "INSERT INTO dosen (nip, name, username, password) VALUES ($nip, $name, $username, $password) RETURNING id",
      {
        $nip: dosenData.nip,
        $name: dosenData.name,
        $username: dosenData.username,
        $password: dosenData.password,
      }
    );
    expect(result).toBe(1);
  });

  test("should find by id", () => {
    const { password, ...dosenWithoutPassword } = fullDosenData;
    mockQuery.mockReturnValueOnce([dosenWithoutPassword]);
    const result = repo.findById(1);
    expect(mockQuery).toHaveBeenCalledWith(
      "SELECT id, username, name, created_at, updated_at FROM dosen WHERE id = ?",
      [1]
    );
    expect(result).toEqual(dosenWithoutPassword);
  });
  
  test("should find by username", () => {
    mockQuery.mockReturnValueOnce([fullDosenData]);
    const result = repo.findByUsername("test.dosen");
    expect(mockQuery).toHaveBeenCalledWith("SELECT * FROM dosen WHERE username = ?", ["test.dosen"]);
    expect(result).toEqual(fullDosenData);
  });

  test("should get all dosens", () => {
    const { password, ...dosenWithoutPassword } = fullDosenData;
    mockQuery.mockReturnValueOnce([dosenWithoutPassword]);
    const result = repo.all(1, 10);
    expect(mockQuery).toHaveBeenCalledWith(
      "SELECT id, username, name, created_at, updated_at FROM dosen LIMIT ? OFFSET ?",
      [10, 0]
    );
    expect(result).toEqual([dosenWithoutPassword]);
  });

  test("should update a dosen", () => {
    const updateData = { name: "Updated Name" };
    repo.update(1, updateData);
    expect(mockQuery).toHaveBeenCalledWith(
      `UPDATE dosen SET name = ?, updated_at = STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW') WHERE id = ?`,
      ["Updated Name", 1]
    );
  });

  test("should delete a dosen", () => {
    repo.delete(1);
    expect(mockQuery).toHaveBeenCalledWith("DELETE FROM dosen WHERE id = ?", [1]);
  });
});
