http://c.itdo.jp/technical-information/docker-kubernetes/ha-rancher/

# 構成
lb-01
OS Rocky Linux8
vcpu 1
memory 1024MB
IP 192.168.0.150
IP 192.168.56.150
HDD 40GB

rancher-master-01
OS Rocky Linux8
vcpu 2
memory 2048MB
IP 192.168.0.151
IP 192.168.56.151
HDD 40GB

rancher-master-02
OS Rocky Linux8
vcpu 2
memory 2048MB
IP 192.168.0.152
IP 192.168.56.152
HDD 40GB

rancher-master-03
OS Rocky Linux8
vcpu 2
memory 2048MB
IP 192.168.0.153
IP 192.168.56.153
HDD 40GB

rancher-worker-01
OS Rocky Linux8
vcpu 2
memory 2048MB
IP 192.168.0.154
IP 192.168.56.154
HDD 40GB

# vagrant構築
vagrant plugin install vagrant-disksize
vagrant plugin install vagrant-vbguest

cd /Users/tadanobu/Documents/Kubernetes/rancher-ha/lb-01
vagrant up

cd /Users/tadanobu/Documents/Kubernetes/rancher-ha/rancher-master
vagrant up

cd /Users/tadanobu/Documents/Kubernetes/rancher-ha/rancher-worker
vagrant up

# 全vagrantの端末へvagrant shhで接続し、以下を設定する
[tadanobu@MacBook-Pro ]$ vagrant ssh rancher-master-01
[rancher@rancher-master-01 ~]$ sudo passwd
※パスワードは以下
ffff

[rancher@rancher-master-01 ~]$ su
[root@rancher-master-01 rancher]# vi /etc/ssh/sshd_config
PermitRootLogin yes
PasswordAuthentication yes
[root@rancher-master-01 rancher]# vi /etc/selinux/config
# SELINUX=enforcing
SELINUX=disabled
[root@rancher-master-01 rancher]# exit
[rancher@rancher-master-01 ~]$ exit
[tadanobu@MacBook-Pro ]$ vagrant halt rancher-master-01
[tadanobu@MacBook-Pro ]$ vagrant up rancher-master-01

# LB構築
[tadanobu@MacBook-Pro ]$ cd /Users/tadanobu/Documents/Kubernetes/rancher-ha/lb-01
[tadanobu@MacBook-Pro ]$ vagrant ssh
[vagrant@lb-01 ~]$ su
[root@lb-01 vagrant]# dnf -y install nginx nginx-mod-stream
cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf_back
vi /etc/nginx/nginx.conf
## ※ファイルの内容 デフォルトの記載は消して、以下を書き込みます。
```
worker_processes 4;
worker_rlimit_nofile 40000;
include /usr/share/nginx/modules/*.conf;

events {
    worker_connections 8192;
}

stream {
    upstream rancher_servers_http {
        least_conn;
        server 192.168.56.151:80 max_fails=3 fail_timeout=5s;
        server 192.168.56.152:80 max_fails=3 fail_timeout=5s;
        server 192.168.56.153:80 max_fails=3 fail_timeout=5s;
    }
    server {
        listen 80;
        proxy_pass rancher_servers_http;
    }

    upstream rancher_servers_https {
        least_conn;
        server 192.168.56.151:443 max_fails=3 fail_timeout=5s;
        server 192.168.56.152:443 max_fails=3 fail_timeout=5s;
        server 192.168.56.153:443 max_fails=3 fail_timeout=5s;
    }
    server {
        listen     443;
        proxy_pass rancher_servers_https;
    }
}
```

[root@lb-01 vagrant]# systemctl enable --now nginx

# DNS構築
[root@lb-01 vagrant]# dnf -y install bind bind-utils
[root@lb-01 vagrant]# vi /etc/named.example.com.conf
## ファイル内容
```
zone example.com. IN {
  type master;
  file "example.com.zone";
};
```

[root@lb-01 vagrant]# cp /etc/named.conf /etc/named.conf_back
[root@lb-01 vagrant]# vi /etc/named.conf

## ※options内のlisten-on port 53を、以下内容にする
```
listen-on port 53 { localhost; 8.8.8.8; 8.8.4.4; };
```

## ※options内のallow-queryを、以下内容にする
```
allow-query     { localhost; 192.168.0.0/24; 8.8.8.8/32; 8.8.4.4/32; 
```

## ※options内のdnssec-〜を、以下内容にする
```
//dnssec-enable yes;
//dnssec-validation yes;
dnssec-enable no;
dnssec-validation no;
```

## ※options内へ、以下内容を追記する
```
    forwarders { 8.8.8.8; 8.8.4.4; };
```

## ※以下を末尾へ追記
```
include "/etc/named.example.com.conf";
```


## ゾーンファイル作成
[root@lb-01 vagrant]# vi /var/named/example.com.zone
### ファイル内容（タブはタブキーで入力すること）
```
$TTL 86400

@ IN SOA lb.example.com root.example.com (
    2018050600
    3600
    900
    604800
    86400
)

    IN  NS  lb.example.com.
lb  IN  A   192.168.0.150
rancher-master-01   IN  A   192.168.56.151
rancher-master-02   IN  A   192.168.56.152
rancher-master-02   IN  A   192.168.56.153
```

### bind再起動
[root@lb-01 vagrant]# systemctl enable --now named

### 全てのVMのDNSサーバをlb-0に設定（「rancher-〜」のVM全てに以下の設定をする）

[tadanobu@MacBook-Pro ]$ vagrant ssh rancher-master-01
[rancher@rancher-master-01 ~]$ su
[root@rancher-master-01 ~]# cp /etc/resolv.conf /etc/resolv.conf_back
[root@rancher-master-01 ~]# vi /etc/resolv.conf

## 内容を以下に書き換える
```
nameserver 192.168.0.150
options edns0
search example.com
```

# Dockerのインストール
[tadanobu@MacBook-Pro ]$ vagrant ssh rancher-master-01
[rancher@rancher-master-01 ~]$ su
[root@rancher-master-01 ~]# dnf config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
[root@rancher-master-01 ~]# dnf repolist | grep docker
[root@rancher-master-01 ~]# dnf -y install docker-ce
※エラーが出る場合は以下
[root@rancher-master-01 ~]# dnf -y install docker-ce --allowerasing
[root@rancher-master-01 ~]# docker -v
[root@rancher-master-01 ~]# systemctl enable docker
[root@rancher-master-01 ~]# systemctl start docker
[root@rancher-master-01 ~]# su vagrant
[rancher@rancher-master-01 ~]$ sudo usermod -aG docker ${USER}
[rancher@rancher-master-01 ~]$ exit
[root@rancher-master-01 ~]# systemctl restart docker
[root@rancher-master-01 ~]# docker info
[root@rancher-master-01 ~]# docker run hello-world
[root@rancher-master-01 ~]# docker rm $(docker ps -q -a)
[root@rancher-master-01 ~]# docker rmi $(docker images -q)
[root@rancher-master-01 ~]# dnf -y install net-tools bind-utils

# rkeインストール
root@lb-0:~# dnf -y install wget
root@lb-0:~# wget https://github.com/rancher/rke/releases/download/v1.3.7/rke_linux-amd64
root@lb-0:~# mv rke_linux-amd64 /usr/local/bin/rke
root@lb-0:~# chmod +x /usr/local/bin/rke

# 鍵作成＆配布
root@lb-0:~# ssh-keygen
root@lb-0:~# cat ~/.ssh/id_rsa.pub 
[vagrant@rancher-master-02 ~]$ su
[root@rancher-master-02 vagrant]# mkdir ~/.ssh
[root@rancher-master-02 vagrant]# vi ~/.ssh/authorized_keys
```
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQC6oJjBl3Aei1x2+8dSfQZTiyG06VLcs2y/QVIMCIAMWG3h9MsBVwmEB2q4e0iOO2GYBYYOb37S5Mmtq7EslTcI9KT0h+2tyeIW/5gCzR4jeH/xoSJmQDAvbVMIbJ2OJv+qX4y7NtpIrV7hCZBG55/LHIn6tYAOCZhFI/HCkdywRuG184AOYDBGkH4odOE/Tiqn6+LjXrM6J4jvcHxAi4DwTXjlICHj0loPwwZOvNayCe61ROEqHVCV2S1zilWpxU0A1+p9+o06pGlgHIBYagnqB33joSZaCTjRqs3DK88InS8yYMXDIB51tpI326PtuqZ07G3Pn4aUp6R5/SJp55I7oCJfbMSWZewRL55WDV+gx0fVZdHXy/4lHk2CSSawngq3HPj+abp4zWEcR6mAPej89AOZ8LzkG66AGDfJ42jh8OqS1ib8R3oQmpPcdb3PF3X6N1zfhuqNhjAUpHAnymXcADZOKaznAg/+2soCit6muZ3spVwjaMV/7oBpTHh6enU= root@lb-01
```
[root@rancher-master-02 vagrant]# chmod 700 ~/.ssh
[root@rancher-master-02 vagrant]# chmod 600 ~/.ssh/authorized_keys 

# k8sクラスタファイル作成
root@lb-0:~# vi rancher-cluster.yml
## ファイル内容
```
nodes:
  - address: 192.168.56.151
    user: root
    role: [controlplane, etcd, worker]
    internal_address: 192.168.56.151
  - address: 192.168.56.152
    user: root
    role: [controlplane, etcd, worker]
    internal_address: 192.168.56.152
  - address: 192.168.56.153
    user: root
    role: [controlplane, etcd, worker]
    internal_address: 192.168.56.153

services:
  etcd:
    snapshot: true
    creation: 6h
    retention: 24h

network:
  plugin: canal
  options:
    canal_iface: eth2

dns:
  provider: coredns
  upstreamnameservers:
  - 192.168.56.150

# Required for external TLS termination with
# ingress-nginx v0.22+
ingress:
  provider: nginx
  options:
    use-forwarded-headers: "true"
```

root@lb-0:~# rke up --config rancher-cluster.yml

# エラーの場合、またはクラスター作り直しの時
https://github.com/rancher/rke/issues/1835
```
1.【スキップ】新しいservice-account-token-key.pemを生成します
root@lb-0:~# openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout ./cluster_certs/kube-service-account-token-key.pem -out ./cluster_certs/kube-service-account-token.pem

2.rkeクラスター削除
root@lb-0:~# rke remove --config rancher-cluster.yml
root@lb-0:~# rm -rf ~/.kube

3.すべてのDockerコンテナとkubernetes証明書をクリーンアップ
# 全ノードで以下を実行
[root@rancher-master-01 ~]# docker stop $(docker ps -a -q); docker rm $(docker ps -a -q); docker rmi $(docker images -q); sudo rm -rf /etc/kubernetes; docker images; docker ps -a
root@lb-0:~# rm -rf /etc/kubernetes

4.【スキップ】rkeクラスタ作成
rke up --config rancher-cluster.yml --custom-certs
```

root@lb-0:~# mkdir ~/.kube
root@lb-0:~# cp kube_config_rancher-cluster.yml ~/.kube/config
root@lb-0:~# cat <<EOF > /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://packages.cloud.google.com/yum/repos/kubernetes-el7-x86_64
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=https://packages.cloud.google.com/yum/doc/yum-key.gpg https://packages.cloud.google.com/yum/doc/rpm-package-key.gpg
EOF
root@lb-0:~# dnf repolist
root@lb-0:~# dnf -y install kubelet kubeadm kubectl
root@lb-0:~# kubectl get nodes

# lb-01へHelmのインストール
root@lb-0:~# curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
root@lb-0:~# helm version
root@lb-0:~# helm repo add stable https://charts.helm.sh/stable
root@lb-0:~# helm repo update
root@lb-0:~# helm repo list
root@lb-0:~# helm repo add rancher-latest https://releases.rancher.com/server-charts/latest
root@lb-0:~# kubectl apply -f https://github.com/jetstack/cert-manager/releases/download/v1.4.4/cert-manager.crds.yaml
root@lb-0:~# kubectl create namespace cert-manager
root@lb-0:~# kubectl label namespace cert-manager certmanager.k8s.io/disable-validation=true 
root@lb-0:~# helm repo add jetstack https://charts.jetstack.io
root@lb-0:~# helm repo update

# cert-managerインストール
root@lb-0:~# helm install cert-manager --namespace cert-manager --version v1.4.4 jetstack/cert-manager
NAME: cert-manager
LAST DEPLOYED: Fri Mar  4 22:16:12 2022
NAMESPACE: cert-manager
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES:
cert-manager has been deployed successfully!

In order to begin issuing certificates, you will need to set up a ClusterIssuer
or Issuer resource (for example, by creating a 'letsencrypt-staging' issuer).

More information on the different types of issuers and how to configure them
can be found in our documentation:

https://cert-manager.io/docs/configuration/

For information on how to configure cert-manager to automatically provision
Certificates for Ingress resources, take a look at the `ingress-shim`
documentation:

https://cert-manager.io/docs/usage/ingress/

# rancherインストール
root@lb-0:~# kubectl create namespace cattle-system
root@lb-0:~# helm repo add rancher-latest https://releases.rancher.com/server-charts/latest
root@lb-0:~# helm install rancher rancher-latest/rancher --namespace cattle-system --set hostname=lb.example.com
W0303 20:26:37.104897    8886 warnings.go:70] cert-manager.io/v1beta1 Issuer is deprecated in v1.4+, unavailable in v1.6+; use cert-manager.io/v1 Issuer
NAME: rancher
LAST DEPLOYED: Thu Mar  3 20:26:36 2022
NAMESPACE: cattle-system
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES:
Rancher Server has been installed.
NOTE: Rancher may take several minutes to fully initialize. Please standby while Certificates are being issued, Containers are started and the Ingress rule comes up.
Check out our docs at https://rancher.com/docs/
If you provided your own bootstrap password during installation, browse to https://lb.example.com to get started.
If this is the first time you installed Rancher, get started by running this command and clicking the URL it generates:
```
echo https://lb.example.com/dashboard/?setup=$(kubectl get secret --namespace cattle-system bootstrap-secret -o go-template='{{.data.bootstrapPassword|base64decode}}')
```
To get just the bootstrap password on its own, run:
```
kubectl get secret --namespace cattle-system bootstrap-secret -o go-template='{{.data.bootstrapPassword|base64decode}}{{ "\n" }}'
```
Happy Containering!
