USE localjira;

CREATE TABLE user (
  id INTEGER NOT NULL AUTO_INCREMENT,
  name VARCHAR(20) NOT NULL,
  displayName VARCHAR(20) DEFAULT NULL,
  emailAddress VARCHAR(20) DEFAULT NULL,
  active BOOLEAN DEFAULT true,
  UNIQUE KEY (name),
  PRIMARY KEY (id)
);

/* An index is required for using this table as foreign key in other tables */
/* CREATE INDEX name ON user (name); */

INSERT INTO user (name, displayName) VALUES('crozier', 'Olivier Crozier');
