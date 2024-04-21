export async function up(knex) {
  await knex.raw(`CREATE OR REPLACE FUNCTION check_hashtags(hashtags VARCHAR[])
  RETURNS BOOLEAN AS
  $$
  DECLARE
  hashtag VARCHAR;
  BEGIN
  FOREACH hashtag IN ARRAY hashtags
    LOOP
      IF NOT (hashtag ~* '^[a-zA-Z0-9_]{3,255}$') THEN
        RETURN false;
      END IF;
    END LOOP;
  RETURN true;
  END;
  $$ LANGUAGE plpgsql;`)
  await knex.raw(`DROP TYPE IF EXISTS "LanguageType", "UserRole", "ProfileVisibilityType", "CurrencyType",
   "UserTeaBagRole", "NotificationType";`)
  await knex.raw(`CREATE TYPE "NotificationType" AS ENUM ('replies_comments', 'thread_comment', 'mint', 'follow',
   'follow_request_accepted');`)
  await knex.schema

    .createTable("Profile", (table) => {
      table.increments("id")
      table.string("username", "18").unique().notNullable().checkRegex("^[a-zA-Z0-9_]{3,18}$")
      table.timestamp("createdAt", { useTz: false }, { precision: 3 }).notNullable()
      table.string("bio").notNullable().defaultTo("")
      table.string("link")
      table.string("avatarUrl").notNullable()
      table.boolean("canBeSearched").notNullable().defaultTo(true)
      table.enu("visibilityType", ["public", "private"]).notNullable().defaultTo("public")
      table.text("location")
      table.string("displayName", "40").notNullable()
    })
    .createTable("User", (table) => {
      table.increments("id")
      table.string("email").notNullable().unique()
      table.uuid("uid").notNullable().unique().defaultTo(knex.fn.uuid())
      table.string("hashedPassword").notNullable()
      table.boolean("isActivated").notNullable().defaultTo(false)
      table.boolean("twoFactorEnabled").notNullable().defaultTo(false)
      table.string("twoFactorSecret")
      table.string("phoneNumber", "20")
      table.enu("languageType", ["en", "fr", "es"]).notNullable().defaultTo("en")
      table.enu("role", ["user", "admin"]).notNullable().defaultTo("user")
      table.integer("profileId").unsigned().notNullable()
      table
        .foreign("profileId")
        .references("id")
        .inTable("Profile")
        .onDelete("CASCADE")
      table.specificType("enabledNotificationTypes", `"NotificationType"[] NOT NULL DEFAULT ARRAY [
    'replies_comments'::"NotificationType",
    'thread_comment'::"NotificationType",
    'mint'::"NotificationType",
    'follow'::"NotificationType",
    'follow_request_accepted'::"NotificationType"]`)
    })

    .createTable("TeaBag", (table) => {
      table.increments("id")
      table.integer("profileId").unsigned().notNullable()
      table
        .foreign("profileId")
        .references("id")
        .inTable("Profile")
        .onDelete("CASCADE")
    })
    .createTable("Nft", (table) => {
      table.increments("id")
      table.integer("ownerUserId").unsigned().notNullable()
      table
        .foreign("ownerUserId")
        .references("id")
        .inTable("User")
        .onDelete("CASCADE")
      table.integer("showOnProfileId").unsigned().notNullable()
      table
        .foreign("showOnProfileId")
        .references("id")
        .inTable("Profile")
        .onDelete("CASCADE")
      table.string("title").notNullable()
      table.text("description").notNullable().defaultTo("")
      table.text("location")
      table.double("price", "precision").notNullable()
      table.enu("currencyType", ["usd", "eur", "eth", "sol"]).notNullable()
      table.string("contentUrl").notNullable()
    })
    .createTable("Mint", (table) => {
      table.increments("id")
      table.integer("nftId").unsigned().notNullable()
      table
        .foreign("nftId")
        .references("id")
        .inTable("Nft")
        .onDelete("CASCADE")
      table.integer("userId").unsigned().notNullable()
      table
        .foreign("userId")
        .references("id")
        .inTable("User")
        .onDelete("CASCADE")
      table.timestamp("mintAt", { useTz: false }, { precision: 3 }).notNullable()
    })
    .createTable("HashtagNft", (table) => {
      table.increments("id")
      table.string("hashtag").notNullable().checkRegex("^[a-zA-Z0-9_]{3,255}$")
      table.integer("nftId").unsigned().notNullable()
      table
        .foreign("nftId")
        .references("id")
        .inTable("Nft")
        .onDelete("CASCADE")
    })
    .createTable("Comment", (table) => {
      table.increments("id")
      table.integer("nftId").unsigned().notNullable()
      table
        .foreign("nftId")
        .references("id")
        .inTable("Nft")
        .onDelete("CASCADE")
      table.integer("userId").unsigned().notNullable()
      table
        .foreign("userId")
        .references("id")
        .inTable("User")
        .onDelete("CASCADE")
      table.timestamp("commentedAt", { useTz: false }, { precision: 3 }).notNullable()
      table.string("commentary", "1000").notNullable()
      table.integer("replyCommentId").unsigned()
      table
        .foreign("replyCommentId")
        .references("id")
        .inTable("Comment")
        .onDelete("CASCADE")
    })
    .createTable("ReportComment", (table) => {
      table.increments("id")
      table.integer("reporterUserId").unsigned().notNullable()
      table
        .foreign("reporterUserId")
        .references("id")
        .inTable("User")
        .onDelete("CASCADE")
      table.integer("reportedCommentId").unsigned().notNullable()
      table
        .foreign("reportedCommentId")
        .references("id")
        .inTable("Comment")
        .onDelete("CASCADE")
      table.string("reason", "1000")
      table.timestamp("reportAt", { useTz: false }, { precision: 3 }).notNullable()
    })
    .createTable("ReportNft", (table) => {
      table.increments("id")
      table.integer("reporterUserId").unsigned().notNullable()
      table
        .foreign("reporterUserId")
        .references("id")
        .inTable("User")
        .onDelete("CASCADE")
      table.integer("reportedNftId").unsigned().notNullable()
      table
        .foreign("reportedNftId")
        .references("id")
        .inTable("Nft")
        .onDelete("CASCADE")
      table.string("reason", "1000")
      table.timestamp("reportAt", { useTz: false }, { precision: 3 }).notNullable()
    })
    .createTable("ReportUser", (table) => {
      table.increments("id")
      table.integer("reporterUserId").unsigned().notNullable()
      table
        .foreign("reporterUserId")
        .references("id")
        .inTable("User")
        .onDelete("CASCADE")
      table.integer("reportedUserId").unsigned().notNullable()
      table
        .foreign("reportedUserId")
        .references("id")
        .inTable("User")
        .onDelete("CASCADE")
      table.string("reason", "1000")
      table.timestamp("reportAt", { useTz: true }, { precision: 3 }).notNullable()
    })
    .createTable("WhiteList", (table) => {
      table.increments("id")
      table.timestamp("startAt", { useTz: false }, { precision: 3 }).notNullable()
      table.timestamp("endAt", { useTz: false }, { precision: 3 }).notNullable()
      table.integer("teaBagId").unsigned().notNullable()
      table
        .foreign("teaBagId")
        .references("id")
        .inTable("TeaBag")
        .onDelete("CASCADE")
    })
    .createTable("ViewProfile", (table) => {
      table.increments("id")
      table.integer("viewerUserId").unsigned().notNullable()
      table
        .foreign("viewerUserId")
        .references("id")
        .inTable("User")
        .onDelete("CASCADE")
      table.integer("viewedProfileId").unsigned().notNullable()
      table
        .foreign("viewedProfileId")
        .references("id")
        .inTable("User")
        .onDelete("CASCADE")
      table.timestamp("viewAt", { useTz: false }, { precision: 3 }).notNullable()
    })
    .createTable("ScheduleDeletionUser", (table) => {
      table.increments("id")
      table.integer("userId").unsigned().notNullable()
      table
        .foreign("userId")
        .references("id")
        .inTable("User")
        .onDelete("CASCADE")
      table.timestamp("scheduleAt", { useTz: true }, { precision: 3 }).notNullable()
      table.integer("byUserId").unsigned().notNullable()
      table
        .foreign("byUserId")
        .references("id")
        .inTable("ScheduleDeletionUser")
        .onDelete("CASCADE")
      table.string("reason", "1000")
    })
    .createTable("DraftNft", (table) => {
      table.increments("id")
      table.text("description")
      table.integer("ownerId").unsigned().notNullable()
      table
        .foreign("ownerId")
        .references("id")
        .inTable("User")
        .onDelete("CASCADE")
      table.specificType("hashtags", "VARCHAR(255)[5] NOT NULL CHECK (check_hashtags(\"hashtags\"))")
      table.text("location").notNullable()
    })
    .createTable("WhiteListUser", (table) => {
      table.increments("id")
      table.integer("whiteListId").unsigned().notNullable()
      table
        .foreign("whiteListId")
        .references("id")
        .inTable("WhiteList")
        .onDelete("CASCADE")
      table.integer("whiteListedUserId").unsigned().notNullable()
      table
        .foreign("whiteListedUserId")
        .references("id")
        .inTable("User")
        .onDelete("CASCADE")
    })
    .createTable("ViewNft", (table) => {
      table.increments("id")
      table.integer("userId").unsigned().notNullable()
      table
        .foreign("userId")
        .references("id")
        .inTable("User")
        .onDelete("CASCADE")
      table.integer("nftId").unsigned().notNullable()
      table
        .foreign("nftId")
        .references("id")
        .inTable("Nft")
        .onDelete("CASCADE")
      table.timestamp("viewAt", { useTz: false }, { precision: 3 }).notNullable()
    })
    .createTable("UserTeaBag", (table) => {
      table.increments("id")
      table.integer("userId").unsigned().notNullable()
      table
        .foreign("userId")
        .references("id")
        .inTable("User")
        .onDelete("CASCADE")
      table.integer("teaBagId").unsigned().notNullable()
      table
        .foreign("teaBagId")
        .references("id")
        .inTable("TeaBag")
        .onDelete("CASCADE")
      table.enu("role", ["user", "admin"]).notNullable().defaultTo("user")
    })
    .createTable("PrivateMessage", (table) => {
      table.increments("id")
      table.integer("fromUserId").unsigned().notNullable()
      table
        .foreign("fromUserId")
        .references("id")
        .inTable("User")
        .onDelete("CASCADE")
      table.integer("toUserId").unsigned().notNullable()
      table
        .foreign("toUserId")
        .references("id")
        .inTable("User")
        .onDelete("CASCADE")
      table.string("message", "1000").notNullable()
      table.integer("replyPrivateMessageId").unsigned()
      table
        .foreign("replyPrivateMessageId")
        .references("id")
        .inTable("PrivateMessage")
        .onDelete("CASCADE")
    })
    .createTable("Follow", (table) => {
      table.increments("id")
      table.integer("followerUserId").unsigned()
      table
        .foreign("followerUserId")
        .references("id")
        .inTable("User")
        .onDelete("CASCADE")
      table.integer("followedUserId").unsigned()
      table
        .foreign("followedUserId")
        .references("id")
        .inTable("User")
        .onDelete("CASCADE")
      table.timestamp("followAt", { useTz: false }, { precision: 3 }).notNullable()
    })
    .createTable("PasswordReset", (table) => {
      table.increments("id")
      table.uuid("resetId").notNullable().unique().defaultTo(knex.fn.uuid())
      table.integer("userId").unsigned()
      table
        .foreign("userId")
        .references("id")
        .inTable("User")
        .onDelete("CASCADE")
      table.timestamp("createdAt", { useTz: false }, { precision: 3 }).notNullable()
      table.timestamp("expireAt", { useTz: false }, { precision: 3 }).notNullable()
      table.boolean("active").notNullable()
    })
    .createTable("RequestFollow", (table) => {
      table.increments("id")
      table.integer("requestUserId").unsigned()
      table
        .foreign("requestUserId")
        .references("id")
        .inTable("User")
        .onDelete("CASCADE")
      table.integer("requestedUserId").unsigned()
      table
        .foreign("requestedUserId")
        .references("id")
        .inTable("User")
        .onDelete("CASCADE")
      table.timestamp("requestAt", { useTz: false }, { precision: 3 }).notNullable()
      table.boolean("isIgnored").notNullable().defaultTo(false)
    })
}

export async function down(knex) {
  await knex.schema
    .dropTable("RequestFollow")
    .dropTable("PasswordReset")
    .dropTable("Follow")
    .dropTable("PrivateMessage")
    .dropTable("UserTeaBag")
    .dropTable("ViewNft")
    .dropTable("WhiteListUser")
    .dropTable("DraftNft")
    .dropTable("ScheduleDeletionUser")
    .dropTable("ViewProfile")
    .dropTable("WhiteList")
    .dropTable("ReportUser")
    .dropTable("ReportNft")
    .dropTable("ReportComment")
    .dropTable("Comment")
    .dropTable("HashtagNft")
    .dropTable("Mint")
    .dropTable("Nft")
    .dropTable("TeaBag")
    .dropTable("User")
    .dropTable("Profile")
}