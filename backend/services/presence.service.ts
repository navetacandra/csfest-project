import { PresenceRepository } from "../repositories/presence.repository";
import { ClassEnrollmentRepository } from "../repositories/classEnrollment.repository";
import { ClassRepository } from "../repositories/class.repository";
import { MahasiswaRepository } from "../repositories/mahasiswa.repository";
import type { Presence } from "../models/presence.model";
import { Sqlite } from "../config/database";

type PresencePayload = {
  schedule_date: string;
  status: "hadir" | "izin" | "sakit" | "alpha";
  studentId?: number;
  late_time?: number;
};

export class PresenceService {
  private presenceRepository: PresenceRepository;
  private classEnrollmentRepository: ClassEnrollmentRepository;
  private classRepository: ClassRepository;
  private mahasiswaRepository: MahasiswaRepository;

  constructor(sqlite: Sqlite) {
    this.presenceRepository = new PresenceRepository(sqlite);
    this.classEnrollmentRepository = new ClassEnrollmentRepository(sqlite);
    this.classRepository = new ClassRepository(sqlite);
    this.mahasiswaRepository = new MahasiswaRepository(sqlite);
  }

  setPresence(
    classId: number,
    actor: { role: "dosen" | "mahasiswa"; id: number },
    payload: PresencePayload | PresencePayload[],
  ) {
    if (actor.role === "dosen") {
      if (!Array.isArray(payload)) {
        throw new Error("Dosen must provide an array of presence data.");
      }
      return this.setDosenPresence(classId, payload);
    } else {
      if (Array.isArray(payload)) {
        throw new Error("Mahasiswa can only set their own presence.");
      }
      return this.setMahasiswaPresence(classId, actor.id, payload);
    }
  }

  private setDosenPresence(classId: number, payload: PresencePayload[]) {
    const enrollments =
      this.classEnrollmentRepository.findByClassId(classId);
    const presencesToUpdate = payload.map((p) => {
      if (!p.studentId) {
        throw new Error("studentId is required for each presence entry.");
      }
      const enrollment = enrollments.find(
        (e) => e.mahasiswa_id === p.studentId,
      );
      if (!enrollment) {
        throw new Error(
          `Student with id ${p.studentId} is not enrolled in this class.`,
        );
      }
      return {
        class_enrollment_id: enrollment.id,
        schedule_date: p.schedule_date,
        status: p.status,
        late_time: p.late_time || 0,
      };
    });

    this.presenceRepository.createOrUpdateMany(presencesToUpdate);
  }

  private setMahasiswaPresence(
    classId: number,
    studentId: number,
    payload: PresencePayload,
  ) {
    if (payload.studentId || payload.late_time) {
      throw new Error(
        "Mahasiswa cannot set presence for other students or specify lateness.",
      );
    }

    const today = new Date();
    const schedule_date = today.toISOString().split("T")[0]!; // YYYY-MM-DD

    const enrollment = this.classEnrollmentRepository.find(
      studentId,
      classId,
      "mahasiswa",
    );
    if (!enrollment) {
      throw new Error("Student is not enrolled in this class.");
    }

    const existingPresence = this.presenceRepository.findByEnrollmentIdAndDate(
      enrollment.id,
      schedule_date,
    );

    const presenceData = {
      class_enrollment_id: enrollment.id,
      schedule_date: schedule_date,
      status: "hadir" as const,
      late_time: 0,
    };

    if (existingPresence) {
      this.presenceRepository.update(existingPresence.id, {
        status: "hadir",
        late_time: 0,
      });
      return this.presenceRepository.findById(existingPresence.id);
    } else {
      const newId = this.presenceRepository.create(presenceData);
      return this.presenceRepository.findById(newId);
    }
  }

  getMahasiswaRecap(studentId: number) {
    const enrollments =
      this.classEnrollmentRepository.findByMahasiswaId(studentId);
    if (enrollments.length === 0) {
      return { lateness_time: 0, data: [] };
    }

    const classIds = enrollments.map((e) => e.class_id);
    const classes = this.classRepository.findByIds(classIds);
    const presences = this.presenceRepository.findByEnrollmentIds(
      enrollments.map((e) => e.id),
    );

    let totalLateTime = 0;
    presences.forEach((p) => {
      totalLateTime += p.late_time || 0;
    });

    const recapData = classes.map((c) => {
      const classPresences = presences.filter((p) => p.class_id === c.id);
      const scheduleDates = this.generateScheduleDates(
        c.activated_at,
        c.schedule,
      );

      const recap = scheduleDates.map((date) => {
        const presence = classPresences.find((p) => p.schedule_date === date);
        return {
          schedule_date: date,
          status: presence ? presence.status : null,
          late_time: presence ? presence.late_time : null,
        };
      });

      return {
        class_id: c.id,
        class_name: c.name,
        recap: recap,
      };
    });

    return { lateness_time: totalLateTime, data: recapData };
  }

  getDosenRecap(classId: number) {
    const klass = this.classRepository.findById(classId);
    if (!klass) {
      throw new Error("Class not found");
    }

    const members = this.mahasiswaRepository.findMembersByClassId(classId);
    const presences = this.presenceRepository.findByClass(classId);
    const scheduleDates = this.generateScheduleDates(
      klass.activated_at,
      klass.schedule,
    );

    const recap = scheduleDates.map((date) => {
      const data = members.map((member) => {
        const presence = presences.find(
          (p) =>
            p.mahasiswa_id === member.id && p.schedule_date === date,
        );
        return {
          mahasiswa_id: member.id,
          status: presence ? presence.status : null,
          late_time: presence ? presence.late_time : null,
        };
      });
      return { schedule_date: date, data };
    });

    return {
      members: members.map((m) => ({
        mahasiswa_id: m.id,
        nim: m.nim,
        name: m.name,
      })),
      recap,
    };
  }

  private generateScheduleDates(
    activatedAt: string,
    scheduleDay: number,
  ): string[] {
    const startDate = new Date(activatedAt.replace(" ", "T") + "Z"); // Treat as UTC
    const dates: string[] = [];
    let currentDay = startDate.getUTCDay(); // Use getUTCDay()
    let dayDiff = scheduleDay - currentDay;
    if (dayDiff < 0) {
      dayDiff += 7;
    }

    const firstScheduleDate = new Date(startDate);
    firstScheduleDate.setUTCDate(startDate.getUTCDate() + dayDiff); // Use setUTCDate()

    for (let i = 0; i < 18; i++) {
      const scheduleDate = new Date(firstScheduleDate);
      scheduleDate.setUTCDate(firstScheduleDate.getUTCDate() + i * 7); // Use setUTCDate()
      dates.push(scheduleDate.toISOString().split("T")[0]!);
    }
    return dates;
  }
}
