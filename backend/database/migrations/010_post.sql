CREATE TABLE IF NOT EXISTS post (
  id INTEGER PRIMARY KEY NOT NULL,
  class_id INTEGER NOT NULL,
  class_enrollment_id INTEGER NOT NULL,
  file_id INTEGER,
  message TEXT,
  type TEXT NOT NULL DEFAULT 'post',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (class_id) REFERENCES class(id),
  FOREIGN KEY (class_enrollment_id) REFERENCES class_enrollment(id),
  FOREIGN KEY (file_id) REFERENCES file(id)
);
