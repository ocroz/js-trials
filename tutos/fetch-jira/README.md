# Use fetch everywhere in the browser or in node

Why would it be different in the browser or in node for URL methods `GET`, `POST`, `PUT`, `DELETE` ?

The browser has a native method `fetch`.
Let's use the same API in node thanks to the npm package `node-fetch`.

### Let's try the code in node

```bash
pw=<your-password>
npm run start:node # this fails as the environment variable pw is undefined
(export pw;npm run start:node) # export pw and it'll function
```

Note: You will get the JIRA priorities always as this REST API in JIRA is opened to anonymous.

### Let's try the same code in the browser

```bash
npm run build && npm run deploy && npm run start:browser # F12 > Console
```

## Post scriptum

* Cors is always activated with `mode: 'cors'` as it is required for the browser and it is simply ignored in node.
* Same for the credentials with `credentials: 'include'`, the browser will send the authentication cookie if one exists.
* Node uses a *basic authentication*. For `http` nothing more is required.
* For `https` it works with or without a *certificate*. The agent used for the certification uses the node module `https`.<br />This module is pure node and thus it does not function in the browser so it must be removed from the dist bundle.
* Similarily the npm module `node-fetch` must be removed from the dist bundle so as to use the native method `fetch`.
