FROM node:16.13

WORKDIR /app

RUN apt update
RUN apt install -y postgresql postgresql-contrib

COPY package.json /app/package.json
ADD yarn.lock /app/

RUN yarn install
