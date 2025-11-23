import { describe, test, expect, beforeAll, afterAll } from "bun:test";
import { PresenceRepository } from "../presence.repository";
import type { Presence } from "../../models/presence.model";
import { Sqlite } from "../../config/database";

const DB_TEST = "presence_repository_test.sqlite";
let sqlite: Sqlite;
let repo: PresenceRepository;

beforeAll(async () => {
  sqlite = await Sqlite.createInstance(DB_TEST);
  repo = new PresenceRepository(sqlite);
});

afterAll(() => {
  const dbPath = Bun.fileURLToPath(
    import.meta.resolve(`${__dirname}/../../database/${DB_TEST}`),
  );
  sqlite.close();
  Bun.file(dbPath).delete();
});

describe("PresenceRepository", () => {
  const presenceData: Omit<Presence, "id" | "created_at" | "updated_at"> = {
    class_enrollment_id: 1,
    schedule_date: "2025-11-22",
    status: "hadir",
    late_time: 0,
  };
  let createdPresenceId: number;

  test("should create a presence record", () => {
    createdPresenceId = repo.create(presenceData) as number;

    // Verifikasi bahwa data benar-benar ada di database dengan mengaksesnya kembali
    const result = repo.findById(createdPresenceId);
    expect(result).not.toBeNull();
    expect(result?.class_enrollment_id).toBe(presenceData.class_enrollment_id);
    expect(result?.status).toBe(presenceData.status);
  });

  test("should find by id", () => {
    const result = repo.findById(createdPresenceId);

    expect(result).not.toBeNull();
    expect(result?.id).toBe(createdPresenceId);
  });

  test("should find by class enrollment id", () => {
    const result = repo.findByClassEnrollmentId(
      presenceData.class_enrollment_id,
    );

    expect(result).toContainEqual(
      expect.objectContaining({
        id: createdPresenceId,
        class_enrollment_id: presenceData.class_enrollment_id,
      }),
    );
  });

  test("should find by class id", () => {
    const result = repo.findByClass(1);

    expect(result).toContainEqual(
      expect.objectContaining({
        id: createdPresenceId,
        class_enrollment_id: presenceData.class_enrollment_id,
      }),
    );
  });

  test("should delete a presence record", () => {
    // Buat data baru untuk dihapus
    const testData: Omit<Presence, "id" | "created_at" | "updated_at"> = {
      ...presenceData,
      class_enrollment_id: 2,
    };
    const testPresenceId = repo.create(testData);

    // Pastikan data ada sebelum dihapus
    expect(repo.findById(testPresenceId)).not.toBeNull();

    repo.delete(testPresenceId);

    // Verifikasi bahwa data sudah dihapus
    const deletedPresence = repo.findById(testPresenceId);
    expect(deletedPresence).toBeNull();
  });
});
