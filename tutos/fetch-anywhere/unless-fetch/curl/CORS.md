# `cookie` auth and `CORS`

With `CORS` **both the server and the client can refuse the connection**.

A server which does not implement CORS but requires authentication will refuse the request if not authenticated. On such a server, the browser will always refuse the connection overs CORS (with credentials) because the server does not provide a list of white listed machines from which the request is allowed.<br>
With another client (eg curl) any header can be configured and the request is never refused.

### Case 1: The server refuses the connection

Let's simulate we are requesting from a valid \<local-url\> ex http://mysite.mycompagny

```bash
curl "$url" -H "Cookie: name=value" -H "Access-Control-Request-Method: GET" -H "Origin: <local-url>" -v
```

The connection is accepted; curl returns such a header:

```
< HTTP/1.1 200 OK
< X-Powered-By: Express
< Access-Control-Allow-Origin: http://mysite.mycompagny
< Vary: Origin
< Surrogate-Control: no-store
< Cache-Control: no-store, no-cache, must-revalidate, proxy-revalidate
< Pragma: no-cache
< Expires: 0
< Content-Type: application/json; charset=utf-8
< Content-Length: 2612
< Date: Thu, 11 Jan 2018 14:54:05 GMT
< Connection: keep-alive
```

Now we are requesting from a non-valid \<local-url\> ex http://mysite

The connection is refused; curl returns such a header:

```
< HTTP/1.1 500 Internal Server Error
< X-Powered-By: Express
< Date: Thu, 11 Jan 2018 14:53:50 GMT
< Connection: keep-alive
< Content-Length: 19
<
Not allowed by CORS
```

### Case 2: The browser client refuses the connection

Over `CORS` the browser always does 2 requests:
1. First the browser checks that the requested method is allowed*.
2. If allowed the browser runs the requested method.

*The browser uses the method OPTIONS for the first request.

```bash
curl "$url" -H "Access-Control-Request-Method: GET" -H "Origin: <local-url>" -X OPTIONS -v
```

If the method is allowed over CORS** the server sends a response with the headers:
- Access-Control-Allow-Methods: GET # The method is allowed...
- Access-Control-Allow-Origin: https://mysite.mycompagny # ...over CORS

**In this case the origin https://mysite.mycompagny is white listed by the server AND the method GET is allowed.

```
< HTTP/1.1 200
< Server: nginx/1.12.0
< Date: Thu, 11 Jan 2018 15:17:51 GMT
< Content-Type: text/html;charset=UTF-8
< Content-Length: 0
< Connection: keep-alive
< X-AREQUESTID: 977x40232x1
< X-ASEN: SEN-2006965
< Set-Cookie: atlassian.xsrf.token=BETM-2AD9-J4HD-KHMZ|66336d24b808e7a8d1626a873a5387c2622406dc|lout;path=/jira
< X-AUSERNAME: anonymous
< Access-Control-Allow-Origin: https://mysite.mycompagny
< Access-Control-Allow-Credentials: true
< Access-Control-Max-Age: 3600
< Access-Control-Allow-Methods: GET
< Access-Control-Allow-Headers: X-Atlassian-Token, Content-Type
< Cache-Control: no-cache, no-store, no-transform
< X-Content-Type-Options: nosniff
```

Now we are trying a disallowed method eg PATCH.<br />
None of the 2 needed headers are present in the response. A new header tells us which methods are allowed:
- Allow: HEAD,GET,OPTIONS,PUT # The method PATCH is not listed...
- HTTP/1.1 405 Method Not Allowed # ...so the http status code is 405 which means Method Not Allowed

```
< HTTP/1.1 405 Method Not Allowed
< Server: nginx/1.12.0
< Date: Thu, 11 Jan 2018 15:16:51 GMT
< Content-Type: text/html;charset=UTF-8
< Content-Length: 0
< Connection: keep-alive
< X-AREQUESTID: 976x242998151x1
< X-ASEN: SEN-2006965
< Set-Cookie: atlassian.xsrf.token=BETM-2AD9-J4HD-KHMZ|29cd797d0c4a71b9702400430367b593a5752287|lout; Path=/jira
< X-AUSERNAME: anonymous
< Allow: HEAD,GET,OPTIONS,PUT
< X-Content-Type-Options: nosniff
```

Now we are trying a non white listed origin eg https://mysite (.mycompagny is missing).<br />
None of the above headers are present in the response. The browser client will refuse the connection***.

```
< HTTP/1.1 200 OK
< Server: nginx/1.12.0
< Date: Thu, 11 Jan 2018 15:10:41 GMT
< Content-Type: text/html;charset=UTF-8
< Content-Length: 0
< Connection: keep-alive
< X-AREQUESTID: 970x242997780x1
< X-ASEN: SEN-2006965
< Set-Cookie: atlassian.xsrf.token=BETM-2AD9-J4HD-KHMZ|3dfff89113600c81baec7ad259b442f9d1cc7f55|lout; Path=/jira
< X-AUSERNAME: anonymous
< Cache-Control: no-cache, no-store, no-transform
< X-Content-Type-Options: nosniff
```

***Curl does not do this verification so this command always functions (unless the server refuses the connection).

```bash
curl "$url" -H "Cookie: name=value" -H "Access-Control-Request-Method: GET" -H "Origin: <local-url>" -v
```
