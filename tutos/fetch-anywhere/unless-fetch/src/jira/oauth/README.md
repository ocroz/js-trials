# OAuth 1.0 for JIRA

First get a oauth token / secret pair: See [token/](token/README.md).

Then update the default configuration in [../cfg/jira-config.json](../cfg/).
```javascript
{
  "story": 0,
  "altFetchCase": 0,
  "jiraUrl": "https://atlassian-mycompagny/jira",
  "authMethod": "OAuth1",
  "consumerKey": "myapp-mycompagny",
  "oauthToken": "MyOAuthT0k3N",
  "oauthTokenSecret": "MyOAuthT0k3NS3cr3T"
}
```
