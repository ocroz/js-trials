USE localjira;

CREATE TABLE status (
  id INTEGER NOT NULL AUTO_INCREMENT,
  description VARCHAR(256) DEFAULT NULL,
  iconUrl VARCHAR(128) DEFAULT NULL,
  name VARCHAR(20) DEFAULT NULL,
  UNIQUE KEY (name),
  PRIMARY KEY (id)
);

/* An index is required for using this table as foreign key in other tables */
/* CREATE INDEX name ON status (name); */

INSERT INTO status (id, description, iconUrl, name)
VALUES(
  1,
  'The issue is open and ready for the assignee to start work on it.',
  '/images/icons/statuses/open.png',
  'Open'
);

INSERT INTO status (id, description, iconUrl, name)
VALUES(
  3,
  'This issue is being actively worked on at the moment by the assignee.',
  '/images/icons/statuses/inprogress.png',
  'In Progress'
);

INSERT INTO status (id, description, iconUrl, name)
VALUES(
  4,
  'This issue was once resolved, but the resolution was deemed incorrect. From here issues are either marked assigned or resolved.',
  '/images/icons/statuses/reopened.png',
  'Reopened'
);

INSERT INTO status (id, description, iconUrl, name)
VALUES(
  5,
  'A resolution has been taken, and it is awaiting verification by reporter. From here issues are either reopened, or are closed.',
  '/images/icons/statuses/resolved.png',
  'Resolved'
);

INSERT INTO status (id, description, iconUrl, name)
VALUES(
  6,
  'The issue is considered finished, the resolution is correct. Issues which are closed can be reopened.',
  '/images/icons/statuses/closed.png',
  'Closed'
);
