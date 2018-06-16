# App React Redux

See also:
- [ES5 React increment counter example](https://codepen.io/kanekotic/pen/LxbJNJ)
- https://clockwise.software/blog/angular-vs-react-vs-vue/

## Docker

```bash
docker build -t app-react-redux:v1 .
docker run -e JIRA_PORT="45450" -p 20000:2000 -d app-react-redux:v1 # Hyper-V
docker run -e JIRA_HOST="192.168.99.100" -e JIRA_PORT="45450" -p 20000:2000 -d app-react-redux:v1 # VirtualBox
```

## IBM Cloud

```bash
bx login -a https://api.eu-de.bluemix.net
bx cs region-set eu-central
bx cs cluster-config mycluster
export KUBECONFIG=$HOME/.bluemix/.../mycluster/kube-config-mil01-mycluster.yml

docker login
bx cr login
bx cr image-rm registry.eu-de.bluemix.net/jirajsapps/app-react-redux:v1
bx cr build -t registry.eu-de.bluemix.net/jirajsapps/app-react-redux:v1 .

kubectl delete service app-react-redux-service
kubectl delete deployment app-react-redux

kubectl run app-react-redux --image=registry.eu-de.bluemix.net/jirajsapps/app-react-redux:v1 --env="JIRA_HOST=159.122.179.53" --env="JIRA_PORT=32123"
kubectl create -f app-react-redux-service.yml

kubectl describe service app-react-redux-service  # Get NodePort
bx cs workers mycluster                          # Get public IP
```
