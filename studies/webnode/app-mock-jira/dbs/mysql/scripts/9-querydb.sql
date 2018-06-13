USE localjira;

/*
 SHOW DATABASES;
 SHOW TABLES;
 DESCRIBE TABLE;

 SELECT COUNT(*) FROM {table};
 SELECT COUNT(*) FROM {table} WHERE {columnX} = {valueX};
 SELECT "{column1}",...,"{columnN}" FROM {table} LIMIT {n};

 UPDATE {table} SET {columnX} = {valueZ} WHERE {columnX} = {valueY};
 */

SELECT * FROM issue ORDER BY id;

SELECT
  CONCAT(project.name, '-', issue.id) AS issuekey,
  reporter.displayName AS reporter,
  assignee.displayName AS assignee,
  issuetypeScheme.name AS issuetypeScheme,
  CONCAT(issuetype.name, '       ') AS issuetype,
  CONCAT(priority.name, '       ') AS priority,
  status.name AS status
/*
  REPLACE(issuetype.iconUrl,'/images/icons/issuetypes/','') AS issuetype,
  REPLACE(priority.iconUrl,'/images/icons/priorities/','') AS priority,
  REPLACE(status.iconUrl,'/images/icons/statuses/','') AS status
*/
FROM issue
  INNER JOIN project ON issue.projectId=project.id
  INNER JOIN user AS reporter ON issue.reporterId=reporter.id
  INNER JOIN user AS assignee ON issue.assigneeId=assignee.id
  INNER JOIN issuetypeScheme ON issue.issuetypeSchemeId=issuetypeScheme.id
  INNER JOIN issuetype ON issue.issuetypeId=issuetype.id
  INNER JOIN priority ON issue.priorityId=priority.id
  INNER JOIN status ON issue.statusId=status.id
ORDER BY issue.id
;
