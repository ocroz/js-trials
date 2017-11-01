# Use fetch in the browser or in node with ntlm auth

Let's take an example with VersionOne which uses a `NTLM` authentication with node.

### Let's try the code in node

```bash
pw=<your-password>
npm run start:node # this fails as the environment variable pw is undefined
(export pw;npm run start:node) # export pw and it'll function
```

### Let's try the same code in the browser

```bash
npm run build && npm run deploy && npm run start:browser # F12 > Console
```

## Post scriptum

* Cors is always activated with `mode: 'cors'` as it is required for the browser and it is simply ignored in node.
* Same for the credentials with `credentials: 'include'`, the browser will send the authentication cookie if one exists.
* For NTLM, node uses a *ntlm authentication* via 2 fetch operations. See:
- [npm httpntlm](https://github.com/SamDecrock/node-http-ntlm)
- [NTLM Authentication with node-fetch](https://gist.github.com/JoeStanton/64697ebcd865d6d1145d020475d7a0f4)
* The first fetch operation uses the `httpntlm` module. It returns a one-time `NTLM` credential for the second fetch operation.
* A `http` or `https` agent must be created with `keepAlive: true`. For `https` it works with or without a *certificate*.
* The agent creation uses the node modules `http` or `https`. These modules are pure node and thus they does not function in the browser so they must be removed from the dist bundle.
* Similarily the npm module `node-fetch` must be removed from the dist bundle so as to use the native method `fetch`.
