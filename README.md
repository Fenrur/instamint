# Instamint

<!-- TOC -->
* [Instamint](#instamint)
  * [📘 Preamble](#-preamble)
    * [📢 Presentation](#-presentation)
    * [📚 Objectives](#-objectives)
  * [🛠 Technologies](#-technologies)
    * [🖥️ Technical Stack](#-technical-stack)
      * [TypeScript](#typescript)
      * [Next.js](#nextjs)
      * [Tailwind CSS](#tailwind-css)
      * [Shadcn](#shadcn)
      * [PostgresSQL](#postgressql)
      * [DrizzleORM](#drizzleorm)
      * [Auth.js](#authjs)
      * [Vercel](#vercel)
      * [Minio](#minio)
  * [🚀 Initialization](#-initialization)
    * [🔑 Prerequisites](#-prerequisites)
    * [⚙️ Environment Variables](#-environment-variables)
      * [🗄️ Database Configuration](#-database-configuration)
      * [📧 Email Sending Configuration](#-email-sending-configuration)
      * [🔐 Password Hashing Secret Configuration](#-password-hashing-secret-configuration)
        * [🔑 Generating the Secret](#-generating-the-secret)
      * [🔒 Token Encryption Secret Configuration](#-token-encryption-secret-configuration)
        * [🔑 Generating the Secret](#-generating-the-secret-1)
      * [🍪 Cookie Security Configuration](#-cookie-security-configuration)
      * [🔑 TOTP Encryption Key Configuration](#-totp-encryption-key-configuration)
        * [🔑 Generating the Key](#-generating-the-key)
      * [🌐 Base URL Configuration](#-base-url-configuration)
      * [📧 Contact Email Configuration](#-contact-email-configuration)
    * [🔓 Next public publishable key configuration](#-next-public-publishable-key-configuration)
    * [🔓 Next public test data key configuration](#-next-public-test-data-key-configuration)
    * [🤝 Next trust host configuration](#-next-trust-host-configuration)
    * [🐦 Minio](#-minio)
      * [👜 Minio Bucket](#-minio-bucket)
      * [🔑 Minio access keys](#-minio-access-keys)
      * [🌐 Minio Region](#-minio-region)
      * [📍 Minio endpoint](#-minio-endpoint)
    * [📦 Installation](#-installation)
  * [🎬 Startup](#-startup)
    * [🗄️ Database](#-database)
    * [🖥️ Development Server](#-development-server)
    * [🏭 Production Server](#-production-server)
    * [🚀 Migrations](#-migrations)
  * [📊 Dataset](#-dataset)
  * [Tests](#tests)
    * [Unit Tests](#unit-tests)
    * [Integration Tests](#integration-tests)
    * [E2E Tests](#e2e-tests)
<!-- TOC -->

## 📘 Preamble

### 📢 Presentation

This project is undertaken for educational purposes. It aims to apply the skills learned during our developer training at Sup de Vinci.

It is supervised by our instructor, [Avétis KAZARIAN](https://www.linkedin.com/in/avetisk/), to whom we are grateful for his guidance and valuable advice.

### 📚 Objectives

The study project aims to create a complete professional experience for each apprentice, covering all the key skills studied in class through concrete practical application, in groups, in an environment as close to professional reality as possible, by implementing the requirements and constraints of a company in its natural production cycle using agile methods. It allows apprentices to compensate for the possible absence of practical application of some skills in their company by providing them the opportunity to apply them in the project study context, with the necessary supervision and follow-up for their assimilation, covering all the topics addressed over the year.

The focus is not only on pure programming skills but on the entire process from idea to product, that is, from the call for tenders to the final delivery. It is indeed necessary to include here all the non-technical aspects that are so essential to the development of a project. Thus, apprentices will be forced, as in the professional world, to use their technical skills as well as their soft skills for the complete success of the project, without neglecting to critically examine the impact of their choices on the environment and their sustainability.

## 🛠 Technologies

### 🖥️ Technical Stack

#### [TypeScript](https://www.typescriptlang.org/)

TypeScript is a superset of JavaScript that adds optional static typing features to the language. It is designed for developing large-scale applications and transcompiles to JavaScript.

This choice was made for several reasons:
- Static typing helps detect errors during compilation rather than at runtime;
- Enhances code readability;
- Improves code understanding;
- Better code maintenance;
- Facilitates teamwork.

#### [Next.js](https://nextjs.org/)

Next.js is an open-source web framework for backend and frontend development with React. It offers features such as server-side rendering and static site generation for React-based websites.

This choice was made for several reasons:
- Enables creating an application in the same environment for both backend and frontend;
- Server-side rendering for public parts improves SEO;
- Choice between server-side rendering and client-side rendering;
- Built-in internationalization;
- TypeScript support;
- Rich ecosystem.

#### [Tailwind CSS](https://tailwindcss.com/)

Tailwind CSS is a CSS framework that allows for custom designs without ever leaving the HTML file. It is based on a component design approach and utility classes.

This choice was made for several reasons:
- Eases component creation;
- Simplifies code maintenance;
- Facilitates teamwork.

#### [Shadcn](https://ui.shadcn.com/)

Beautifully designed components, based on Tailwind CSS for component styling.

This choice was made for several reasons:
- Extensive component library;
- Facilitates style changes as needed.

#### [PostgresSQL](https://www.postgresql.org/)

PostgreSQL is a free and open-source relational database known for its reliability and robustness.

This choice was made for several reasons:
- Relational database;
- Open-source and free;
- ACID compliance;
- SQL standards support;
- Performance and reliability;
- Security;
- Wide range of data types compared to other databases.

#### [DrizzleORM](https://orm.drizzle.team/)

Drizzle is an ORM (Object-Relational Mapping) for TypeScript. It allows for manipulating database data while maintaining SQL syntax.

Drizzle is lightweight, performant, typesafe, non-lactose, gluten-free, sober, and flexible by design.

This choice was made for several reasons:
- Eases data manipulation;
- SQL syntax;
- Typesafe;
- Performant;
- Flexible;
- Facilitates joins.

#### [Auth.js](https://authjs.dev/)

Auth.js is an authentication library. It manages user authentication.

It can use various authentication strategies, such as JWT tokens, cookies, etc.

Also different authentication protocols, such as OAuth2, OpenID Connect, etc.

This choice was made primarily for the following reason:
- Facilitates authentication.

In our case, we use the JWT strategy, using cookies, without a third-party provider connection.

#### [Vercel](https://vercel.com)

Vercel is a web deployment platform. It allows deploying applications such as Next.js, React, Angular, Vue, etc.

Vercel connects to our GitHub repository and triggers a deployment on every push.

This choice was made for several reasons:
- Facilitates deployment;
- Eases environment management;
- Eases domain management.

#### [Minio](https://min.io/)

Minio is an object storage designed for storing a large amount of datas.

This choice was made for several reasons:
  - Scalability;
  - Open source;
  - High performances;
  - Security.

## 🚀 Initialization

### 🔑 Prerequisites

- Node.js version v20.12 (in the path)
- Docker (in the path)

### ⚙️ Environment Variables

You can create a `.env` file at

the root of the project to define the environment variables, or you can set them directly in your environment.

```dotenv
DATABASE_URL=""
GMAIL_EMAIL=""
GMAIL_PASS=""
PEPPER_PASSWORD_SECRET=""
NEXT_AUTH_SECRET=""
SECURE_AUTH_COOKIES=""
TOTP_ENCRYPTION_KEY=""
BASE_URL=""
CONTACT_EMAIL=""

DATABASE_URL="
GMAIL_EMAIL=""
GMAIL_PASS=""
PEPPER_PASSWORD_SECRET=""
NEXT_AUTH_SECRET=""
SECURE_AUTH_COOKIES=""
TOTP_ENCRYPTION_KEY=""
BASE_URL=""
CONTACT_EMAIL=""
NEXT_PUBLIC_PUBLISHABLE_KEY=""
NEXT_PUBLIC_TEST_DATA=""
TRUST_HOST=""
S3_BUCKET_NAME=""
S3_ACCESS_KEY_ID=""
S3_SECRET_ACCESS_KEY=""
S3_REGION=""
S3_ENDPOINT=""
```

#### 🗄️ Database Configuration

Example configuration for a PostgreSQL database:

```dotenv
DATABASE_URL="postgresql://user:password@localhost:5432/database"
```

Refer to the [PostgreSQL](https://www.postgresql.org/docs/current/libpq-connect.html) documentation for more information on the connection URL schema.

#### 📧 Email Sending Configuration

Example configuration for sending email with Gmail:

```dotenv
GMAIL_EMAIL="instamint.noreply@gmail.com"
GMAIL_PASS="adqs refq geac oefg"
```

`GMAIL_EMAIL` is the sender's email address.
`GMAIL_PASS` is the application password.

> 🚨 For security reasons, it is recommended to create an application password for email sending.

For more information, you can consult the [Google](https://support.google.com/accounts/answer/185833?hl=en) documentation.

#### 🔐 Password Hashing Secret Configuration

Example configuration for the password encryption secret:

```dotenv
PEPPER_PASSWORD_SECRET="xbHTJXqZe2MzqjfBkNJUB2dk11eCut5K7IGOIQOEHvA="
```

`PEPPER_PASSWORD_SECRET` is intended to secure passwords that are stored in the database.

##### 🔑 Generating the Secret

You can generate a secret with the following command:

```bash
openssl rand -base64 32
```

#### 🔒 Token Encryption Secret Configuration

Example configuration for the token encryption secret:

```dotenv
NEXT_AUTH_SECRET="qfU8rXFxpv79amTEFKPTWLC9pF276wWDGqrHRZ+oOA8="
```

`NEXT_AUTH_SECRET` is intended to secure the tokens stored in cookies.

##### 🔑 Generating the Secret

You can generate a secret with the following command:

```bash
openssl rand -base64 32
```

#### 🍪 Cookie Security Configuration

Example configuration for cookie security:

```dotenv
SECURE_AUTH_COOKIES="true"
```

`SECURE_AUTH_COOKIES` is a boolean that secures cookies.

For more information, you can consult the [MDN](https://developer.mozilla.org/en/docs/Web/HTTP/Cookies) documentation.

Generally, it is recommended to set this variable to `true` in production.

#### 🔑 TOTP Encryption Key Configuration

Example configuration for the TOTP encryption key:

```dotenv
TOTP_ENCRYPTION_KEY="u6Y7RMVib/s73+L8Jegn2QggNQZQbVYtiVPBDxPrztg="
```

It secures the TOTP tokens stored in the database.

##### 🔑 Generating the Key

You can generate a key with the following command:

```bash
openssl rand -base64 32
```

#### 🌐 Base URL Configuration

Example configuration for the base URL:

```dotenv
BASE_URL="http://localhost:3000"
```

`BASE_URL` is the base URL of the application. Be careful, it must match the server at its execution.

#### 📧 Contact Email Configuration

Example configuration for the contact email:

```dotenv
CONTACT_EMAIL="instamint.contact@gmail.com"
```

`CONTACT_EMAIL` is the contact email address.

### 🔓 Next public publishable key configuration

Can fill with whatever you want (ensure it is strong)

Example configuration:

```dotenv
NEXT_PUBLIC_PUBLISHABLE_KEY="Fd0SqICWjYszy4q"
```

### 🔓 Next public test data key configuration

Can fill with whatever you want (ensure it is strong)

Example configuration:

```dotenv
NEXT_PUBLIC_TEST_DATA="lklVNuqZBkMn9Qy"
```

### 🤝 Next trust host configuration

Example configuration for the trusted host:

```dotenv
TRUST_HOST="false"
```

### 🐦 Minio

Default docker compose settings will launch the minio buckets on http://localhost:8900

Default username and password settings are "instamint"

You can change he settings in the docker-compose.yaml file

![img.png](readme_imgs/minio.png)

#### 👜 Minio Bucket

You must first create a bucket

![img.png](readme_imgs/minio_create_bucket.png)

Then name your bucket and create it

![img.png](readme_imgs/create_bucket_name.png)

this will be your S3_BUCKET_NAME (you can replace with whatever name you want)

```dotenv
S3_BUCKET_NAME="instamint"
```

#### 🔑 Minio access keys

Go to access keys and select create access key

![img.png](readme_imgs/access_key.png)

The S3_ACCESS_KEY_ID will be the Access Key (Here o9l05L83ewpaEIwBVHnb)

```dotenv
S3_ACCESS_KEY_ID="o9l05L83ewpaEIwBVHnb"
```

Use the Secret Key for S3_SECRET_ACCESS_KEY (replace with yours)

```dotenv
S3_SECRET_ACCESS_KEY="S3_SECRET_ACCESS_KEY="zC0akw3NlBlzuNtxNyselr3sm5av8CmmhzGNNdSM""
```

Add a name, description ad a comment if you want, then select create

![img.png](readme_imgs/create_access_key.png)

#### 🌐 Minio Region

For france you should ue the next settings

```dotenv
S3_REGION="eu-east-1"
```

#### 📍 Minio endpoint

The default endpoint port is 9000 (it can be replace in the docker-compose.yaml file)

```dotenv
S3_ENDPOINT="http://localhost:9000"
```

### 📦 Installation

- Clone the repository

```bash
git clone https://github.com/Fenrur/instamint.git
```

- Install dependencies

```bash
npm install --legacy-peer-deps
```

## 🎬 Startup

### 🗄️ Database

Start the database:

```bash
docker-compose up -d
```

Values can be modified in the [docker-compose.yaml](docker-compose.yaml) file.

Default values are:

- `USER`: `instamint`
- `PASSWORD`: `instamint`
- `DATABASE`: `instamint`

### 🖥️ Development Server

Start the development server:

```bash
npm run dev
```

### 🏭 Production Server

Start the production server:

```bash
npm run build && npm start
```

### 🚀 Migrations

To run migrations:

```bash
npm run migrate
```

To rollback migrations:

```bash
npm run rollback
```

## 📊 Dataset

The dataset is available in the [dataset.sql](dataset.sql) file.

> 🚨 For it to work, you must have the same values for the environment variables.

Here are the environment variables used for the dataset:

```dotenv
PEPPER_PASSWORD_SECRET="GA5mG3yU8ulHsdRBc7OhbinYuyBd54RGLnxbQnswAgQ="
TOTP_ENCRYPTION_KEY="QiFAlean+1ueZ7y/HmLgs7cLP52hdjJ4oipZQZK1olQ="
```

##  Tests

### Unit Tests

To run unit tests, use the following command:

```bash
npm run test:unit
```

### Integration Tests

To run integration tests, use the following command:

```bash
npm run test:integration
```

### E2E Tests

To run E2E tests, use the following command:

```bash
npm run test:e2e
```
