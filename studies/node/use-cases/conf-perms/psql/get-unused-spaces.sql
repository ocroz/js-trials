/* See https://confluence.atlassian.com/doc/finding-unused-spaces-107184852.html */

/* Unmodified spaces */
SELECT s.spaceid, s.spacekey, s.spacename, s.spacetype, s.spacestatus, s.creationdate, count(c.*) as nbpages, max(c.lastmoddate) as lastmoddate
FROM content as c, spaces as s
WHERE c.spaceid = s.spaceid
AND s.spacestatus = 'CURRENT'
GROUP BY s.spaceid
HAVING MAX(c.lastmoddate) < '2019-01-01'
ORDER BY lastmoddate
;

/* Unviewed spaces */
SELECT s.spaceid, s.spacekey, s.spacename, s.spacetype, s.spacestatus, s.creationdate, count(v.*) as nbpages, max(v."LAST_VIEW_DATE") as lastviewdate
FROM "AO_92296B_AORECENTLY_VIEWED" as v, spaces as s
WHERE v."SPACE_KEY" = s.spacekey
AND s.spacestatus = 'CURRENT'
GROUP BY s.spaceid
HAVING MAX(v."LAST_VIEW_DATE") < '2019-01-01'
ORDER BY lastviewdate
;

/*
SELECT s.spaceid, s.spacekey, s.spacetype, s.spacestatus, s.creationdate, v."LAST_VIEW_DATE" as lastviewdate, v."CONTENT_ID" as lastviewcid, v."CONTENT_TYPE" as lastviewctype, u.username as lastviewuser
FROM spaces as s,
     "AO_92296B_AORECENTLY_VIEWED" as v LEFT JOIN user_mapping as u ON v."USER_KEY" = u.user_key
WHERE v."SPACE_KEY" = s.spacekey
AND v."LAST_VIEW_DATE" IN (
  SELECT max(v0."LAST_VIEW_DATE")
  FROM "AO_92296B_AORECENTLY_VIEWED" as v0
  WHERE v0."SPACE_KEY" = v."SPACE_KEY"
  GROUP BY v0."SPACE_KEY"
)
AND v."LAST_VIEW_DATE" < '2019-01-01'
ORDER BY lastviewdate
;
*/
SELECT
  s.spaceid, s.spacekey, s.spacetype, s.spacestatus, s.creationdate, lv.lvd as lastviewdate, rv."CONTENT_ID" as lastviewcid, rv."CONTENT_TYPE" as lastviewctype, rv."USER_KEY" as user_key, u.username as lastviewuser
FROM
  spaces as s LEFT JOIN (
    SELECT "SPACE_KEY", MAX("LAST_VIEW_DATE") as lvd
    FROM "AO_92296B_AORECENTLY_VIEWED"
    GROUP BY "SPACE_KEY"
  ) as lv ON s.spacekey = lv."SPACE_KEY",
  "AO_92296B_AORECENTLY_VIEWED" as rv LEFT JOIN user_mapping as u ON rv."USER_KEY" = u.user_key
WHERE lv."SPACE_KEY" = rv."SPACE_KEY" AND lv.lvd = rv."LAST_VIEW_DATE"
UNION ALL SELECT DISTINCT
  s.spaceid, s.spacekey, s.spacetype, s.spacestatus, s.creationdate, '2018-01-01'::date, 0, null, null, null
FROM
  spaces as s LEFT JOIN (
    SELECT "SPACE_KEY", MAX("LAST_VIEW_DATE") as lvd
    FROM "AO_92296B_AORECENTLY_VIEWED"
    GROUP BY "SPACE_KEY"
  ) as lv ON s.spacekey = lv."SPACE_KEY",
  "AO_92296B_AORECENTLY_VIEWED" as rv LEFT JOIN user_mapping as u ON rv."USER_KEY" = u.user_key
WHERE lv.lvd is null
ORDER BY lastviewdate, creationdate
;

/* Unvisited spaces */
SELECT s.spaceid, s.spacekey, s.spacetype, s.spacestatus, s.creationdate, COUNT(v."VISIT_TIME") as countviewsince, MAX(v."VISIT_TIME") as lastviewdate
FROM
  spaces as s
    LEFT JOIN content as c ON s.spaceid = c.spaceid
      LEFT JOIN "AO_05769A_VISIT_ENTITY" as v ON c.contentid = v."CONTENT_ID"
GROUP BY s.spaceid
HAVING COUNT(v."VISIT_TIME") = 0 OR MAX(v."VISIT_TIME") < '2019-01-01'
ORDER BY countviewsince, lastviewdate
;

SELECT DISTINCT s.spaceid, s.spacekey, c.contentid, c.contenttype, c.content_status, ve."VISIT_TIME" as viewdate, rv."LAST_VIEW_DATE" as lastviewdate
FROM
  spaces as s
    LEFT JOIN content as c ON s.spaceid = c.spaceid
      LEFT JOIN "AO_05769A_VISIT_ENTITY" as ve ON c.contentid = ve."CONTENT_ID"
        LEFT JOIN "AO_92296B_AORECENTLY_VIEWED" as rv ON ve."CONTENT_ID" = rv."CONTENT_ID"
WHERE s.spacekey = 'CMQMTOOLS' AND c.contenttype = 'PAGE' AND c.contentid = 28870108
ORDER BY viewdate
;

/*
  cd /data/confluence/data/analytics-logs/
  zgrep -h --color=always 'confluence.page.view|{"pageID":"140301296"}' *.gz *.log
*/

/* Spaces with less than 5 pages */
SELECT s.spaceid, s.spacekey, s.spacename, s.spacetype, s.spacestatus, s.creationdate, count(c.*) as nbpages, max(c.lastmoddate) as lastmoddate
FROM content as c, spaces as s
WHERE c.spaceid = s.spaceid
AND s.spacestatus = 'CURRENT'
GROUP BY s.spaceid
HAVING COUNT(c.*) < 5
ORDER BY lastmoddate
;

/*
  result=/tmp/result
  psql -d confluence -U confluence -f request.sql > $result.txt
  cat $result.txt | grep -v '^[^ ]' | sed 's, *| *,;,g' | sed 's,^ *,,g' > $result.csv
 */

/*
  Then in case of such an ERROR:

  Removing permission XXX for zhangjh from ~zhangjh ...
  The application was unable to serve your request: com.atlassian.confluence.rpc.RemoteException: No user or group with the name 'zhangjh' exists.
 */

/* Unknown users */
SELECT p.spaceid, s.spacekey, p.permtype, p.permusername, u.username
FROM spacepermissions as p, spaces as s, user_mapping as u
WHERE p.spaceid = s.spaceid
AND p.permusername = u.user_key
AND s.spacekey = '~zhangjh'
;

/* Unknown users and groups */
SELECT p.spaceid, s.spacekey, p.permtype, p.permusername, u.username, p.permgroupname
FROM spacepermissions as p
JOIN spaces as s ON p.spaceid = s.spaceid
LEFT JOIN user_mapping as u ON p.permusername = u.user_key
WHERE (p.permusername <> '' OR p.permgroupname <> 'svc-atl-admins')
AND s.spacekey = '~zhangjh'
;

DELETE FROM spacepermissions WHERE spaceid = '28573703' AND (permusername <> '' OR permgroupname <> 'svc-atl-admins');
