import { sqlite } from "..";
import type { ClassEnrollment } from "../models/class_enrollment.model";

export class ClassEnrollmentRepository {
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
