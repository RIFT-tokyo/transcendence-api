FROM node:16.13

WORKDIR /app

COPY package.json /app/package.json
RUN yarn install
