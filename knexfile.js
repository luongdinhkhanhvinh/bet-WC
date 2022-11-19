module.exports = {
  development: {
    client: "postgresql",
    connection: {
      host:
        process.env.PGHOST ||
        "db-postgresql-sgp1-42824-do-user-12916083-0.b.db.ondigitalocean.com",
      port: process.env.PGPORT || 25060,
      database: "cup2022",
      user: "doadmin",
      password: "AVNS_w6o_w8PBxYdl3Wo8SMK",
      application_name: "knex-development",
      ssl: {
        rejectUnauthorized: false,
      },
      connectTimeout: 90000,
    },
    // migrations: {
    //   tableName: "knex_migrations",
    // },
    debug: true,
    asyncStackTraces: true,
    pool: {
      // See here for all config options:
      // https://github.com/vincit/tarn.js/

      min: 0,
      max: 100,

      // acquire promises are rejected after this many milliseconds
      // if a resource cannot be acquired
      acquireTimeoutMillis: 30000,

      // create operations are cancelled after this many milliseconds
      // if a resource cannot be acquired
      createTimeoutMillis: 30000,

      // If true, when a create fails, the first pending acquire is
      // rejected with the error. If this is false (the default) then
      // create is retried until acquireTimeoutMillis milliseconds has
      // passed.
      propagateCreateError: false,
    },
  },
  production: {
    client: "postgresql",
    connection: {
      host:
        process.env.PGHOST ||
        "db-postgresql-sgp1-42824-do-user-12916083-0.b.db.ondigitalocean.com",
      port: process.env.PGPORT || 25060,
      database: process.env.PGDATABASE || "cup2022",
      user: process.env.PGUSER || "doadmin",
      password: process.env.PGPASSWORD || "AVNS_w6o_w8PBxYdl3Wo8SMK",
      application_name: "knex-production",
      ssl: {
        rejectUnauthorized: false,
      },
      connectTimeout: 90000,
    },
    pool: {
      // See here for all config options:
      // https://github.com/vincit/tarn.js/

      min: 2,
      max: 10,

      // acquire promises are rejected after this many milliseconds
      // if a resource cannot be acquired
      acquireTimeoutMillis: 30000,

      // create operations are cancelled after this many milliseconds
      // if a resource cannot be acquired
      createTimeoutMillis: 30000,

      // If true, when a create fails, the first pending acquire is
      // rejected with the error. If this is false (the default) then
      // create is retried until acquireTimeoutMillis milliseconds has
      // passed.
      propagateCreateError: false,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },
};
