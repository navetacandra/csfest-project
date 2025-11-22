import { describe, test, expect, mock, jest } from "bun:test";
import { FileRepository } from "../file.repository";
import { File } from "../../models/file.model";

// Mock the sqlite dependency
const mockQuery = jest.fn();
mock.module("../..", () => ({
  sqlite: {
    query: mockQuery,
  },
}));

describe("FileRepository", () => {
  const repo = new FileRepository();
  const fileData: Omit<File, "id" | "created_at" | "updated_at"> = {
    mahasiswa_id: 1,
    dosen_id: null,
    upload_name: "test.pdf",
    random_name: "randomstring.pdf",
    size: 12345,
    mimetype: "application/pdf",
  };

  test("should create a file record", () => {
    mockQuery.mockReturnValueOnce([{ id: 1 }]);
    const result = repo.create(fileData);
    expect(mockQuery).toHaveBeenCalledWith(
      "INSERT INTO file (mahasiswa_id, dosen_id, upload_name, random_name, size, mimetype) VALUES ($mahasiswa_id, $dosen_id, $upload_name, $random_name, $size, $mimetype) RETURNING id",
      {
        $mahasiswa_id: fileData.mahasiswa_id,
        $dosen_id: fileData.dosen_id,
        $upload_name: fileData.upload_name,
        $random_name: fileData.random_name,
        $size: fileData.size,
        $mimetype: fileData.mimetype,
      }
    );
    expect(result).toBe(1);
  });

  test("should find by random name", () => {
    const fullFileData: File = { ...fileData, id: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    mockQuery.mockReturnValueOnce([fullFileData]);
    const result = repo.findByRandomName("randomstring.pdf");
    expect(mockQuery).toHaveBeenCalledWith(
      "SELECT * FROM file WHERE random_name = ?",
      ["randomstring.pdf"]
    );
    expect(result).toEqual(fullFileData);
  });

  test("should delete a file record", () => {
    repo.delete(1);
    expect(mockQuery).toHaveBeenCalledWith("DELETE FROM file WHERE id = ?", [1]);
  });
});
