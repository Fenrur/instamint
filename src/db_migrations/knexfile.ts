import dotenv from "dotenv"
dotenv.config({path: "../../.env"})

export default {
  client: process.env.DB_CLIENT,
  connection: process.env.DATABASE_URL,
  migrations: {
    directory: "./migrations",
    stub: "./migration.stub",
  },
}
