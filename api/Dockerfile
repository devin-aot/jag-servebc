# base image
#FROM docker-remote.artifacts.developer.gov.bc.ca/node:12.4.0-alpine as build-stage
FROM node:14.17.0-alpine as build-stage

# set working directory
WORKDIR /api

# add `/api/node_modules/.bin` to $PATH
ENV PATH /api/node_modules/.bin:$PATH

COPY . /api/

RUN apk update && apk add busybox-extras

RUN wget https://download.microsoft.com/download/e/4/e/e4e67866-dffd-428c-aac7-8d28ddafb39b/msodbcsql17_17.9.1.1-1_amd64.apk
RUN wget https://download.microsoft.com/download/e/4/e/e4e67866-dffd-428c-aac7-8d28ddafb39b/mssql-tools_17.9.1.1-1_amd64.apk
RUN apk add --allow-untrusted msodbcsql17_17.9.1.1-1_amd64.apk
RUN apk add --allow-untrusted mssql-tools_17.9.1.1-1_amd64.apk

#Install curl
RUN apk update && apk add curl

RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" && \
    unzip ./awscliv2.zip && \
    rm -f ./awscliv2.zip && \
    ./aws/install -i /usr/local/aws -b /bin && \
    rm -rf ./aws

RUN apk add unixodbc-dev

RUN npm install

RUN node src/sqlite-example-database/setup.js

EXPOSE 3003:3003
CMD ["npm", "run", "start"]
