# Install puppet

See https://www.digitalocean.com/community/tutorials/how-to-install-puppet-4-in-a-master-agent-setup-on-centos-7

## Add certificates (optional)

```bash
cd /etc/ssl/certs/
mv ca-bundle.crt _ca-bundle.crt;cp _ca-bundle.crt ca-bundle.crt
vi ca-bundle.crt # Add firewall.cer
```

## Puppet Server

```bash
visudo
usermod -aG wheel puppet
su - puppet
```

Also adjust the VM memory:
```bash
sudo rpm -ivh https://yum.puppetlabs.com/puppetlabs-release-pc1-el-7.noarch.rpm
sudo yum -y install puppetserver
sudo vi /etc/sysconfig/puppetserver # JAVA_ARGS="-Xms3g -Xmx3g"
```

```bash
sudo service puppetserver start;echo $?
sudo service puppetserver status # systemctl status puppetserver.service
sudo service puppetserver stop;journalctl -xe
```

```bash
sudo chown -R puppet:puppet /etc/puppetlabs/
sudo systemctl enable puppetserver
ps -aux | grep -v grep | grep puppet
```

```bash
ls /etc/sysconfig/puppet*
ls /etc/puppetlabs/puppet/
find /etc/puppetlabs/ -type f
```

## Puppet Agent

```bash
service puppet status # restart
```

```bash
sudo /opt/puppetlabs/bin/puppet resource service puppet ensure=running enable=true
ps -aux | grep -v grep | grep puppet
```

## Puppet Communication

https://puppet.com/docs/puppet/5.3/quick_start_master_agent_communication.html
https://puppet.com/docs/puppet/5.3/config_file_main.html

- Modifying the /etc/hosts files
- Opening port 8140 on Puppet Master firewall
- Sign Certificates on Puppet Master

On Agent:
```bash
/opt/puppetlabs/bin/puppet agent --test
```

On Master:
```bash
sudo /opt/puppetlabs/bin/puppet cert sign|list --all
sudo touch /etc/puppetlabs/code/environments/production/manifests/site.pp
```

On Agent:
```bash
/opt/puppetlabs/bin/puppet agent --test
```

## Push a configuration

On Master:/etc/puppetlabs/code/environments/production/manifests/site.pp
```text
node '<agent>' {
  file {'/tmp/example-ip':
    ensure  => present,
    mode    => '0644',
    content => "Here is my Public IP Address: ${ipaddress_eth0}.\n",
  }
}
```

On Agent:
```bash
/opt/puppetlabs/bin/puppet agent --test
cat /tmp/example-ip
```
