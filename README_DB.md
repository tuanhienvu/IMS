# using Podman instead of docker
 first step is to install podman from
 https://podman.io/

# DB installation
  pull docker postgres db image from docker to Podman by bellow command: (latest version)

      podman pull docker.io/library/postgres

# config db in .env file
  DATABASE_URL=postgresql://user:pass@localhost:5432/dbname
  DATABASE_URL=postgresql://postgres:postgres@localhost:5432/postgres
# run migration
- generate migration code
npx drizzle-kit generate
- apply migration to db
npx drizzle-kit migrate

# create custom sql script to insert data
npx drizzle-kit generate --custom

# to start with db agency on mysql
npx drizzle-kit migrate

then open file migration_agency/0001_should_run_this_mannually.sql to execute insert data manually

# update schema db retail
npx drizzle-kit pull --config=drizzle-mysql.config.ts

copy content mysql/schema.ts
to model/schemaIcc.ts

change giaodichNew --> retailOrders

