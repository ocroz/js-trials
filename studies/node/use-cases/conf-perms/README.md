# Migrate LDAP groups from ARS to IAM (MIM)

Steps:
- psql/get-unused-spaces.sql
- create json-rpc/archivedSpaceKeys.txt from above
- json-rpc/conf-spaces-archive.js

Then using ../jira-perms:
- create selenium/archivedArsGroups.txt from above
- selenium/ars-groups-rename.js
- graphql/ldap-get-subgroups.js
- migration of relevant manual and dynamic groups

Then back here:
- create json-rpc/migratedSpaceKeys.txt from above
- json-rpc/conf-perms-app2svc.js

Also:
- Align the space permissions to standard scheme
- List the groups used for restricted pages
