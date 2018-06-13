USE localjira;

CREATE TABLE issuetype (
  id INTEGER NOT NULL AUTO_INCREMENT,
  description VARCHAR(256) DEFAULT NULL,
  iconUrl VARCHAR(128) DEFAULT NULL,
  name VARCHAR(20) DEFAULT NULL,
  subtask BOOLEAN DEFAULT false,
  UNIQUE KEY (name),
  PRIMARY KEY (id)
);

/* An index is required for using this table as foreign key in other tables */
/* CREATE INDEX name ON issuetype (name); */

INSERT INTO issuetype (id, description, iconUrl, name, subtask)
VALUES(
  3,
  'A task that needs to be done.',
  '/images/icons/issuetypes/task.svg',
  'Task',
  false
);

INSERT INTO issuetype (id, description, iconUrl, name, subtask)
VALUES(
  2,
  'A new feature of the product, which has yet to be developed.',
  '/images/icons/issuetypes/newfeature.svg',
  'New Feature',
  false
);

INSERT INTO issuetype (id, description, iconUrl, name, subtask)
VALUES(
  4,
  'An improvement or enhancement to an existing feature or task.',
  '/images/icons/issuetypes/improvement.svg',
  'Improvement',
  false
);

INSERT INTO issuetype (id, description, iconUrl, name, subtask)
VALUES(
  1,
  'A problem which impairs or prevents the functions of the product.',
  '/images/icons/issuetypes/bug.svg',
  'Bug',
  false
);

INSERT INTO issuetype (id, description, iconUrl, name, subtask)
VALUES(
  22,
  '',
  '/images/icons/issuetypes/subtask.svg',
  'Sub-task',
  true
);
