import dotenv from "dotenv"
dotenv.config({path: "../.env"})

export default {
  client: "pg",
  connection: process.env.DATABASE_URL,
  migrations: {
    directory: "./migrations",
    stub: "./migration.stub",
  },
}
