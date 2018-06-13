# App Mock Jira

Mock JIRA at http://localhost:4545/jira.

To:
- Implement few REST API functions
- Render an issue at http://localhost:4545/jira/browse/:key
- Embed a custom jira issue collector

## Docker

```bash
docker build -t app-mock-jira:v1 .
docker run -e DOCKER_PORT=45450 -p 45450:4545 -d app-mock-jira:v1

docker ps
docker logs [CONTAINER_ID]
```
