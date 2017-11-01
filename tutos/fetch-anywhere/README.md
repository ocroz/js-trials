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
