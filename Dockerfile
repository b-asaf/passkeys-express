FROM node:19

# Docker containers run on Linux:
# 1. The app will live in /usr/src directory of the Linux system
# 2. The name of the project is: app
WORKDIR /usr/src/app

CMD ["npx", "nodemon", "index.js"]

# copy package.json from the HOST inside the Docker container
COPY package*.json /usr/src/app/

# Install the packages
RUN npm install

COPY . /usr/src/app/