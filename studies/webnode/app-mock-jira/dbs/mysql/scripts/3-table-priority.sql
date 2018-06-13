USE localjira;

CREATE TABLE priority (
  id INTEGER NOT NULL AUTO_INCREMENT,
  description VARCHAR(256) DEFAULT NULL,
  iconUrl VARCHAR(128) DEFAULT NULL,
  name VARCHAR(20) DEFAULT NULL,
  UNIQUE KEY (name),
  PRIMARY KEY (id)
);

/* An index is required for using this table as foreign key in other tables */
/* CREATE INDEX name ON priority (name); */

INSERT INTO priority (id, description, iconUrl, name)
VALUES(
  1,
  'Blocks development and/or testing work, production could not run.',
  '/images/icons/priorities/blocker.svg',
  'Blocker'
);

INSERT INTO priority (id, description, iconUrl, name)
VALUES(
  2,
  'Crashes, loss of data, severe memory leak.',
  '/images/icons/priorities/critical.svg',
  'Critical'
);

INSERT INTO priority (id, description, iconUrl, name)
VALUES(
  3,
  'Major loss of function.',
  '/images/icons/priorities/major.svg',
  'Major'
);

INSERT INTO priority (id, description, iconUrl, name)
VALUES(
  4,
  'Minor loss of function, or other problem where easy workaround is present.',
  '/images/icons/priorities/minor.svg',
  'Minor'
);

INSERT INTO priority (id, description, iconUrl, name)
VALUES(
  5,
  'Cosmetic problem like misspelt words or misaligned text.',
  '/images/icons/priorities/trivial.svg',
  'Trivial'
);
