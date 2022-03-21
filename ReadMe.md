http://c.itdo.jp/technical-information/docker-kubernetes/ha-rancher/

# 構成
lb-01
OS Rocky Linux8
vcpu 1
memory 1024MB
IP 192.168.0.150
HDD 40GB

【mac】rancher-master-01
OS Rocky Linux8
vcpu 4
memory 4096MB
IP 192.168.0.151
HDD 40GB

【mac】rancher-master-02
OS Rocky Linux8
vcpu 4
memory 4096MB
IP 192.168.0.152
HDD 40GB

【win】rancher-master-03
OS Rocky Linux8
vcpu 4
memory 4096MB
IP 192.168.0.153
HDD 40GB

# 【mac】rancher-worker-01
# OS Rocky Linux8
# vcpu 2
# memory 2048MB
# IP 192.168.0.154
# HDD 40GB

【win】rancher-worker-02
OS Rocky Linux8
vcpu 2
memory 2048MB
IP 192.168.0.155
HDD 40GB

【win】rancher-worker-03
OS Rocky Linux8
vcpu 2
memory 2048MB
IP 192.168.0.156
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

※vagrant up後、全てvagrant haltしてからVirtualBoxの設定→ネットワーク→アダプター2→アダプタータイプを「PCnet-FAST III (Am79C973)」へ変更して保存する。

# 全vagrantの端末へvagrant shhで接続し、以下を設定する
[tadanobu@MacBook-Pro ]$ vagrant ssh rancher-master-03
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
[root@rancher-master-01 rancher]# vi /etc/rc.d/rc.local
## ※ファイル末尾に以下を追記
```
echo -e "nameserver 192.168.0.150\nnameserver 8.8.8.8\nnameserver 8.8.4.4" > /etc/resolv.conf
```
[root@rancher-master-01 rancher]# chmod 744 /etc/rc.d/rc.local
[root@rancher-master-01 rancher]# vi /etc/NetworkManager/NetworkManager.conf
## ※以下のように[main]セクション以下へ「dns=none」を追記する
```
[main]
dns=none
```
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
        server 192.168.0.151:80 max_fails=3 fail_timeout=5s;
        server 192.168.0.152:80 max_fails=3 fail_timeout=5s;
        server 192.168.0.153:80 max_fails=3 fail_timeout=5s;
    }
    server {
        listen 80;
        proxy_pass rancher_servers_http;
    }

    upstream rancher_servers_https {
        least_conn;
        server 192.168.0.151:443 max_fails=3 fail_timeout=5s;
        server 192.168.0.152:443 max_fails=3 fail_timeout=5s;
        server 192.168.0.153:443 max_fails=3 fail_timeout=5s;
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
rancher-master-01   IN  A   192.168.0.151
rancher-master-02   IN  A   192.168.0.152
rancher-master-03   IN  A   192.168.0.153
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
[root@rancher-master-01 ~]# systemctl enable docker; systemctl start docker
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
[root@rancher-master-02 vagrant]# chmod 700 ~/.ssh; chmod 600 ~/.ssh/authorized_keys 

https://www.suse.com/suse-rancher/support-matrix/all-supported-versions/rancher-v2-6-0/


# k8sクラスタファイル作成
root@lb-0:~# vi rancher-cluster.yml
## ファイル内容
```
nodes:
  - address: 192.168.0.151
    user: root
    role: [controlplane, etcd, worker]
    internal_address: 192.168.0.151
  - address: 192.168.0.152
    user: root
    role: [controlplane, etcd, worker]
    internal_address: 192.168.0.152
  - address: 192.168.0.153
    user: root
    role: [controlplane, etcd, worker]
    internal_address: 192.168.0.153
  - address: 192.168.0.155
    user: root
    role: [worker]
    internal_address: 192.168.0.155
  - address: 192.168.0.156
    user: root
    role: [worker]
    internal_address: 192.168.0.156

services:
  etcd:
    snapshot: true
    creation: 6h
    retention: 24h

network:
  plugin: calico
# network:
#   plugin: canal
#   options:
#     canal_iface: eth2

dns:
  provider: coredns
  upstreamnameservers:
  - 192.168.0.150

# Required for external TLS termination with
# ingress-nginx v0.22+
ingress:
  provider: nginx
  options:
    use-forwarded-headers: "true"
kubernetes_version: "v1.21.9-rancher1-1"
```

root@lb-0:~# rke up --config rancher-cluster.yml

## ※１）FATA[0218] Failed to get job complete status for job rke-ingress-controller-deploy-job in namespace kube-system
## ※２）FATA[0546] [controlPlane] Failed to bring up Control Plane: [Failed to verify healthcheck: Service [kube-apiserver] is not healthy on host [192.168.0.153]. Response code: [403], response body: {"kind":"Status","apiVersion":"v1","metadata":{},"status":"Failure","message":"forbidden: User \"kube-apiserver\" cannot get path \"/healthz\"","reason":"Forbidden","details":{},"code":403}
## ※３）FATA[0175] Failed to get job complete status for job rke-coredns-addon-deploy-job in namespace kube-system
, log: I0313 01:17:47.077492       1 controller.go:611] quota admission added evaluator for: rolebindings.rbac.authorization.k8s.io]
１ノードだけ有効にして他コメント化した状態でrancher-cluster.ymlを編集してからrke up --config rancher-cluster.ymを実行。その後１ノードずつ増やしつつrke up --config rancher-cluster.ymを実行するとうまくいったりする。
また、rke up --config rancher-cluster.ymlをもう一度実行すると、何回かやっていると成功する場合がある。
https://github.com/rancher/rke/issues/1461


## ※エラーの場合、またはクラスター作り直しの時
https://github.com/rancher/rke/issues/1835
```
1.【スキップ】新しいservice-account-token-key.pemを生成します
root@lb-0:~# openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout ./cluster_certs/kube-service-account-token-key.pem -out ./cluster_certs/kube-service-account-token.pem

2.rkeクラスター削除
root@lb-0:~# rke remove --config rancher-cluster.yml; rm -rf ~/.kube

3.すべてのDockerコンテナとkubernetes証明書をクリーンアップ
# 全ノードで以下を実行
root@lb-0:~# ssh root@192.168.0.151
[root@rancher-master-01 ~]# docker stop $(docker ps -a -q); docker rm $(docker ps -a -q); docker rmi $(docker images -q); docker volume rm $(docker volume ls -q); for mount in $(mount | grep tmpfs | grep '/var/lib/kubelet' | awk '{ print $3 }') /var/lib/kubelet /var/lib/rancher; do umount $mount; done; rm -rf /etc/ceph /etc/cni /etc/kubernetes /opt/cni /opt/rke /run/secrets/kubernetes.io /run/calico /run/flannel /var/lib/calico /var/lib/etcd /var/lib/cni /var/lib/kubelet /var/lib/rancher/rke/log /var/log/containers /var/log/pods /var/run/calico; docker images; docker ps -a; systemctl restart docker; shutdown now -r

root@lb-0:~# for mount in $(mount | grep tmpfs | grep '/var/lib/kubelet' | awk '{ print $3 }') /var/lib/kubelet /var/lib/rancher; do umount $mount; done; rm -rf /etc/ceph /etc/cni /etc/kubernetes /opt/cni /opt/rke /run/secrets/kubernetes.io /run/calico /run/flannel /var/lib/calico /var/lib/etcd /var/lib/cni /var/lib/kubelet /var/lib/rancher/rke/log /var/log/containers /var/log/pods /var/run/calico

4.【スキップ】rkeクラスタ作成
rke up --config rancher-cluster.yml --custom-certs
```

root@lb-0:~# mkdir ~/.kube; cp kube_config_rancher-cluster.yml ~/.kube/config
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
root@lb-0:~# kubectl get nodes; kubectl get pods --all-namespaces
https://kubernetes.io/ja/docs/reference/kubectl/cheatsheet/

# lb-01へHelmのインストール
root@lb-0:~# curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
root@lb-0:~# helm version
root@lb-0:~# helm repo add stable https://charts.helm.sh/stable
root@lb-0:~# helm repo update
root@lb-0:~# helm repo list
root@lb-0:~# helm repo add rancher-latest https://releases.rancher.com/server-charts/latest

https://cert-manager.io/docs/installation/
https://cert-manager.io/docs/installation/helm/
root@lb-0:~# helm repo add jetstack https://charts.jetstack.io
root@lb-0:~# helm repo update

# cert-managerインストール
# root@lb-0:~# helm install cert-manager jetstack/cert-manager --namespace cert-manager --create-namespace --version v1.7.1 --set installCRDs=true
root@lb-0:~# helm install cert-manager jetstack/cert-manager --namespace cert-manager --create-namespace --version v1.7.1 --set installCRDs=true --set webhook.timeoutSeconds=30
NAME: cert-manager
LAST DEPLOYED: Sat Mar 12 11:53:30 2022
NAMESPACE: cert-manager
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES:
cert-manager v1.7.1 has been deployed successfully!

In order to begin issuing certificates, you will need to set up a ClusterIssuer
or Issuer resource (for example, by creating a 'letsencrypt-staging' issuer).

More information on the different types of issuers and how to configure them
can be found in our documentation:

https://cert-manager.io/docs/configuration/

For information on how to configure cert-manager to automatically provision
Certificates for Ingress resources, take a look at the `ingress-shim`
documentation:

https://cert-manager.io/docs/usage/ingress/


## ※エラーの場合
E0312 18:33:06.996301    2619 reflector.go:138] k8s.io/client-go@v0.23.1/tools/cache/reflector.go:167: Failed to watch *unstructured.Unstructured: Get "https://192.168.0.151:6443/apis/batch/v1/namespaces/cert-manager/jobs?allowWatchBookmarks=true&fieldSelector=metadata.name%3Dcert-manager-startupapicheck&resourceVersion=6921&timeoutSeconds=565&watch=true": http2: client connection lost
W0312 18:33:09.104210    2619 reflector.go:324] k8s.io/client-go@v0.23.1/tools/cache/reflector.go:167: failed to list *unstructured.Unstructured: Get "https://192.168.0.151:6443/apis/batch/v1/namespaces/cert-manager/jobs?fieldSelector=metadata.name%3Dcert-manager-startupapicheck&resourceVersion=6921": dial tcp 192.168.0.151:6443: connect: no route to host
E0312 18:33:09.104287    2619 reflector.go:138] k8s.io/client-go@v0.23.1/tools/cache/reflector.go:167: Failed to watch *unstructured.Unstructured: failed to list *unstructured.Unstructured: Get "https://192.168.0.151:6443/apis/batch/v1/namespaces/cert-manager/jobs?fieldSelector=metadata.name%3Dcert-manager-startupapicheck&resourceVersion=6921": dial tcp 192.168.0.151:6443: connect: no route to host
Error: INSTALLATION FAILED: failed post-install: timed out waiting for the condition
[root@lb-01 ~]# helm install cert-manager jetstack/cert-manager --namespace cert-manager --create-namespace --version v1.7.1 --set installCRDs=true
Error: INSTALLATION FAILED: rendered manifests contain a resource that already exists. Unable to continue with install: could not get information about the resource ServiceAccount "cert-manager-cainjector" in namespace "cert-manager": etcdserver: request timed out
[root@lb-01 ~]# helm uninstall cert-manager jetstack/cert-manager --namespace cert-manager
Error: uninstall: Release not loaded: cert-manager: query: failed to query with labels: etcdserver: request timed out
[root@lb-01 ~]# helm list
Error: list: failed to list: etcdserver: request timed out

## helmのcert-managerをアンインストールして、namespaceも消してからリトライする
```
[root@lb-01 ~]# helm uninstall cert-manager --namespace cert-manager
[root@lb-01 ~]# kubectl delete namespace cert-manager
[root@lb-01 ~]# kubectl get ns cert-manager -o json > tmp.json
[root@lb-01 ~]# vi ./tmp.json
[root@lb-01 ~]# curl -k -H "Content-Type: application/json" -X PUT --data-binary @tmp.json http://127.0.0.1:8001/api/v1/namespaces/cert-manager/finalize
```

root@lb-0:~# kubectl get pods --namespace cert-manager

# rancherインストール
https://www.rancher.co.jp/docs/rancher/v2.x/en/installation/ha/helm-rancher/
root@lb-0:~# kubectl create namespace cattle-system
root@lb-0:~# helm repo add rancher-stable https://releases.rancher.com/server-charts/stable
root@lb-0:~# helm install rancher rancher-stable/rancher --version=2.6 --namespace cattle-system --set hostname=lb.example.com
# root@lb-0:~# helm install rancher rancher-stable/rancher --namespace cattle-system --set hostname=lb.example.com
NAME: rancher
LAST DEPLOYED: Sat Mar 12 19:11:57 2022
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


## ※ダメな場合
Error: INSTALLATION FAILED: Internal error occurred: failed calling webhook "validate.nginx.ingress.kubernetes.io": Post "https://ingress-nginx-controller-admission.ingress-nginx.svc:443/networking/v1/ingresses?timeout=10s": x509: certificate signed by unknown authority
Error: INSTALLATION FAILED: Internal error occurred: failed calling webhook "webhook.cert-manager.io": Post "https://cert-manager-webhook.cert-manager.svc:443/mutate?timeout=10s": context deadline exceeded

[root@lb-01 ~]# helm uninstall rancher rancher-stable/rancher --namespace cattle-system
W0313 18:06:19.316108    4751 warnings.go:70] policy/v1beta1 PodSecurityPolicy is deprecated in v1.21+, unavailable in v1.25+
W0313 18:06:25.113995    4751 warnings.go:70] policy/v1beta1 PodSecurityPolicy is deprecated in v1.21+, unavailable in v1.25+

[root@lb-01 ~]# kubectl delete namespace cattle-system
[root@lb-01 ~]# kubectl get ns cattle-system -o json > tmp.json
[root@lb-01 ~]# vi tmp.json
[root@lb-01 ~]# curl -k -H "Content-Type: application/json" -X PUT --data-binary @tmp.json http://127.0.0.1:8001/api/v1/namespaces/cattle-system/finalize



kubectl get pods --all-namespaces


Rancherに初めてアクセスするようなので、起動時のパスワードを事前に設定している場合は、ここに入力してください。そうでなければ、ランダムなパスワードが生成されます。それを見つけるには

docker run」インストールの場合。
docker psでコンテナIDを検索し、実行します。
docker logs  container-id  2>&1 | grep "Bootstrap Password:"
を実行します。

Helmインストールの場合、実行します。

kubectl get secret --namespace cattle-system bootstrap-secret -o go-template='{{.data.bootstrapPassword|base64decode}}{{"\n"}}'
 を実行します。

ng8c2sg9529mgfgcsw7k424b4sqxlv4ktf9vwqlxxjwtrpb4wbfdms
ユーザID：admin
パスワード：I0Fm9bI3gfqEdyIl

kubectl get pods --all-namespaces
kubectl -n cattle-system logs -f rancher-6bcbdd6cb7-trsd9
kubectl exec -it rancher-6bcbdd6cb7-trsd9 /bin/bash -n cattle-system





# 試したいこと
・worker nodeの追加
・PostgreSQL Operator
・Longhorn
