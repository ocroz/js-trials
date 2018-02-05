# Alternative ways but fetch to make http requests

## Basic example with JIRA

See [src/jira/](src/jira/README.md).

Authentications:
- Cookie authentication over CORS in the browser.
- Cookie, Basic or OAuth1 authentication in node.

Alternatives to fetch:
- http, https, or request in node.
- jquery, xhr, or webix in the browser.

Scenarios:
- errors (many cases of errors),
- issue (create an issue +work on comments).

## Basic example with VersionOne

See [src/versionone/](src/versionone/README.md).

Authentications:
- Cookie authentication in the browser.
- NTLM or OAuth2 (simplified) authentication in node.

Alternatives to fetch:
- httpntlm, httpreq, http, https, or request in node.
- jquery, xhr, or webix in the browser.

Scenarios:
- errors (many cases of errors),
- info (get few data from VersionOne).
