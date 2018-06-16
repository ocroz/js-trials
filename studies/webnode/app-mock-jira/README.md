# App Mock Jira

Mock JIRA at http://localhost:4545/jira.

To:
- Implement few REST API functions
- Render an issue at http://localhost:4545/jira/browse/:key
- Embed a custom jira issue collector

## Docker

```bash
docker build -t app-mock-jira:v1 .
docker run -e PUBLIC_PORT=45450 -p 45450:4545 -d app-mock-jira:v1 # Hyper-V
docker run -e PUBLIC_HOST="192.168.99.100" -e PUBLIC_PORT=45450 -p 45450:4545 -d app-mock-jira:v1 # VirtualBox

docker ps
docker logs [CONTAINER_ID]
```

## IBM Cloud

```bash
bx login -a https://api.eu-de.bluemix.net
bx plugin install container-service|container-registry -r Bluemix
bx cs region-set eu-central
bx cs clusters
bx cs cluster-config mycluster
export KUBECONFIG=$HOME/.bluemix/.../mycluster/kube-config-mil01-mycluster.yml
kubectl get nodes|pods

docker login # Hyper-V or VirtualBox must be running
bx cr login
bx cr namespaces
bx cr namespace-add jirajsapps
bx cr image-rm registry.eu-de.bluemix.net/jirajsapps/app-mock-jira:v1
bx cr build -t registry.eu-de.bluemix.net/jirajsapps/app-mock-jira:v1 .
bx cr images

kubectl get deployments|services
kubectl delete service app-mock-jira-service
kubectl delete deployment app-mock-jira

kubectl run app-mock-jira --image=registry.eu-de.bluemix.net/jirajsapps/app-mock-jira:v1 --env="SERVER_HOST=0.0.0.0" --env="PUBLIC_HOST=159.122.179.53" --env="PUBLIC_PORT=32123"
kubectl create -f app-mock-jira-service.yml

kubectl describe service app-mock-jira-service  # Get NodePort
bx cs workers mycluster                        # Get public IP
```
