# pull official base image
FROM node:10-alpine

# set work directory
WORKDIR /usr/src/app

# copy package.json and package-lock.json
COPY package*.json ./

# install dependencies
RUN npm install

# copy project
COPY . .

# start server
CMD [ "npm", "start" ]