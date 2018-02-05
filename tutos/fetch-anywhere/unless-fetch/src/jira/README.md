# Alternative ways but fetch to make http requests

## Basic example with JIRA

### Configuration

Update the default configuration at [cfg/jira-config.json](cfg/jira-config.json).
```javascript
{
  // 0=errors.js, 1=issue.js
  "story": 0,
  // 0=fetch
  // browser: 1=jquery, 2=xhr, 3=webix
  // node: 1=http, 2=https, 3=request
  "altFetchCase": 0,
  // or http://10.0.92.154:8080/jira
  "jiraUrl": "https://atlassian.mycompany/jira"
}
```

Possibly create a [cfg/ca.cer](cfg/ca_https.cer) for `https` requests in `node`.
```text
-----BEGIN CERTIFICATE-----
(Your Primary SSL certificate: your_domain_name.crt) // This one is not needed
-----END CERTIFICATE-----
-----BEGIN CERTIFICATE-----
(Your Intermediate certificate: DigiCertCA.crt)
-----END CERTIFICATE-----
-----BEGIN CERTIFICATE-----
(Your Root certificate: TrustedRoot.crt)
-----END CERTIFICATE-----
```

Also update the _AnotherHost path and URL_ for the `jira:deploy` and `jira:start:browser` scripts in [package.json](../../package.json).

### node commands

Use default configuration:
```bash
node main.js # or npm run jira:start:node
```

Pass credentials too:
```bash
pw=<your-password>
(export pw;node main.js)
```

Use another configuration:
```bash
(export pw;node main.js --altFetchCase 1) # use command-line arguments
(export pw;altFetchCase=1 node main.js) # or use environment variables
```

PS: Don't forget that have (or not have) a `ca.cer` file (see above) may change the behaviour for `https` requests.

### browser commands

In the `browser` we use the `authentication cookie`.<br />You should first login/logout in JIRA to experience authorized/unauthorized responses from these commands.

Use default configuration:
```bash
npm run jira:build;npm run jira:deploy;npm run jira:start:browser
```

Use another configuration:
```bash
altFetchCase=1 npm run jira:build;npm run jira:deploy;npm run jira:start:browser
```

PS:
- `run jira:build` uses `browserify` with `envify` as parameter to change all process.env.VAR by their current values. We pass `purge` to envify to flush all process.env.VAR from the bundle file.
- `npm run jira:deploy` copies the built files to //anotherhost.mycompany/playground/ (accessible via https://anotherhost.mycompany/playground/) because `CORS` does not accept requests made from `localhost`. To make CORS to work, we must first configure the JIRA server (on premise installations only) to put http://anotherhost.mycompany and https://anotherhost.mycompany in the `whitelist`.
- `npm run jira:start:browser` opens https://anotherhost.mycompany/playground/jira-stories.html which executes the built bundle file. When jiraUrl is `http`, you should open http://anotherhost.mycompany/playground/jira-stories.html instead.
