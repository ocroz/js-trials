# Use fetch everywhere in the browser or in node

Why would it be different in the browser or in node for URL methods GET, POST, PUT, DELETE ?

The browser has a native method 'fetch'.
Let's use the same API in node thanks to the npm package 'node-fetch'.

### Let's try the code in node

npm run start:node # this fails as the environment variable pw is undefined

(export pw;npm run start:node) # export pw and it'll function

Note: You will get the JIRA priorities anyway as this REST API in JIRA is opened to anonymous.

### Let's try the same code in the browser

npm run build && npm run deploy && npm run start:browser # F12 > Console

## Post scriptum

* Cors is always activated (mode: 'cors') as it is required for the browser and it is simply ignored in node.
* Same for the credentials (credentials: 'include'), the browser will send the authentication cookie if one exists.
* Node uses a basic authentication. It works with or without the certificates.
* The agent used for the certificates uses the npm module 'https'. Thus this does not function in the browser.
