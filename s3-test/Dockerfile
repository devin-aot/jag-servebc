FROM ubuntu:latest

# Create a user for each AWS account
# For each user, copy home directory files from folder with same name as
# the user
RUN sudo adduser --disabled-password --gecos '' dev
RUN sudo adduser dev sudo
RUN mkdir /home/dev/.aws
ADD home/dev/* /home/dev/.aws/
RUN sudo chmod 600 /home/dev/.aws/*
RUN sudo chown -R dev:dev /home/dev/.aws
RUN sudo adduser --disabled-password --gecos '' psndx
RUN sudo adduser psndx sudo
RUN mkdir /home/psndx/.aws
ADD home/psndx/* /home/psndx/.aws/
RUN sudo chmod 600 /home/psndx/.aws/*
RUN sudo chown -R psndx:psndx /home/psndx/.aws
# Give sudo access to the accounts
RUN sudo echo '%sudo ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers
# Run as root initially...
USER root
# ...but immediately su to the username passed as an argument
ENTRYPOINT ["/bin/su", "--login"]
# Default user
CMD ["dev"]
# Set up the Ubuntu instance correctly
RUN sudo apt-get update
RUN sudo apt-get -y upgrade
RUN sudo apt-get -y install python
RUN sudo apt-get -y install groff
RUN sudo apt-get -y install curl
RUN sudo apt-get -y install man
# Install pip
RUN cd /tmp
RUN sudo curl -O https://bootstrap.pypa.io/get-pip.py
RUN sudo python get-pip.py
RUN sudo rm get-pip.py
RUN cd
RUN sudo pip install awscli
ENTRYPOINT ["tail", "-f", "/dev/null"]
# That's it - all done


