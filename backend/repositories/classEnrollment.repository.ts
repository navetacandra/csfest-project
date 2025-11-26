import type { ClassEnrollment } from "../models/class_enrollment.model";
import type { Sqlite } from "../config/database";

type ClassEnrollmentForCreate = Omit<
  ClassEnrollment,
  "id" | "created_at" | "updated_at"
>;

export class ClassEnrollmentRepository {
  private db: Sqlite;

  constructor(db: Sqlite) {
    this.db = db;
  }

  create(data: ClassEnrollmentForCreate): number {
    const result = this.db.query(
      "INSERT INTO class_enrollment (class_id, mahasiswa_id, dosen_id, admin_id) VALUES (?, ?, ?, ?) RETURNING id",
      data.class_id,
      data.mahasiswa_id,
      data.dosen_id,
      data.admin_id,
    );
    const firstResult = result[0] as { id: number | bigint };
    return firstResult.id as number;
  }

  findById(id: number): ClassEnrollment | null {
    const result = this.db.query(
      "SELECT * FROM class_enrollment WHERE id = ?",
      id,
    ) as ClassEnrollment[];
    return result.length > 0 ? result[0]! : null;
  }

  findByClassId(classId: number): ClassEnrollment[] {
    return this.db.query(
      "SELECT * FROM class_enrollment WHERE class_id = ?",
      classId,
    ) as ClassEnrollment[];
  }

  find(
    userId: number,
    classId: number,
    role: "mahasiswa" | "dosen" | "admin",
  ): ClassEnrollment | null {
    if (!["mahasiswa", "dosen", "admin"].includes(role))
      throw new Error("invalid role");
    const result = this.db.query(
      `SELECT * FROM class_enrollment WHERE class_id = ? AND ${role}_id = ? LIMIT 1`,
      classId,
      userId,
    ) as ClassEnrollment[];
    return result[0] || null;
  }

  findByMahasiswaId(mahasiswaId: number): ClassEnrollment[] {
    return this.db.query(
      "SELECT * FROM class_enrollment WHERE mahasiswa_id = ?",
      mahasiswaId,
    ) as ClassEnrollment[];
  }

  findByDosenId(dosenId: number): ClassEnrollment[] {
    return this.db.query(
      "SELECT * FROM class_enrollment WHERE dosen_id = ?",
      dosenId,
    ) as ClassEnrollment[];
  }

  findByAdminId(adminId: number): ClassEnrollment[] {
    return this.db.query(
      "SELECT * FROM class_enrollment WHERE admin_id = ?",
      adminId,
    ) as ClassEnrollment[];
  }

  delete(id: number): void {
    this.db.query("DELETE FROM class_enrollment WHERE id = ?", id);
  }
}
