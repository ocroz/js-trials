# Alternative ways but fetch to make http requests

## Basic example with jira

### Configuration

Update the default configuration at [src/jira/cfg/jira-config.json](src/jira/cfg/jira-config.json).
```javascript
{
  // 0=errors.js, 1=issue.js
  "story": 0,
  // 0=fetch
  // browser: 1=jquery, 2=xhr, 3=webix
  // node: 1=http, 2=https, 3=request
  "altFetchCase": 0,
  // or http://10.0.92.154:8080/jira
  "jiraUrl": "https://atlassian-test.hq.k.grp/jira"
}
```

Possibly create a [src/jira/cfg/ca.cer](src/jira/cfg/ca_https.cer) for `https` requests in `node`.
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

### node commands

Use default configuration:
```bash
node src/jira/main.js # or npm run jira:start:node
```

Pass credentials too:
```bash
pw=<your-password>
(export pw;node src/jira/main.js)
```

Use another configuration:
```bash
(export pw;node src/jira/main.js --altFetchCase 1) # use command-line arguments
(export pw;altFetchCase=1 node src/jira/main.js) # or use environment variables
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
- `npm run jira:deploy` copies the built files to //safetest.hq.k.grp/custom/tmp/ (accessible via https://safetest.hq.k.grp/Safetest/custom/tmp/) because `CORS` does not accept requests made from `localhost`. To make CORS to work, we must first configure the JIRA server (on premise installations only) to put http://safetest.hq.k.grp and https://safetest.hq.k.grp in the `whitelist`.
- `npm run jira:start:browser` opens https://safetest.hq.k.grp/Safetest/custom/tmp/jira-stories.html which executes the built bundle file. When jiraUrl is `http`, you should open http://safetest.hq.k.grp/Safetest/custom/tmp/jira-stories.html instead.
