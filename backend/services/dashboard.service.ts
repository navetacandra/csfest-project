import { NewsService } from '../services/news.service';
import { ClassService } from '../services/class.service';
import { TaskService } from '../services/task.service';
import { Sqlite } from '../config/database';
import type { News } from '../models/news.model';
import type { Class } from '../models/class.model';
import type { TaskItem } from './task.service';

interface DashboardData {
    news: News[];
    schedule: Class[];
    tasks: TaskItem[];
    classes: Class[];
}

export class DashboardService {
    private newsService: NewsService;
    private classService: ClassService;
    private taskService: TaskService;

    constructor(sqlite: Sqlite) {
        this.newsService = new NewsService(sqlite);
        this.classService = new ClassService(sqlite);
        this.taskService = new TaskService(sqlite);
    }

    async getDashboardData(userId: number, role: "mahasiswa" | "dosen" | "admin"): Promise<DashboardData> {
        const news = this.newsService.getAll(1, 5);
        const schedule = this.classService.getSchedule(userId, role, new Date().getDay());
        const tasks = this.taskService.getTasks(userId, 'incoming');
        const classes = this.classService.getFollowedClasses(userId, role);

        return {
            news,
            schedule,
            tasks,
            classes
        };
    }
}