# Migrate LDAP groups from ARS to IAM (MIM)

Steps:
- rest/jira-prjs-archiving.js
- create selenium/archProject[Keys|Groups].txt from above
- selenium/ars-groups-rename.js
- graphql/ldap-get-subgroups.js
- migration of relevant manual and dynamic groups
- rest/jira-perms-app2svc.js
