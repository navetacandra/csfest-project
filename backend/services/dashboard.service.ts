import { NewsService } from '../services/news.service';
import { ClassService } from '../services/class.service';
import { TaskService } from '../services/task.service';
import { Sqlite } from '../config/database';
import type { News } from '../models/news.model';
import type { Class } from '../models/class.model';
import type { TaskItem } from './task.service';
import { PresenceRepository } from '../repositories/presence.repository';
import { ClassEnrollmentRepository } from '../repositories/classEnrollment.repository';

interface DashboardData {
    news: News[];
    schedule: (Class & { presence_status: string | null })[];
    tasks: TaskItem[];
    classes: Class[];
}

export class DashboardService {
    private newsService: NewsService;
    private classService: ClassService;
    private taskService: TaskService;
    private presenceRepository: PresenceRepository;
    private classEnrollmentRepository: ClassEnrollmentRepository;

    constructor(sqlite: Sqlite) {
        this.newsService = new NewsService(sqlite);
        this.classService = new ClassService(sqlite);
        this.taskService = new TaskService(sqlite);
        this.presenceRepository = new PresenceRepository(sqlite);
        this.classEnrollmentRepository = new ClassEnrollmentRepository(sqlite);
    }

    async getDashboardData(userId: number, role: "mahasiswa" | "dosen" | "admin"): Promise<DashboardData> {
        const news = this.newsService.getAll(1, 5);
        const schedule = this.classService.getSchedule(userId, role, new Date().getDay());
        const tasks = this.taskService.getTasks(userId, 'incoming');
        const classes = this.classService.getFollowedClasses(userId, role);

        let scheduleWithPresence: (Class & { presence_status: string | null })[] = schedule.map(s => ({ ...s, presence_status: null }));

        if (role === 'mahasiswa') {
            const today = new Date().toISOString().split('T')[0];
            const enrollments = this.classEnrollmentRepository.findByMahasiswaId(userId);
            if (enrollments.length > 0) {
                const enrollmentIds = enrollments.map(e => e.id);
                const presences = this.presenceRepository.findByEnrollmentIds(enrollmentIds)
                    .filter(p => p.schedule_date === today);

                if (presences.length > 0) {
                    const presenceMap = new Map(presences.map(p => [p.class_id, p.status]));
                    scheduleWithPresence = schedule.map(s => ({
                        ...s,
                        presence_status: presenceMap.get(s.id) || null
                    }));
                }
            }
        }

        return {
            news,
            schedule: scheduleWithPresence,
            tasks,
            classes
        };
    }
}