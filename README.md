## Getting Started

### Install dependencies

Use `npm i` to install dependencies of the app

### Build app

Use `npm run build` to build the app and start working with it

### Configuration of .env file

Create a .env file and fill it with those variables :

```
DATABASE_URL = <url of the database>
```

## Initializing the database (PostgresQL)

### Migrations
go to the migration directory

```bash
cd ./src/db_migrations
```

to apply migration and load the database, use

```bash
npx knex migrate:latest
```

to remove the migration and the database content, use

```bash
npx knex migrate:rollback
```

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
