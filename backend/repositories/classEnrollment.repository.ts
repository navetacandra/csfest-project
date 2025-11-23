import { sqlite } from "..";
import type { ClassEnrollment } from "../models/class_enrollment.model";

type ClassEnrollmentForCreate = Omit<ClassEnrollment, "id" | "created_at" | "updated_at">;

export class ClassEnrollmentRepository {
  create(data: ClassEnrollmentForCreate) {
    const result = sqlite.query(
      "INSERT INTO class_enrollment (class_id, mahasiswa_id, dosen_id, admin_id) VALUES ($class_id, $mahasiswa_id, $dosen_id, $admin_id) RETURNING id",
      {
        $class_id: data.class_id,
        $mahasiswa_id: data.mahasiswa_id,
        $dosen_id: data.dosen_id,
        $admin_id: data.admin_id,
      }
    );
    const firstResult = result[0] as { id: number | bigint };
    return firstResult.id;
  }
  
  findById(id: number) {
    const result = sqlite.query("SELECT * FROM class_enrollment WHERE id = ?", [
      id,
    ]) as ClassEnrollment[];
    return result.length > 0 ? result[0] : null;
  }

  findByClassId(classId: number) {
    return sqlite.query("SELECT * FROM class_enrollment WHERE class_id = ?", [
      classId,
    ]) as ClassEnrollment[];
  }

  findByMahasiswaId(mahasiswaId: number) {
    return sqlite.query(
      "SELECT * FROM class_enrollment WHERE mahasiswa_id = ?",
      [mahasiswaId],
    ) as ClassEnrollment[];
  }

  findByDosenId(dosenId: number) {
    return sqlite.query("SELECT * FROM class_enrollment WHERE dosen_id = ?", [
      dosenId,
    ]) as ClassEnrollment[];
  }

  findByAdminId(adminId: number) {
    return sqlite.query("SELECT * FROM class_enrollment WHERE admin_id = ?", [
      adminId,
    ]) as ClassEnrollment[];
  }

  delete(id: number) {
    sqlite.query("DELETE FROM class_enrollment WHERE id = ?", [id]);
  }
}
