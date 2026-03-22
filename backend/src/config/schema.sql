CREATE TABLE IF NOT EXISTS complaints (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  raw_text TEXT NOT NULL,
  clean_text TEXT NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT,
  severity TEXT NOT NULL,
  sentiment TEXT NOT NULL,
  priority_score REAL,
  summary TEXT,
  status TEXT NOT NULL DEFAULT 'open',
  duplicate_group_id TEXT,
  embedding_vector TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS entities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  complaint_id INTEGER NOT NULL,
  product TEXT,
  issue_type TEXT,
  amount REAL,
  date TEXT,
  FOREIGN KEY (complaint_id) REFERENCES complaints(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS responses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  complaint_id INTEGER NOT NULL,
  generated_response TEXT NOT NULL,
  edited_response TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (complaint_id) REFERENCES complaints(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_complaints_severity ON complaints(severity);
CREATE INDEX IF NOT EXISTS idx_complaints_category ON complaints(category);
CREATE INDEX IF NOT EXISTS idx_complaints_status ON complaints(status);
CREATE INDEX IF NOT EXISTS idx_entities_complaint_id ON entities(complaint_id);
CREATE INDEX IF NOT EXISTS idx_responses_complaint_id ON responses(complaint_id);
