FROM node:19.5.0-alpine

WORKDIR /user/src/app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "run", "dev"]