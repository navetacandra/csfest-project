export interface NewsListItem {
  id: number;
  title: string;
  thumbnail: string;
}

export interface Class {
  id: number;
  name: string;
  schedule: number;
  start_time: string;
  end_time: string;
}

export interface TaskItem {
  id: number;
  class_id: number;
  title: string;
  status: string;
}

export interface DashboardData {
  news: NewsListItem[];
  schedule: Class[];
  tasks: TaskItem[];
  classes: Class[];
}

export interface Post {
    id: number;
    message: string;
    type: string;
    created_at: string;
}

export interface ClassDetails extends Class {
    posts: Post[];
}

export interface News extends NewsListItem {
    content: string;
    created_at: string;
}
