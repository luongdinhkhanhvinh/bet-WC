FROM node:18.12.1-slim
RUN apt-get update && apt-get install -y postgresql-client

WORKDIR /app

COPY package.json /app
COPY package-lock.json /app
RUN npm install

COPY . /app

ENV NODE_ENV development
ENV TRUST_PROXY 1
RUN npm start