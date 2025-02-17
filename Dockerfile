FROM node:18.18.0-alpine

WORKDIR /user/src/app

COPY package*.json ./
RUN npm install

COPY . .

COPY db-backups/backup.dump /docker-entrypoint-initdb.d/backup.dump

EXPOSE 5000

CMD ["npm", "run", "dev"]
