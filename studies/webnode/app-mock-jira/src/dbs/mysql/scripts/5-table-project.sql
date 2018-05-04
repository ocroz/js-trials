USE localjira;

/*
DEBUG command in case of FOREIGN KEY error on CREATE TABLE:
show engine innodb status;
 */

CREATE TABLE issuetypeScheme (
  id INTEGER NOT NULL AUTO_INCREMENT,
  name VARCHAR(20) NOT NULL,
  UNIQUE KEY (name),
  PRIMARY KEY (id)
);

INSERT INTO issuetypeScheme (name) VALUES ('issuetypeSchm1');
INSERT INTO issuetypeScheme (name) VALUES ('issuetypeSchm2');

CREATE TABLE issuetypeSchemeValue (
  issuetypeSchemeId INTEGER NOT NULL,
  issuetypeId INTEGER NOT NULL,
  PRIMARY KEY (issuetypeSchemeId, issuetypeId)
);

INSERT INTO issuetypeSchemeValue (issuetypeSchemeId, issuetypeId) VALUES (1, 1);  /* Bug */
INSERT INTO issuetypeSchemeValue (issuetypeSchemeId, issuetypeId) VALUES (1, 2);  /* New Feature <-- */
INSERT INTO issuetypeSchemeValue (issuetypeSchemeId, issuetypeId) VALUES (1, 3);  /* Task */
INSERT INTO issuetypeSchemeValue (issuetypeSchemeId, issuetypeId) VALUES (1, 22); /* Sub-task */

INSERT INTO issuetypeSchemeValue (issuetypeSchemeId, issuetypeId) VALUES (2, 1);  /* Bug */
INSERT INTO issuetypeSchemeValue (issuetypeSchemeId, issuetypeId) VALUES (2, 4);  /* Improvement <-- */
INSERT INTO issuetypeSchemeValue (issuetypeSchemeId, issuetypeId) VALUES (2, 3);  /* Task */
INSERT INTO issuetypeSchemeValue (issuetypeSchemeId, issuetypeId) VALUES (2, 22); /* Sub-task */

CREATE TABLE project (
  id INTEGER NOT NULL AUTO_INCREMENT,
  name VARCHAR(20) NOT NULL,
  leaderId INTEGER DEFAULT NULL,
  issuetypeSchemeId INTEGER NOT NULL,
  FOREIGN KEY (leaderId) REFERENCES user(id),
  FOREIGN KEY (issuetypeSchemeId) REFERENCES issuetypeScheme(id),
  UNIQUE KEY (name),
  PRIMARY KEY (id)
);

INSERT INTO project (name, leaderId, issuetypeSchemeId) VALUES ('SAMPLE', 1, 2); /* 'crozier', 'issuetypeSchm2' */
INSERT INTO project (name, leaderId, issuetypeSchemeId) VALUES ('SPLPRJ', 1, 1); /* 'crozier', 'issuetypeSchm1' */
