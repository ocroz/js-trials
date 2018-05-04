USE localjira;

CREATE TABLE issue (
  id INTEGER NOT NULL AUTO_INCREMENT,
  projectId INTEGER NOT NULL,
  issuetypeSchemeId INTEGER DEFAULT NULL, /* This column is updated via a trigger on INSERT */
  reporterId INTEGER DEFAULT NULL,
  assigneeId INTEGER DEFAULT NULL,
  issuetypeId INTEGER NOT NULL,
  priorityId INTEGER DEFAULT NULL,
  statusId INTEGER DEFAULT 1,
  fields JSON DEFAULT NULL,
  FOREIGN KEY (projectId) REFERENCES project(id),
  FOREIGN KEY (reporterId) REFERENCES user(id),
  FOREIGN KEY (assigneeId) REFERENCES user(id),
  /* FOREIGN KEY (issuetypeId) REFERENCES issuetype(id), // Or validate the issuetypeId against the issuetypeSchemeId as follows */
  FOREIGN KEY (issuetypeSchemeId, issuetypeId) REFERENCES issuetypeSchemeValue(issuetypeSchemeId, issuetypeId),
  FOREIGN KEY (priorityId) REFERENCES priority(id),
  FOREIGN KEY (statusId) REFERENCES status(id),
  PRIMARY KEY (id)
);

/* Triggers to update issuetypeSchemeId on INSERT or UPDATE */
CREATE TRIGGER check_issuetype_on_insert BEFORE INSERT ON issue
  FOR EACH ROW SET NEW.issuetypeSchemeId = (SELECT issuetypeSchemeId FROM project WHERE id = NEW.projectId);
CREATE TRIGGER check_issuetype_on_update BEFORE UPDATE ON issue
  FOR EACH ROW SET NEW.issuetypeSchemeId = (SELECT issuetypeSchemeId FROM project WHERE id = NEW.projectId);

/* This INSERT works because 'Task' is a valid issuetype for the project 'SPLPRJ' */
INSERT INTO issue (projectId, reporterId, assigneeId, issuetypeId, priorityId, fields)
VALUES (
  2, 1, 1, 3, 3, /* 'SPLPRJ', 'crozier', 'crozier', 'Task', 'Major' */
  '{
    "summary": "MySQL issue 1",
    "description": "JSON can be array or object."
  }'
);

/*
 This INSERT fails because 'Improvement' is not a valid issuetype for the project 'SPLPRJ'
INSERT INTO issue (projectId, reporterId, assigneeId, issuetypeId, priorityId, fields)
VALUES (
  2, 1, 1, 4, 3, // 'SPLPRJ', 'crozier', 'crozier', 'Improvement', 'Major'
  '{
    "summary": "MySQL issue 1",
    "description": "JSON can be array or object."
  }'
);
 */
