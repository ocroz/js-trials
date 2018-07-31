# Getting Started With Kubernetes On Windows 10 Using HyperV And MiniKube

References:
- https://www.c-sharpcorner.com/article/getting-started-with-kubernetes-on-windows-10-using-hyperv-and-minikube/
- https://github.com/kubernetes/minikube/issues/2976
- https://github.com/kubernetes/minikube/issues/1408

Download MiniKube for Windows and rename it as:<br/>
`C:\Program Files (x86)\Kubernetes\Minikube\minikube.exe`

Open a PowerShell session as Administrator:
```dos
C:\WINDOWS\system32> powershell
```

Force using the `localkube bootstrapper`:
```powershell
function minikube { cmd /c ${env:ProgramFiles(x86)}\Kubernetes\Minikube\minikube.exe --bootstrapper=localkube $args }
minikube config set ShowBootstrapperDeprecationNotification false
```

Start minikube:
```powershell
minikube start --vm-driver=hyperv --kubernetes-version="v1.10.0" --hyperv-virtual-switch="Ethernet" --memory 4096 --cpus=2
# --v=7 --alsologtostderr
# --bootstrapper=kubeadm
```

Add public key (optional):
```bash
ssh docker@minikube # See below for minikube IP and docker password
$ mkdir .ssh && chmod 700 .ssh
$ vi .ssh/authorized_keys # << $HOME/.minikube/machines/minikube/id_rsa.pub
$ chmod 600 .ssh/authorized_keys
```

Add certificates (optional):
```bash
# powershell
minikube status # Should be Running + Running + Minikube IP
# bash
ssh docker@minikube # See above IP for minikube, password = tcuser
$ sudo vi /etc/ssl/certs/ca-certificates.crt # Add firewall.cer
$ sudo systemctl restart docker
```

Kubernetes dashboard:
```powershell
kubectl get pods --all-namespaces
minikube logs
minikube dashboard
```

Minikube commands:
```powershell
minikube status # start
minikube stop   # + minikube ssh > sudo poweroff
minikube delete # + Remove-Item $env:USERPROFILE\.minikube -Force -Recurse
minikube logs
minikube ssh
minikube dashboard
```

Kubectl commands:
```powershell
kubectl get pods --all-namespaces
kubectl get all # --all-namespaces
```
