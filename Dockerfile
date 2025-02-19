FROM node:16

WORKDIR /user/src/app

COPY package*.json ./
RUN npm install

COPY . .

COPY db-backups/postgresql_sheerpeace_backup.tar /docker-entrypoint-initdb.d/postgresql_sheerpeace_backup.tar

COPY db-backups/postgres_roles.sql /docker-entrypoint-initdb.d/postgres_roles.sql

EXPOSE 5000

CMD ["npm", "run", "dev"]