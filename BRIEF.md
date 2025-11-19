# Project Brief

## Table of Content

- [API Contract](#api-contract)
  - [Response Structure](#response-structure)
  - [Endpoints](#api-endpoints)
- [Back-End Specification](#backend-spec)
- [Front-End Specifiaction](#frontend-spec)

## API Contract {#api-contract}

### Response Structure {#response-structure}

**Success**

```ts
{
  code: number,
  data: any,
  meta?: any
}
```

**Error**

```ts
{
  code: number,
  error: {
    message: string,
    code: string,
    details?: any
  }
}
```

### Endpoints {#api-endpoints}

- Data Management
  - Jurusan dan Prodi
    - `/api/admin/major`
      - `GET`
        - **Role**: admin
        - **Description**: Get list of majors
        - **Response Data**:
        ```ts
        {
          id: number,
          name: string;
        }[]
        ```
      - `POST`
        - **Role**: admin
        - **Description**: Create major's data
        - **Payload**:

        ```ts
        {
          name: string;
        }
        ```

        - **Response Data**:

        ```ts
        {
          id: number,
          name: string;
        }
        ```

    - `/api/admin/major/{id}`
      - `DELETE`
        - **Role**: admin
        - **Description**: Delete specific major
        - **Response Data**:
        ```ts
        {
          id: number,
          name: string;
        }
        ```
    - `/api/admin/major/{major_id}/study_program`
      - `GET`
        - **Role**: admin
        - **Description**: Get list of study program
        - **Response Data**:
        ```ts
        {
          id: number,
          name: string;
        }[]
        ```
      - `POST`
        - **Role**: admin
        - **Description**: Create study program's data
        - **Payload**:

        ```ts
        {
          name: string;
        }
        ```

        - **Response Data**:

        ```ts
        {
          id: number,
          name: string;
        }
        ```

    - `/api/admin/major/{major_id}/study_program/{id}`
      - `DELETE`
        - **Role**: admin
        - **Description**: Delete specific study program
        - **Response Data**:
        ```ts
        {
          id: number,
          name: string;
        }
        ```

  - Mahasiswa
    - `/api/admin/mahasiswa`
      - `GET`
        - **Role**: admin
        - **Description**: Get list of mahasiswa
        - **Payload**:

        ```ts
        {
          name?: string,
          major_id?: number,
          study_program_id?: number,
          page: number,
          limit: number,
        }
        ```

        - **Response Data**:

        ```ts
        {
          id: number,
          name: string,
          major: string,
          study_program: string
        }[]
        ```

      - `POST`
        - **Role**: admin
        - **Description**: Create mahasiswa's data
        - **Payload**:

        ```ts
        {
          nim: string,
          name: string,
          major_id: number,
          study_program_id: number
        }
        ```

        - **Response Data**:

        ```ts
        {
          id: number,
          name: string,
          major_id: number,
          study_program_id: number
        }
        ```

    - `/api/admin/mahasiswa/{id}`
      - `GET`
        - **Role**: admin
        - **Description**: Get mahasiswa's detail
        - **Response Data**:
        ```ts
        {
          id: number,
          name: string,
          major: string,
          study_program: string
        }
        ```
      - `PUT`
        - **Role**: admin
        - **Description**: Edit specific mahasiswa
        - **Payload**:

        ```ts
        {
          nim: string,
          name: string,
          major_id: number,
          study_program_id: number
        }
        ```

        - **Response Data**:

        ```ts
        {
          id: number,
          name: string,
          major_id: number,
          study_program_id: number,
        }
        ```

      - `DELETE`
        - **Role**: admin
        - **Description**: Delete specific mahasiswa
        - **Response Data**:
        ```ts
        {
          id: number,
          name: string,
          major_id: number,
          study_program_id: number,
        }
        ```

  - Dosen
    - `/api/admin/dosen`
      - `GET`
        - **Role**: admin
        - **Description**: Get list of dosen
        - **Payload**:

        ```ts
        {
          nip?: string,
          name?: string,
          page: number,
          limit: number,
        }
        ```

        - **Response Data**:

        ```ts
        {
          id: number,
          nip: string,
          name: string
        }[]
        ```

      - `POST`
        - **Role**: admin
        - **Description**: Create dosen's data
        - **Payload**:

        ```ts
        {
          nip: string,
          name: string
        }
        ```

        - **Response Data**:

        ```ts
        {
          id: number,
          nip: string,
          name: string
        }
        ```

    - `/api/admin/dosen/{id}`
      - `GET`
        - **Role**: admin
        - **Description**: Get dosen's detail
        - **Response Data**:
        ```ts
        {
          id: number,
          nip: string,
          name: string
        }
        ```
      - `PUT`
        - **Role**: admin
        - **Description**: Edit specific dosen
        - **Payload**:

        ```ts
        {
          nip: string,
          name: string
        }
        ```

        - **Response Data**:

        ```ts
        {
          id: number,
          nip: string,
          name: string
        }
        ```

      - `DELETE`
        - **Role**: admin
        - **Description**: Delete specific dosen
        - **Response Data**:
        ```ts
        {
          id: number,
          nip: string,
          name: string
        }
        ```

  - Class
    - `/api/admin/classes`
      - `POST`
        - **Role**: admin
        - **Description**: Creating new class
        - **Payload**:

        ```ts
        {
          name: string,
          schedule:  1..7 // based on day
        }
        ```

        - **Response Data**:

        ```ts
        {
          id: number,
          name: string,
          schedule: number,
          enroll_key: string,
        }
        ```

  - News
    - `/api/admin/news`
      - `GET`
        - **Role**: admin
        - **Description**: Get all news, sorted by newest
        - **Response Data**:
        ```ts
        {
          id: number,
          title: string,
        }[]
        ```
      - `POST`
        - **Role**: admin
        - **Description**: Create news
        - **Payload**:

        ```ts
        {
          title: string,
          content: string
        }
        ```

        - **Response Data**:

        ```ts
        {
          id: number,
          title: string,
        }
        ```

    - `/api/admin/news/{id}`
      - `GET`
        - **Role**: admin
        - **Description**: Get news detail
        - **Response Data**:
        ```ts
        {
          id: number,
          title: string,
          content: string
        }
        ```
      - `DELETE`
        - **Role**: admin
        - **Description**: Delete news
        - **Response Data**:
        ```ts
        {
          id: number,
          title: string,
        }
        ```
      - `PUT`
        - **Role**: admin
        - **Description**: Edit news
        - **Payload**:

        ```ts
        {
          title: string,
          content: string
        }
        ```

        - **Response Data**:

        ```ts
        {
          id: number,
          title: string,
        }
        ```

- Authentication
  - `/api/login`
    - `POST`
      - **Role**: admin | dosen | mahasiswa
      - **Description**: Authentication (login) endpoint
      - **Payload**:
      ```ts
      {
        username: string,
        password: string
      }
      ```

      - **Response Data**:
        ```ts
        {
          token: string,
          role: string,
        }
        ```
  - `/api/logout`
    - `DELETE`
      - **Role**: admin | dosen | mahasiswa
      - **Description**: Authentication (logout) endpoint
      - **Response Data**:
      ```ts
      {
      }
      ```
- Profile
  - `/me`
    - `GET`
      - **Role**: admin | dosen | mahasiswa
      - **Description**: Get profile detail
      - **Response Data**:
      ```ts
      {
        nim?: string,
        nip?: string,
        name: string,
        email: string,
        username: string,
      }
      ```
- Class
  - General
    - `/api/classes`
      - `GET`
        - **Role**: admin | dosen | mahasiswa
        - **Description**: Get list of followed class
        - **Response Data**:
        ```ts
        {
          id: number,
          name: string,
        }[]
        ```
    - `/api/classes/enroll`
      - `POST`
        - **Role**: dosen | mahasiswa
        - **Description**: Enroll class by key
        - **Payload**:
        ```ts
        {
          enroll_key: string;
        }
        ```

        - **Response Data**:
        ```ts
        {
          id: number,
          name: string,
        }
        ```
    - `/api/classes/{class_id}`
      - `GET`
        - **Role**: admin | dosen | mahasiswa
        - **Description**: Get current class posts sorted by time
        - **Response Data**:
        ```ts
        {
          id: number,
          name: string,
          posts: {
            id: number,
            title: string
          }[]
        }
        ```
  - Post
    - `/api/classes/{class_id}/posts`
      - `POST`
        - **Role**: admin | dosen
        - **Description**: Create new post on class
        - **Payload**:
        ```ts
        {
          title: string,
          message: string,
          type: "post" | "task",
          file: File // embedded file (single file)
        }
        ```

        - **Response Data**:
        ```ts
        {
          id: number,
          title: string,
          type: "post" | "task"
        }
        ```
    - `/api/classes/{class_id}/posts/{post_id}`
      - `GET`
        - **Role**: admin | dosen | mahasiswa
        - **Description**: Get detail of post
        - **Response Data**:
        ```ts
        {
          id: number,
          title: string,
          type: "post" | "task",
          message: string,
          file: string
        }
        ```
      - `DELETE`
        - **Role**: admin | dosen
        - **Description**: Delete post
        - **Response Data**:
        ```ts
        {
          id: number,
        }
        ```
      - `PUT`
        - **Role**: admin | dosen
        - **Description**: Edit post
        - **Payload**:
        ```ts
        {
          title: string,
          message: string,
          type: "post" | "task",
          file: File // embedded file (single file)
        }
        ```

        - **Response Data**:
        ```ts
        {
          id: number,
        }
        ```
    - `/api/classes/{class_id}/posts/{post_id}/task`
      - `POST`
        - **Role**: mahasiswa
        - **Description**: Upload completed task file
        - **Payload**:
        ```ts
        {
          file: File; // task's file (single file)
        }
        ```

        - **Response Data**:
        ```ts
        {
          id: number,
        }
        ```
- Schedule
  - `/api/schedule`
    - `GET`
      - **Role**: dosen | mahasiswa
      - **Description**: Get schedule of followed class
      - **Response Data**:
        ```ts
        {
          id: number,
          name: string,
          schedule: 1..7
        }[]
        ```
  - `/api/schedule/current`
    - `GET`
      - **Role**: dosen | mahasiswa
      - **Description**: Get today's schedule
      - **Response Data**:
        ```ts
        {
          id: number,
          name: string,
          schedule: 1..7
        }[]
        ```
- Presence
  - `/api/presence/recap`
    - `GET`
      - **Role**: mahasiswa
      - **Description**: Get presence recap and accumulated lateness
      - **Response Data**:
      ```ts
      {
        accumulated_late: number,
        recap: {
          id: number,
          class: string,
          status: string,
          late_time: number
        }[],
      }
      ```
  - `/api/presence/{class_id}`
    - `GET`
      - **Role**: dosen | mahasiswa
      - **Description**: Get list of class follower (Mahasiswa)
      - **Response Data**:
      ```ts
      {
        id: number,
        nim: string,
        name: string,
      }[]
      ```
  - `/api/presence/{class_id}`
    - `POST`
      **Description**: Set presence status
      **Payload**:
      ```ts
      {
        status: "hadir" | "izin" | "sakit" | "alpha", // only able set to "hadir" as mahasiswa
        mahasiswa_id: number, // only allow if sent as dosen
        late_time?: 0, // in minute, only allow if sent as dosen
      }
      ```

      - **Response Data**:
      ```ts
      {
        status: string,
      }
      ```
- General
  - `/api/dashboard`
    - `GET`
      - **Role**: admin | dosen | mahasiswa
      - **Description**: Get summary of incoming task, current schedule, latest news.
      - **Response Data**:
      ```ts
      {
        news: {
          title: string,
          content: string,
        }[],
        schedule: {
          name: string
        }[],
        tasks: {
          id: number,
          class_id: number,
          title: string,
        },
      }
      ```
  - `/api/tasks` **Mahasiswa/Dosen Only**
    - `GET`
      - **Role**: dosen | mahasiswa
      - **Description**: Get all/completed/incoming tasks on followed class
      - **Payload**:
      ```ts
      {
        filter: "all" | "completed" | "incoming";
      }
      ```

      - **Response Data**:
      ```ts
      {
        id: number,
        class_id: number,
        title: string,
        status: "completed" | "incoming"
      }[]
      ```
  - `/storage/{file_id}`
    - `GET`
      - **Role**: admin | dosen | mahasiswa
      - **Description**: Get file by id (download)

## Back-End Specification {#backend-spec}

**Stack**: Bun v1.3.2 (TypeScript), SQLite3
**Framework**: Express
**Timezone**: Asia/Jakarta
**File Storage**: local
**File Upload Sepc**:
- Allowed Type: pdf/jpg/png/docx
- Max Size: 10 MB
**Environment Variable**:

```env
PORT=
JWT_SECRET_KEY=
PASSWORD_SECRET_KEY=
```

**Database Design**:

```dbml
Table major {
  id int [pk, not null]
  name varchar [not null]
  created_at timestamp [not null, default: `now()`]
  updated_at timestamp [not null, default: `now()`]
}

Table study_program {
  id int [pk, not null]
  major_id int [not null]
  name varchar [not null]
  created_at timestamp [not null, default: `now()`]
  updated_at timestamp [not null, default: `now()`]
}

Table file {
  id int [pk, not null]
  mahasiswa_id int [null]
  dosen_id int [null]
  upload_name varchar [not null]
  random_name varchar [not null, unique]
  created_at timestamp [not null, default: `now()`]
  updated_at timestamp [not null, default: `now()`]
}

Table admin {
  id int [pk, not null]
  name varchar [not null]
  email varchar [not null, unique]
  username varchar [not null, unique]
  password varchar [not null]
  created_at timestamp [not null, default: `now()`]
  updated_at timestamp [not null, default: `now()`]
}

Table mahasiswa {
  id int [pk, not null]
  major_id int [not null]
  study_program_id int [not null]
  nim varchar [not null]
  name varchar [not null]
  email varchar [not null, unique]
  username varchar [not null, unique]
  password varchar [not null]
  created_at timestamp [not null, default: `now()`]
  updated_at timestamp [not null, default: `now()`]
}

Table dosen {
  id int [pk, not null]
  nip varchar [not null]
  name varchar [not null]
  email varchar [not null, unique]
  username varchar [not null, unique]
  password varchar [not null]
  created_at timestamp [not null, default: `now()`]
  updated_at timestamp [not null, default: `now()`]
}

Table news {
  id int [pk, not null]
  title varchar [not null]
  content text [not null]
  created_at timestamp [not null, default: `now()`]
  updated_at timestamp [not null, default: `now()`]
}

Table class {
  id int [pk, not null]
  name varchar [not null]
  enroll_key varchar [not null, unique]
  schedule int [not null]
  created_at timestamp [not null, default: `now()`]
  updated_at timestamp [not null, default: `now()`]
}

Table class_enrollment {
  id int [pk, not null]
  class_id int [not null]
  mahasiswa_id int [null]
  dosen_id int [null]
  admin_id int [null]
  created_at timestamp [not null, default: `now()`]
  updated_at timestamp [not null, default: `now()`]
}

Table post {
  id int [pk, not null]
  class_id int [not null]
  class_enrollment_id int [not null]
  file_id int [null]
  message text
  type enum('post', 'task') [not null, default: 'post']
  created_at timestamp [not null, default: `now()`]
  updated_at timestamp [not null, default: `now()`]
}

Table task {
  id int [pk, not null]
  post_id int [not null]
  class_enrollment_id int [not null]
  file_id int [not null]
  created_at timestamp [not null, default: `now()`]
  updated_at timestamp [not null, default: `now()`]
}

Table presence {
  id int [pk, not null]
  class_enrollment_id int [not null]
  status enum('hadir', 'sakit', 'izin', 'alpha') [not null, default: 'hadir']
  late_time int [not null, default: 0]
  created_at timestamp [not null, default: `now()`]
  updated_at timestamp [not null, default: `now()`]
}

Ref: study_program.major_id > major.id
Ref: mahasiswa.major_id > major.id
Ref: mahasiswa.study_program_id > study_program.id
Ref: class_enrollment.class_id > class.id
Ref: class_enrollment.mahasiswa_id > mahasiswa.id
Ref: class_enrollment.dosen_id > dosen.id
Ref: class_enrollment.admin_id > admin.id
Ref: post.class_id > class.id
Ref: post.class_enrollment_id > class_enrollment.id
Ref: post.file_id > file.id
Ref: task.post_id > post.id
Ref: task.class_enrollment_id > class_enrollment.id
Ref: task.file_id > file.id
Ref: presence.class_enrollment_id > class_enrollment.id
```

## Front-End Specification {#frontend-spec}

- **Stack**: ReactJS, Tailwind
- **Style**: Neo-Brutalism, Bento Layout
- **Fonts**: Outfit (Normal), Archivo Black (Bold)
- **Color Palette**:
  - #FFFFFF (White)
  - #333333 (Black)
  - #E63946 (Red)
  - #FFD700 (Yellow)
  - #00FF7F (Green)
