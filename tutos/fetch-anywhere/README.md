# Use fetch everywhere in the browser or in node

Why would it be different in the browser or in node for URL methods `GET`, `POST`, `PUT`, `DELETE` ?

The browser has a native method `fetch`.
Let's use the same API in node thanks to the npm package `node-fetch`.

### Let's try the same code in node and in the browser

The 2 below examples show a `Basic ` and a `NTLM ` authentications.

See:
- [fetch-basic/](fetch-basic/README.md)
- [fetch-ntlm/](fetch-ntlm/README.md)

Other authentications mechanisms exist such as `Token ` and `Bearer `.

### Let's try other alternatives

In node.js:
- http
- https
- request

In the browser:
- XmlHttpRequest aka xhr
- jQuery $.ajax
- Webix

### Uselful `curl` commands

NTLM

```bash
curl -u "$USERNAME:$pw" --ntlm -X GET -H "Origin: http://mysite.hq.k.grp" -v "http://safetest.hq.k.grp/Safetest/rest-1.v1/Data/Scope?page=0,1&select=Key,Name"
curl -k -u "$USERNAME:$pw" --ntlm -X GET -H "Origin: https://mysite.hq.k.grp" -v "https://safetest.hq.k.grp/Safetest/rest-1.v1/Data/Scope?page=0,1&select=Key,Name"
```

NTLM with CORS

```bash
curl -u "$USERNAME:$pw" -H "Access-Control-Request-Method: GET" -H "Origin: http://mysite.hq.k.grp" -v "http://chx-qtwebservice-01.hq.k.grp:9096/api/getPI?description=1"
curl -k -u "$USERNAME:$pw" -H "Access-Control-Request-Method: GET" -H "Origin: https://mysite.hq.k.grp" -v "https://chx-qtwebservice-01.hq.k.grp:8096/api/getPI?description=1"
```

NTLM with CORS refused by the server

```bash
curl -u "$USERNAME:$pw" -H "Access-Control-Request-Method: GET" -H "Origin: http://mysite" -v "http://chx-qtwebservice-01.hq.k.grp:9096/api/getPI?description=1"
curl -k -u "$USERNAME:$pw" -H "Access-Control-Request-Method: GET" -H "Origin: https://mysite" -v "https://chx-qtwebservice-01.hq.k.grp:8096/api/getPI?description=1"
```

With CORS both the server and the client can refuse the connection.

A server which does not implement CORS but requires authentication will refuse the request if not authenticated. On such a server, the browser will always refuse the connection overs CORS (with credentials) because the server does not provide a list of white listed machines from which the request is allowed.<br>
With another client (eg curl) any header can be configured and the request is never refused.
