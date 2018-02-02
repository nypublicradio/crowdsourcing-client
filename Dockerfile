FROM node:8.7

RUN mkdir /code
WORKDIR /code

COPY package.json ./
COPY package-lock.json ./
RUN npm install --production

COPY . ./
CMD node fastboot
