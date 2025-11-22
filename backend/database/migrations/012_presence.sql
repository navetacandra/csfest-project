CREATE TABLE IF NOT EXISTS presence (
  id INTEGER PRIMARY KEY NOT NULL,
  class_enrollment_id INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'hadir' CHECK(status IN ('hadir', 'sakit', 'izin', 'alpha')),
  late_time INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (class_enrollment_id) REFERENCES class_enrollment(id)
);
