# Ku-LMSin

Sebuah platform Learning Management System (LMS) yang dibangun dengan sepenuh hati oleh tim **_InsyaAllah Menang_** dalam rangka mengikuti Hackathon di CSFEST2025. Project ini dibuat untuk menjawab persoalan layanan akademik kampus yang kurang terintegrasi. Banyak mahasiswa mengeluhkan sistem presensi dan e-learning yang tidak terintegrasi, pengumuman yang tidak terpusat, dan lainnya.

**Ku-LMSin** menawarkan sistem presensi, schedule, e-learning, dan pengumuman yang terintegasi. **Ku-LMSin** memiliki visi _"Semua Layanan dalam Satu Platform"_.

## Brief
Baca brief project [disini](BRIEF.md)

## Live Demo
Kunjungi Live Demo [disini](https://kulmsin.juraganweb.web.id/) atau baca dokumentasi API [disini](https://doc-kulmsin.juraganweb.web.id)
> Hubungi dev@navetacandraa.my.id untuk mendapatkan kredensial

## Setup

### Clone repository

```bash
git clone https://github.com/navetacandra/csfest-project.git --depth=1
# or
git clone git@github.com:navetacandra/csfest-project.git --depth=1
```

### Sesuaikan variabel
```yaml
# docker-compose.yaml
  api-server:
    environment:
      - TZ=Asia/Jakarta
      - NODE_ENV=development # <- set ini ke production untuk strict cors 
      - PORT=5000
      - DB_NAME=sqlite.db
      - JWT_SECRET=<set-your-jwt_secret> # <- set ini ke secret key jwt
      - UPLOAD_PATH=/app/uploads
...

  nginx:
    image: nginx:1-alpine
    ports:
      - 8080:80 # <- set ke port yang mau diakses (pada contoh: 8080)
```

```conf
# config/nginx/default.conf
server_name doc-... # <- ubah ke domain yang ingin digunakan untuk akses swagger doc
server_name ... # <- ubah ke domain yang ingin digunakan untuk akses app
```

### Start
Gunakan `docker compose` untuk menjalankan project ini.

```bash
docker compose up -d --build
```

## Note
> This project was created to complete the CSFEST2025 Hackathon assignment and not built for production-ready
