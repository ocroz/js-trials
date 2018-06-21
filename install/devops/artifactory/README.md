# Install a Linux VM on Windows to host Artifactory

## Network configuration

[Optional] Setup DockerNAT and nat again:<br/>
https://docs.microsoft.com/en-us/virtualization/hyper-v-on-windows/user-guide/setup-nat-network

Add another VM in Hyper-V:

STEP1: Create a new External Network Switch.
- Hyper-V > `Virtual Switch Manager` > Select `External` then `Create Virtual Switch`.
- Select the virtual network AND +disable+ `virtual LAN identification for management operating system`.

STEP2: **REBOOT Windows 10** to apply the new network settings.

STEP3: Configure the VM to use the new External Network Switch.

Hyper-V > Select the VM > Select `Settings`:
- `Security` > +disable+ `Secure Boot`.
- `Network Adapter` > Select the new virtual switch.

## Linux VM installation

CentOS 7 installation:

See https://www.tenforums.com/tutorials/2291-hyper-v-vm-install-centos-linux-windows-10-a.html
- Minimal installation
- User artifactory is not an administrator
- Activate network: https://lintut.com/how-to-setup-network-after-rhelcentos-7-minimal-installation/

## Yum repository server

https://serverfault.com/questions/278711/how-to-create-a-yum-repository
