FROM node:8

RUN mkdir /code
WORKDIR /code

COPY package.json ./
COPY package-lock.json ./
RUN npm install --production

COPY . ./

RUN apt-get update

CMD node fastboot
