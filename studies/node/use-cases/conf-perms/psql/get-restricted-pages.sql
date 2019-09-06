SELECT s.spaceid, s.spacekey, s.spacename, s.spacetype, s.spacestatus, s.creationdate, c.parentid, c.contentid, cp.id, cp.cp_type, u.username, cp.groupname, cp.lastmoddate
FROM
  spaces as s
    LEFT JOIN content as c ON s.spaceid = c.spaceid
      LEFT JOIN content_perm_set as cps ON c.contentid = cps.content_id
        LEFT JOIN content_perm as cp ON cps.id = cp.cps_id
          LEFT JOIN user_mapping as u ON cp.username = u.user_key
WHERE s.spacestatus = 'CURRENT'
AND s.spacetype = 'global'
AND cp.cp_type is not null
AND cp.groupname <> ''
ORDER BY s.spacekey, c.contentid, cp.lastmoddate
;

/* SELECT * then DELETE ... */
DELETE
FROM
  content_perm as cp
WHERE
  cp.id IN (
    SELECT cp.id
    FROM
      spaces as s
        LEFT JOIN content as c ON s.spaceid = c.spaceid
          LEFT JOIN content_perm_set as cps ON c.contentid = cps.content_id
            LEFT JOIN content_perm as cp ON cps.id = cp.cps_id
              LEFT JOIN user_mapping as u ON cp.username = u.user_key
    WHERE s.spacestatus = 'CURRENT'
    AND s.spacetype = 'global'
    AND c.contentid = 100374626
    AND u.username = 'crozier'
  )
;
