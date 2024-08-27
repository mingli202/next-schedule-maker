ARG NODE_VERSION=21.1.0

FROM node:${NODE_VERSION}-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

# Run the application.
CMD [ "npm", "run", "dev" ]
