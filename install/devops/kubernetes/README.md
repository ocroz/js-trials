# Install a kubernetes docker cluster on centos 7

References:
- https://kubernetes.io/docs/setup/independent/install-kubeadm/ +next
- https://www.howtoforge.com/tutorial/centos-kubernetes-docker-cluster/
- https://docs.projectcalico.org/v3.1/getting-started/kubernetes/

On all k8s master and node servers:
```bash
# Configure Hosts
vi /etc/hosts # IPs for all k8s master and node servers

# Disable SWAP
swapoff -a && vi /etc/fstab # Comment the swap line UUID

# Install Docker
yum install -y docker

# Install Kubernetes
cat <<EOF > /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://packages.cloud.google.com/yum/repos/kubernetes-el7-x86_64
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=https://packages.cloud.google.com/yum/doc/yum-key.gpg https://packages.cloud.google.com/yum/doc/rpm-package-key.gpg
EOF
setenforce 0
yum install -y kubelet kubeadm kubectl

# To fix issues with traffic being routed incorrectly due to iptables being bypassed
cat <<EOF >  /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
EOF
sysctl --system

# Possibly reboot

# Start the services docker and kubelet
systemctl enable docker && systemctl start docker
systemctl enable kubelet && systemctl start kubelet

# Change the cgroup-driver
# docker info | grep -i cgroup
# KUBELET_KUBEADM_EXTRA_ARGS=--cgroup-driver=<value>
# https://github.com/kubernetes/kubernetes/issues/56850
# /etc/systemd/system/kubelet.service.d/11-cgroups.conf
# [Service]
# CPUAccounting=true
# MemoryAccounting=true
systemctl daemon-reload && systemctl restart kubelet
```

On k8s master server:
```bash
service firewalld stop
kubeadm init --pod-network-cidr=192.168.0.0/16

export KUBECONFIG=/etc/kubernetes/admin.conf
vi ~/.bashrc # Add the above line too
kubectl get pods --all-namespaces

kubectl apply -f https://docs.projectcalico.org/v3.1/getting-started/kubernetes/installation/hosted/rbac-kdd.yaml
kubectl apply -f https://docs.projectcalico.org/v3.1/getting-started/kubernetes/installation/hosted/kubernetes-datastore/calico-networking/1.7/calico.yaml
# kubectl apply -f https://docs.projectcalico.org/v3.1/getting-started/kubernetes/installation/hosted/kubeadm/1.7/calico.yaml
kubectl get pods --all-namespaces
```

On k8s node servers:
```bash
kubeadm join --token <token> <master-ip>:<master-port> --discovery-token-ca-cert-hash sha256:<hash>
```

On k8s deployment machine:
```bash
mkdir -p $HOME/.kube
vi $HOME/.kube/config # Copy content of /etc/kubernetes/admin.conf
export KUBECONFIG=$HOME/.kube/config
vi ~/.bashrc # Add the above line too
```

Then https://kubernetes.io/docs/tutorials/stateless-application/expose-external-ip-address/

PROBLEMS:
- Cannot expose a public IP
- Cannot start the Kubernetes Dashboard
