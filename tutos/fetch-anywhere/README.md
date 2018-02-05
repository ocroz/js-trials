# Use fetch everywhere in the browser or in node

There is a variaty of situations:
- HTTP protocols: `http`, `https`.
- HTTP methods: `GET`, `POST`, `PUT`, `DELETE`, etc.
- Browser auths: `no-auth`, `cookie`, possibly over `CORS` too.
- Node.js auths: `no-auth`, `basic`, `NTLM`, `oauth` 1.0 or 2.0, etc.
- Browser APIs: `fetch`, `XmlHttpRequest` aka xhr, `jQuery` $.ajax, `webix`, etc.
- Node.js APIs: `fetch`, `http`, `https`, `request`, etc.

Why would it be different in the browser or in node ?

The browser has a native method `fetch`.
Let's use the same API in node thanks to the npm package `node-fetch`.

### Let's try the same code in node and in the browser

The 2 below examples show a `Basic` and a `NTLM` authentications in node.
<br />Note: The browser uses a `Cookie` authentication in both cases.

See:
- [fetch-basic/](fetch-basic/README.md)
- [fetch-ntlm/](fetch-ntlm/README.md)

Other authentications mechanisms exist such as `OAuth`.
See [OAuth1 for JIRA](unless-fetch/src/jira/oauth/token/README.md).

### Let's try other alternatives

|In node.js|In the browser|
|---|---|
|- fetch|- fetch|
|- http|- XmlHttpRequest aka xhr|
|- https|- jQuery $.ajax|
|- request|- Webix|

See [unless-fetch/](unless-fetch/README.md).
