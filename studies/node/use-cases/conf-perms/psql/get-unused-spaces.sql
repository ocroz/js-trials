/* See https://confluence.atlassian.com/doc/finding-unused-spaces-107184852.html */

/* Unused spaces: */
SELECT s.spaceid, s.spacekey, s.spacename, s.spacetype, s.spacestatus, s.creationdate, count(c.*) as nbpages, max(c.lastmoddate) as lastmoddate
FROM content as c, spaces as s
WHERE c.spaceid = s.spaceid
AND s.spacestatus = 'CURRENT'
GROUP BY s.spaceid
HAVING MAX(c.lastmoddate) < '2019-01-01'
ORDER BY lastmoddate
;

/* Spaces with less than 5 pages: */
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
