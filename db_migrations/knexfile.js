require("dotenv").config({ path: "../.env" })

module.exports = {
  client: process.env.DB_CLIENT,
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_CONNECTION_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_CONNECTION_DATABASE,
  },
  migrations: {
    directory: "./migrations",
    stub: "./migration.stub",
  },
}
