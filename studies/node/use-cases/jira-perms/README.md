# Migrate LDAP groups from ARS to IAM (MIM)

Steps:
- rest/jira-prjs-archiving.js

Then using ../ldap-perms:
> Create selenium/archArsGroups.txt from above
- selenium/ars-groups-rename.js
- graphql/ldap-get-subgroups.js
> Migration of relevant manual and dynamic groups
- selenium/ars-members-add.js
- graphql/ldap-get-orphan-groups.js
> Create selenium/voidArsGroups.txt from above
- selenium/ars-groups-delete.js

Then back here:
- rest/jira-perms-app2svc.js

Then using ../ldap-perms:
> Create mimAddSubgroups.txt from above
- graphql/mim-add-subgroups.js
