APPLE SHOP. USE POSTGRES DB, 

THIS PROJECT USED AWS S3... add you settings.
JWT-Cookie save.





docker settings:
version: "3.9"

services:
  db:
    container_name: 
    image: postgres:14-alpine
    restart: always
    environment: 
      - POSTGRES_DB=
      - POSTGRES_USER=
      - POSTGRES_PASSWORD=
    volumes:
      - ./pgdata:/var/lib/postgresql/data
    ports:
      - ${}:${}

  pgadmin:
    container_name: pgadmin
    image: dpage/pgadmin4
    environment:
      - PGADMIN_DEFAULT_EMAIL=${}
      - PGADMIN_DEFAULT_PASSWORD=${}
    ports:
    - "5050:80"