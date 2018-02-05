FROM node:8.7

RUN mkdir /code
WORKDIR /code

COPY package.json ./
COPY package-lock.json ./
RUN npm install --production

COPY . ./

RUN apt-get update && apt-get install -y unzip

CMD node fastboot
