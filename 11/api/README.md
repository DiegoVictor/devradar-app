# Install
```
$ yarn
```
> Was installed and configured the `eslint` and `prettier` to keep the code clean and patterned.

# Databases
The application use just one database: SQLite. For more information to how to setup your database see:
* [knexfile.js](http://knexjs.org/#knexfile)
> You can find the application's `knexfile.js` file in the root folder.

## Migrations
Remember to run the migrations:
```
$ npx knex migrate:latest
```
> See more on [Migrations](http://knexjs.org/#Migrations).

# .env
Rename the `.env.example` to `.env` then just update with yours settings.
> The knex configuration used rely on the `APP_ENV` configurated.

# Start Up
```
$ yarn dev
```

# Insomnia
In the root directory you can find an [Insomnia](https://insomnia.rest/) file, it has some useful requests to configure and test the app. Or click below:

<a href="https://insomnia.rest/run/?label=OmniStack11&uri=https%3A%2F%2Fraw.githubusercontent.com%2FDiegoVictor%2Fomnistack%2Fmaster%2F11%2Fapi%2FInsomnia_2020-03-24.json" target="_blank"><img src="https://insomnia.rest/images/run.svg" alt="Run in Insomnia"></a>
