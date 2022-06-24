# adretiro-api

[![GitHub license](https://img.shields.io/github/license/alcalcides/adretiro)](https://github.com/alcalcides/adretiro/blob/master/LICENSE)

🚧 Under construction 🚧

This API RESTful is to server the app [adretiro](https://github.com/alcalcides/adretiro) that is like a sticker album. The complete project description is explained in [adretiro's README file](https://github.com/alcalcides/adretiro/blob/master/README.md)

## Development environment

This project is a NodeJS app with the API framework Express. So, to run locally, follow these steps:

1. Clone the project from github

2. Set environment variables according to .env.example

    ```shell
    $ cp .env.example .env
    $ vim .env
    ```

3. Database setup

    ### Database Setup

    1. Install Postgres your way, but think about version compatibility
    2. Access sql bash
    3. Create a database named 'adretiro'
    4. Set a password for development environment. To keep simple, '123456' works fines, don't worry, but if you need a more secure one, keep in mind altering ./knexfile.js
    5. Run knex script to create tables and feed them
        ```shell
        $ yarn knex migrate:latest
        $ yarn knex seed:run
        ```
    6. Run special JS script to feed the table 'stickers'
        ```shell
        $ yarn fill-table-stickers
        ```

4. Run the application

    ```shell
    yarn
    yarn dev
    ```

5. Create a contributor admin using POST {{url}}/contributors. You can use the [front end](https://github.com/alcalcides/adretiro) application running locally or the app Postman. Be aware the people id created regard to the contributor. If you are correct in this tutorial, the id will be exactly 1.

6. Insert the new contributor in the table 'managers' commanding 'INSERT' directly in SQL terminal. Keep in mind you need use the id of the table 'people', already fed when the contributor was created. If you are correct in this tutorial, the id will be exactly 1.

    ```sql
    INSERT INTO managers (id, fk_people, created_at, updated_at) VALUES (DEFAULT, @PEOPLE_ID, CLOCK_TIMESTAMP(), CLOCK_TIMESTAMP());
    ```

7. Enjoy

### Reset the database

1) Drop all tables 

```
yarn knex migrate:rollback
```

2) Go to step 5 of section [Set up database](#database-setup)

#### Database first setup report

This projetct used [Postgres](https://www.postgresql.org/) and [knex.js](https://knexjs.org/). The following describes how it was done the first time.

1) Install Postgres.
2) Install knex and postgres driver.

```shell
$ npm install knex -g
~ npm install pg
~ knex init
```

3) Set up knexfile.js ([see the result](https://github.com/alcalcides/adretiro-api/blob/master/knexfile.js)).
4) Implement migration to create table "Jacob's Sons":

```shell
~ knex migrate:make jacobs_sons
```

Code migration script and run:

```shell
~ knex migrate:latest
```

To perform migration in heroku environment, you can run locally:

```shell
~ heroku run knex migrate:latest
```

5) See the table created in database. If you prefer GUI, be free to use [PgAdmin4](https://www.pgadmin.org).

6) Feed convenient tables with knex's feature seed. First set up the seed directory in knexfile and so: 

```shell
~ knex seed:make 001_fill_jacobs_sons
```

Code the seed script and run:

```shell
~ knex seed:run 001_fill_jacobs_sons
```

If you want run all seeds, use:

```shell
~ knex seed:run
```

7) Set up knex queries features. Consider the file src/database/connection.js and import knex like in src/controllers/JacobsSonsControllers.js (see function read)

8) Set up environments variables according with file .env.example. If Heroku, use:

```shell
~ heroku config:set PASSWORD_ENCRYPTION_ROUNDS=XXXX
~ heroku config:set JWT_PRIVATE_KEY=XXXX
~ heroku config:set MAIL_USER=XXXX
~ heroku config:set MAIL_PASSWORD=XXXX
```

9) Build the main table (stickers):

```shel 
~ npm run fill-table-stickers
```
This table is to be build only once in the program lifecycle. Be careful, keep a backup and avoid problems....

10) Finally, enjoy!
