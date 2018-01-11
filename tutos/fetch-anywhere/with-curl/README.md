# Uselful `curl` commands

## Simplified syntax for this page

```bash
curl url -v -k -u user:password -H header1 .. -H headerN -X METHOD -d data
```

option | description
:--- | :---
url | the page to access or where to pass data on
-v | verbose to see the auth dance and all headers
-k | insecure auth to https server if no ca-cert provided
-u user:password | credentials for basic authentication
-H header | any header(s) for the request
-X METHOD | for other methods than GET eg POST, PUT, DELETE, etc.
-d data | data to POST, PUT, etc. Ex: {json:data} or \<xml\>\<data/\>\</xml\>

## SSL certificates for https server

You might need to configure `curl` and add the CA cert for the remote server to the existing default CA certificate store.<br>
See [Curl SSL Certificate Verification](https://curl.haxx.se/docs/sslcerts.html).
One way is to create a file `curl-ca-bundle.crt` in the current directory into which you would save all the certificates in the certification chain to access the `https` file.

## `basic` auth

```bash
curl "$url" # no-auth
curl "$url" -H "Accept:application/json" # Ask the server to send the result in json or xml format

curl "$url" -u "$USERNAME:$pw" -v # basic-auth
curl "$url" -H "Authorization: Basic MyBasiCT0k3n" # basic-auth with `basic token` taken from previous command

curl "$url" -u "$USERNAME:$pw" -X POST -d "{json:data}" # POST request with data
curl "$url" -u "$USERNAME:$pw" -X POST -d "{json:data}" -H "\"Content-Type\":application/json" # data is json or xml
```

## `cookie` auth and `CORS`

```bash
curl "$url" -H "Cookie: name=value" # cookie-auth
```

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

## `ntlm` auth

Simply pass the extra parameter `--ntlm` to the curl command along with the credentials `-u`. See the ntlm **handshake** thanks to the option `-v`.

```bash
curl "$url" -u "$USERNAME:$pw" --ntlm -v
```

## `oauth` auth

Based on a known `Consumer Key` and Consumer `Private Key` / `Public Key` pair...

The `OAuth` authentication process has 3 steps:

1. > \> The client requests a token for an application saved on server side.<br />
   < The server returns the error _the requested application is unknown_ or a valid `token / secret` data.
2. > \> The client redirects to the server authorization URL requiring an action from the user.<br />
   < Once the user did manually allow or deny the access, the server redirects to the callback URL provided at step 1 with a parameter to return the error _access denied_ or a valid `oauth verifier key`.
3. > \> The client requests an access token attached to the previous _token / secret_ data and to the _oauth verifier key_.<br />
   < The server returns the error _the token is invalid_ or a valid `access token / secret` data.

Now the user is able to run the request with all this info.

### With oauth 1.0

```bash
curl "$url" -H "Authorization: OAuth oauth_consumer_key=\"...\", oauth_nonce=\"...\", oauth_signature_method=\"...\", oauth_timestamp=\"...\", oauth_token=\"...\", oauth_version=\"1.0\", oauth_signature=\"...\"" -v
```

- `oauth_consumer_key` is the _Consumer Key_ above
- `oauth_nonce` is a random value that is uniq for every request
- `oauth_signature_method` is provided by the server
- `oauth_timestamp` is the equivalent of _date +%s_
- `oauth_token` is the _access token_ above
- `oauth_version` is _1.0_
- `oauth_signature` is all the above parameters plus the requested _url_ and _method_ encrypted with the consumer _private key_

### With oauth 2.0

```bash
curl "$url" -H "Authorization: Bearer MyB3ar3rT0k3n" -v
```

With oauth 2.0 there is a mechanism to refresh the _oauth token_ aka _access token_ or it expires every hour (or whatever defined frequency).
