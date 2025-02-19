FROM node:18.18.0-alpine

WORKDIR /user/src/app

COPY package*.json ./
RUN npm install

COPY . .

# Copy the PostgreSQL backup file to the container
COPY db-backups/postgresql_sheerpeace_backup.tar /docker-entrypoint-initdb.d/postgresql_sheerpeace_backup.tar

EXPOSE 5000

CMD ["npm", "run", "dev"]