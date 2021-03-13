module.exports = {

  development: {
    client: 'pg',
    connection: {
	    host: 'localhost',
	    user: 'postgres',
	    password: '123456',
      database: 'adretiro'
    },
    // connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: './src/database/migrations'
    }, 
    seeds: {
      directory: './src/database/seeds'
    }
  },

  staging: {},

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL + "?ssl=true",
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: './src/database/migrations'
    }, 
    seeds: {
      directory: './src/database/seeds'
    }
  }

};
