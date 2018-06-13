USE localjira;

/*
 This INSERT fails because the user 'mate' does not exist yet

INSERT INTO issue (projectId, reporterId, assigneeId, issuetypeId, priorityId, fields)
VALUES (
  2, 2, 1, 1, 2, // 'SPLPRJ', 'mate', 'crozier', 'Bug', 'Critical'
  '{
    "summary": "MySQL issue 2",
    "description": "New reporter inserted jointly with the new issue."
  }'
);
 */

/*
 Although a TRANSACTION that INSERTs the issue 'SPLPRJ-2' then INSERTs the referenced user 'mate' before COMMIT works in SQL,
 such a transaction fails in MySQL. See https://dev.mysql.com/doc/refman/8.0/en/innodb-foreign-key-constraints.html
 */
START TRANSACTION;
INSERT INTO user (name, displayName) VALUES('mate', 'Team Mate');
INSERT INTO issue (projectId, reporterId, assigneeId, issuetypeId, priorityId, fields)
VALUES (
  2, 2, 1, 1, 2, /* 'SPLPRJ', 'mate', 'crozier', 'Bug', 'Critical' */
  '{
    "summary": "MySQL issue 2",
    "description": "New reporter inserted jointly with the new issue."
  }'
);
COMMIT;
