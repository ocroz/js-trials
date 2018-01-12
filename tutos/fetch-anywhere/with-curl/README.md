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
curl "$url" -u "$USERNAME:$pw" -X POST -d "{json:data}" -H "\"Content-Type\":application/json" # json or xml data
```

## `cookie` auth and `CORS`

```bash
curl "$url" -H "Cookie: name=value" # cookie-auth
```

More in [CORS.md](CORS.md).

## `ntlm` auth

Simply pass the extra parameter `--ntlm` to the curl command along with the credentials `-u`.<br />
See the ntlm **handshake** thanks to the option `-v`.

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

See all the details in [../node-oauth/](../node-oauth/README.md).

The curl command will be:
> curl "$url" -H "Authorization: OAuth oauth_consumer_key=\\"...\\", oauth_nonce=\\"...\\", oauth_signature_method=\\"...\\", oauth_timestamp=\\"...\\", oauth_token=\\"...\\", oauth_version=\\"1.0\\", oauth_signature=\\"...\\"" -v

Where:
- `oauth_consumer_key` is the _Consumer Key_ above
- `oauth_nonce` is a random value that is uniq for every request
- `oauth_signature_method` is provided by the server
- `oauth_timestamp` is the equivalent of _date +%s_
- `oauth_token` is the _access token_ above
- `oauth_version` is _1.0_
- `oauth_signature` is all the above params plus the requested _url_ and _method_ encrypted with the consumer _private key_

### With oauth 2.0

```bash
curl "$url" -H "Authorization: Bearer MyB3ar3rT0k3n" -v
```

With oauth 2.0 there is a mechanism to refresh the _oauth token_ aka _access token_ or it expires every hour (or whatever defined frequency).
