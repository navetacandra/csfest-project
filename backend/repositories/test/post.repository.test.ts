import { describe, test, expect, mock, jest } from "bun:test";
import { PostRepository } from "../post.repository";
import { Post } from "../../models/post.model";

// Mock the sqlite dependency
const mockQuery = jest.fn();
mock.module("../..", () => ({
  sqlite: {
    query: mockQuery,
  },
}));

describe("PostRepository", () => {
  const repo = new PostRepository();
  const postData: Omit<Post, "id" | "created_at" | "updated_at"> = {
    class_id: 1,
    class_enrollment_id: 1,
    file_id: 1,
    message: "Test Post",
    type: "post",
  };
  const fullPostData: Post = {
    id: 1,
    ...postData,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  test("should create a post", () => {
    mockQuery.mockReturnValueOnce([{ id: 1 }]);
    const result = repo.create(postData);
    expect(mockQuery).toHaveBeenCalledWith(
      "INSERT INTO post (class_id, class_enrollment_id, file_id, message, type) VALUES ($class_id, $class_enrollment_id, $file_id, $message, $type) RETURNING id",
      {
        $class_id: postData.class_id,
        $class_enrollment_id: postData.class_enrollment_id,
        $file_id: postData.file_id,
        $message: postData.message,
        $type: postData.type,
      }
    );
    expect(result).toBe(1);
  });

  test("should find by id", () => {
    mockQuery.mockReturnValueOnce([fullPostData]);
    const result = repo.findById(1);
    expect(mockQuery).toHaveBeenCalledWith("SELECT * FROM post WHERE id = ?", [1]);
    expect(result).toEqual(fullPostData);
  });

  test("should find by class id", () => {
    mockQuery.mockReturnValueOnce([fullPostData]);
    const result = repo.findByClassId(1);
    expect(mockQuery).toHaveBeenCalledWith("SELECT * FROM post WHERE class_id = ?", [1]);
    expect(result).toEqual([fullPostData]);
  });
  
  test("should get all posts", () => {
    mockQuery.mockReturnValueOnce([fullPostData]);
    const result = repo.all(1, 10);
    expect(mockQuery).toHaveBeenCalledWith("SELECT * FROM post LIMIT ? OFFSET ?", [10, 0]);
    expect(result).toEqual([fullPostData]);
  });
  
  test("should update a post", () => {
    const updateData = { message: "Updated Message" };
    repo.update(1, updateData);
    expect(mockQuery).toHaveBeenCalledWith(
      `UPDATE post SET message = ?, updated_at = STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW') WHERE id = ?`,
      ["Updated Message", 1]
    );
  });
  
  test("should delete a post", () => {
    repo.delete(1);
    expect(mockQuery).toHaveBeenCalledWith("DELETE FROM post WHERE id = ?", [1]);
  });
});
