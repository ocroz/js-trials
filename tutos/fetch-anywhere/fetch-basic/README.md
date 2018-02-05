# Use fetch in the browser or in node with basic auth

Let's take an example with Atlassian JIRA *on premise* which uses a `basic` authentication with node.

### Configurations

- Update the JIRA URL in [src/env/*.js](src/env/).
- Configure the other host from where the html file will be ran over CORS in the browser.<br />
=> Update the host path and URL for the deploy and start:browser scripts in [package.json](package.json).

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
