import { describe, test, expect, mock, jest } from "bun:test";
import { MahasiswaRepository } from "../mahasiswa.repository";
import { Mahasiswa } from "../../models/mahasiswa.model";

// Mock the sqlite dependency
const mockQuery = jest.fn();
mock.module("../..", () => ({
  sqlite: {
    query: mockQuery,
  },
}));

describe("MahasiswaRepository", () => {
  const repo = new MahasiswaRepository();
  const mahasiswaData: Omit<Mahasiswa, "id" | "created_at" | "updated_at"> = {
    major_id: 1,
    study_program_id: 1,
    nim: "123456789",
    name: "Test Mahasiswa",
    email: "test.mahasiswa@test.com",
    username: "test.mahasiswa",
    password: "password",
  };

  const fullMahasiswaData: Mahasiswa = {
    id: 1,
    ...mahasiswaData,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  test("should create a mahasiswa", () => {
    mockQuery.mockReturnValueOnce([{ id: 1 }]);
    const result = repo.create(mahasiswaData);
    expect(mockQuery).toHaveBeenCalledWith(
      "INSERT INTO mahasiswa (major_id, study_program_id, nim, name, email, username, password) VALUES ($major_id, $study_program_id, $nim, $name, $email, $username, $password) RETURNING id",
      {
        $major_id: mahasiswaData.major_id,
        $study_program_id: mahasiswaData.study_program_id,
        $nim: mahasiswaData.nim,
        $name: mahasiswaData.name,
        $email: mahasiswaData.email,
        $username: mahasiswaData.username,
        $password: mahasiswaData.password,
      }
    );
    expect(result).toBe(1);
  });
  
  test("should get all mahasiswas", () => {
    const { password, ...rest } = fullMahasiswaData;
    mockQuery.mockReturnValueOnce([rest]);
    const result = repo.all(1, 10);
    expect(mockQuery).toHaveBeenCalledWith(
      "SELECT id, username, name, nim, study_program_id, created_at, updated_at FROM mahasiswa LIMIT ? OFFSET ?",
      [10, 0]
    );
    expect(result).toEqual([rest]);
  });

  test("should find by id", () => {
    const { password, ...rest } = fullMahasiswaData;
    mockQuery.mockReturnValueOnce([rest]);
    const result = repo.findById(1);
    expect(mockQuery).toHaveBeenCalledWith(
      "SELECT id, username, name, nim, study_program_id, created_at, updated_at FROM mahasiswa WHERE id = ?",
      [1]
    );
    expect(result).toEqual(rest);
  });

  test("should find by username", () => {
    mockQuery.mockReturnValueOnce([fullMahasiswaData]);
    const result = repo.findByUsername("test.mahasiswa");
    expect(mockQuery).toHaveBeenCalledWith(
      "SELECT * FROM mahasiswa WHERE username = ?",
      ["test.mahasiswa"]
    );
    expect(result).toEqual(fullMahasiswaData);
  });
  
  test("should update a mahasiswa", () => {
    const updateData = { name: "Updated Name" };
    repo.update(1, updateData);
    expect(mockQuery).toHaveBeenCalledWith(
      `UPDATE mahasiswa SET name = ?, updated_at = STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW') WHERE id = ?`,
      ["Updated Name", 1]
    );
  });
  
  test("should delete a mahasiswa", () => {
    repo.delete(1);
    expect(mockQuery).toHaveBeenCalledWith(
      "DELETE FROM mahasiswa WHERE id = ?",
      [1]
    );
  });
});
