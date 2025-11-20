CREATE TABLE IF NOT EXISTS class_enrollment (
  id INTEGER PRIMARY KEY NOT NULL,
  class_id INTEGER NOT NULL,
  mahasiswa_id INTEGER,
  dosen_id INTEGER,
  admin_id INTEGER,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (class_id) REFERENCES class(id),
  FOREIGN KEY (mahasiswa_id) REFERENCES mahasiswa(id),
  FOREIGN KEY (dosen_id) REFERENCES dosen(id),
  FOREIGN KEY (admin_id) REFERENCES admin(id)
);
