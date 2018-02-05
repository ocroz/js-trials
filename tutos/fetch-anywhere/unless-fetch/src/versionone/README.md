# Alternative ways but fetch to make http requests

## Basic example with VersionOne

### Configuration

Update the default configuration at [cfg/vone-config.json](cfg/vone-config.json).
```javascript
{
  // 0=errors.js, 1=info.js
  "story": 0,
  // 0=fetch
  // browser: 1=jquery, 2=xhr, 3=webix
  // node: 1=httpntlm, 2=httpreq, 3=http, 4=https, 5=request
  "altFetchCase": 0,
  // or http://10.0.92.154:8080/core
  "voneUrl": "https://versionone.mycompagny/core"
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

Also update the _VersionOne path and URL_ for the `vone:deploy` and `vone:start:browser` scripts in [package.json](../../package.json).

### node commands

Use default configuration:
```bash
node main.js # or npm run vone:start:node
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
npm run vone:build;npm run vone:deploy;npm run vone:start:browser
```

Use another configuration:
```bash
altFetchCase=1 npm run vone:build;npm run vone:deploy;npm run vone:start:browser
```

PS:
- `run vone:build` uses `browserify` with `envify` as parameter to change all process.env.VAR by their current values. We pass `purge` to envify to flush all process.env.VAR from the bundle file.
- `npm run vone:deploy` copies the built files to //versionone.mycompany/playground/ (accessible via https://versionone.mycompany/playground/) because VersionOne does not accept requests made from other hosts than `versionone.mycompany`.
- `npm run vone:start:browser` opens https://versionone.mycompany/playground/versionone-stories.html which executes the built bundle file. When voneUrl is `http`, you should open http://versionone.mycompany/playground/versionone-stories.html instead.
