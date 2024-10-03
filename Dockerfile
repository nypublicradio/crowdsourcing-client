FROM node:8

RUN echo "deb http://archive.debian.org/debian stretch main" > /etc/apt/sources.list
RUN apt-get update && apt-get install -y unzip

RUN mkdir /code
WORKDIR /code

COPY package.json ./
COPY package-lock.json ./
RUN npm install --production

COPY . ./

CMD node fastboot
