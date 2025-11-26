export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface Admin extends User {
}

export interface Dosen extends User {
  nip: string;
}

export interface Mahasiswa extends User {
  major_id: number;
  study_program_id: number;
  nim: string;
}

export interface ClassMember {
  id: number; // Assuming the API will provide an ID for members in the class details endpoint
  name: string;
  nim: string;
}

export interface Class {
  id: number;
  name: string;
  enroll_key: string;
  schedule: number;
  start_time: string;
  end_time: string;
  actived_at: string;
  created_at: string;
  updated_at: string;
  presence_status?: string;
  members?: ClassMember[]; // Add members array to Class interface
}

export interface News {
  id: number;
  title: string;
  thumbnail_file_id: number;
  thumbnail?: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface NewsListItem {
  id: number;
  title: string;
  thumbnail: string;
}

export interface Post {
  id: number;
  class_id: number;
  class_enrollment_id: number;
  file_id: number | null;
  message: string;
  type: string;
  created_at: string;
  updated_at: string;
}

export interface PostWithFile extends Post {
  file: File;
  task: Task;
  tasks: Task[];
}

export interface File {
  id: number;
  mahasiswa_id: number | null;
  dosen_id: number | null;
  upload_name: string;
  random_name: string;
  size: number;
  mimetype: string;
  created_at: string;
  updated_at: string;
}

export interface Task {
    id: number;
    post_id: number;
    class_enrollment_id: number;
    file_id: number;
    file?: File;
    created_at: string;
    updated_at: string;
}

export interface TaskItem {
  id: number;
  class_id: number;
  title: string;
  status: 'all' | 'completed' | 'incoming';
}

export interface PresenceStatusItem {
  schedule_date: string;
  status: 'hadir' | 'izin' | 'sakit' | 'alpha' | null;
  late_time: number | null;
}

export interface ClassPresenceRecap {
  class_id: number;
  class_name: string;
  recap: PresenceStatusItem[];
}

export interface PresenceRecap {
    total_lateness: number;
    recap: ClassPresenceRecap[]; // Changed from Presence[] to ClassPresenceRecap[]
}

export interface PresenceRecapApiResponse {
  lateness_time: number;
  data: ClassPresenceRecap[];
}

export interface PresenceUpdateItem {
  mahasiswa_id: number;
  status: string;
  late_time: number;
}

export interface BatchPresencePayload {
  class_id: number;
  schedule_date: string;
  presences: PresenceUpdateItem[];
}

export interface ClassDetails extends Class {
    posts: Post[];
}

export interface DashboardData {
    news: NewsListItem[];
    schedule: Class[];
    tasks: TaskItem[];
    classes: Class[];
}
  
export interface ApiResponse<T> {
    code: number;
    data: T;
    meta?: {
      page: number;
      limit: number;
      totalData: number;
      totalPage: number;
    }
}

export interface PaginationMeta {
    size: number;
    page: number;
    limit: number;
    totalData: number;
    totalPage: number;
}