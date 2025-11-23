import { PresenceRepository } from "../repositories/presence.repository";
import { ClassEnrollmentRepository } from "../repositories/classEnrollment.repository";
import type { Presence } from "../models/presence.model";
import { Sqlite } from "../config/database";

export class PresenceService {
  private presenceRepository: PresenceRepository;
  private classEnrollmentRepository: ClassEnrollmentRepository;

  constructor(sqlite: Sqlite) {
    this.presenceRepository = new PresenceRepository(sqlite);
    this.classEnrollmentRepository = new ClassEnrollmentRepository(sqlite);
  }

  setPresence(
    classId: number,
    actor: { role: "dosen" | "mahasiswa"; id: number },
    payload: {
      schedule_date: string;
      status: "hadir" | "izin" | "sakit" | "alpha";
      studentId?: number;
      late_time?: number;
    },
  ) {
    let studentIdToSet: number;
    let statusToSet = payload.status;
    let lateTimeToSet = payload.late_time || 0;

    if (actor.role === "mahasiswa") {
      if (
        payload.status !== "hadir" ||
        payload.studentId ||
        payload.late_time
      ) {
        throw new Error(
          "Mahasiswa can only set their own status to 'hadir' with no lateness.",
        );
      }
      studentIdToSet = actor.id;
      statusToSet = "hadir";
      lateTimeToSet = 0;
    } else {
      if (!payload.studentId) {
        throw new Error("studentId is required for dosen to set presence.");
      }
      studentIdToSet = payload.studentId;
    }

    const enrollments =
      this.classEnrollmentRepository.findByMahasiswaId(studentIdToSet);
    const enrollment = enrollments.find((e) => e.class_id === classId);
    if (!enrollment) {
      throw new Error("Student is not enrolled in this class.");
    }

    const existingPresence = this.presenceRepository.findByEnrollmentIdAndDate(
      enrollment.id,
      payload.schedule_date,
    );

    if (existingPresence) {
      const updatedData = {
        status: statusToSet,
        late_time: lateTimeToSet,
      };
      this.presenceRepository.update(existingPresence.id, updatedData);
      return this.presenceRepository.findById(existingPresence.id);
    } else {
      const presenceData = {
        class_enrollment_id: enrollment.id,
        schedule_date: payload.schedule_date,
        status: statusToSet,
        late_time: lateTimeToSet,
      };
      const newPresenceId = this.presenceRepository.create(presenceData);
      return this.presenceRepository.findById(Number(newPresenceId));
    }
  }

  getRecap(studentId: number) {
    const enrollments =
      this.classEnrollmentRepository.findByMahasiswaId(studentId);
    if (enrollments.length === 0) {
      return { accumulated_late: 0, recap: [] };
    }
    const enrollmentIds = enrollments.map((e) => e.id);

    const presences =
      this.presenceRepository.findByEnrollmentIds(enrollmentIds);

    let accumulated_late = 0;
    presences.forEach((p) => {
      accumulated_late += p.late_time || 0;
    });

    return { accumulated_late, recap: presences };
  }
}
