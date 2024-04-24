export async function up(knex) {
  await knex.raw(`
    CREATE TABLE "EmailVerification"
    (
      "id"             SERIAL                         NOT NULL PRIMARY KEY,
      "verificationId" UUID                           NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
      "email"          VARCHAR(255)                   NOT NULL,
      "createdAt"      TIMESTAMP(3) WITHOUT TIME ZONE NOT NULL,
      "expireAt"       TIMESTAMP(3) WITHOUT TIME ZONE NOT NULL,
      "isVerified"     BOOLEAN                        NOT NULL
    );
  `)
}

export async function down(knex) {
  await knex.raw(`
    DROP TABLE "EmailVerification";
  `)
}
