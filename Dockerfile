FROM node:16

WORKDIR /user/src/app

COPY package*.json ./
RUN npm install

COPY . .

# Copy the backup files to a temporary location in the container
COPY db-backups/postgresql_sheerpeace_backup.tar /tmp/postgresql_sheerpeace_backup.tar
COPY db-backups/postgres_roles.sql /tmp/postgres_roles.sql

# Copy the backup files to the /db-backups folder in the root of the application
RUN mkdir -p /db-backups && \
    cp /tmp/postgresql_sheerpeace_backup.tar /db-backups/postgresql_sheerpeace_backup.tar && \
    cp /tmp/postgres_roles.sql /db-backups/postgres_roles.sql

EXPOSE 5000

CMD ["npm", "run", "dev"]