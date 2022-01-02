FROM node:14-alpine as base
EXPOSE 3001
WORKDIR /src
COPY package*.json ./

RUN npm install && npm run build
COPY . ./
CMD ["npm", "run", "start:prod"]
