export async function up(knex) {
  await knex.raw(`
    CREATE EXTENSION "uuid-ossp";

    CREATE FUNCTION check_hashtags(hashtags VARCHAR[])
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
    $$ LANGUAGE plpgsql;

    CREATE TYPE "LanguageType" AS ENUM ('en', 'fr', 'es');

    CREATE TYPE "UserRole" AS ENUM ('user', 'admin');

    CREATE TYPE "ProfileVisibilityType" AS ENUM ('public', 'private');

    CREATE TYPE "CurrencyType" AS ENUM ('usd', 'eur', 'eth', 'sol');

    CREATE TYPE "UserTeaBagRole" AS ENUM ('user', 'cooker');

    CREATE TYPE "NotificationType" AS ENUM ('comments_replies', 'comments_threads', 'mints', 'follow_requests', 'follow_requests_accepted');

    CREATE TYPE "NftType" AS ENUM ('image', 'video', 'audio');

    CREATE TABLE "Profile"
    (
      "id"             SERIAL                         NOT NULL PRIMARY KEY,
      "username"       VARCHAR(18)                    NOT NULL UNIQUE CHECK ("username" ~* '^[a-zA-Z0-9_]{3,18}$'),
      "createdAt"      TIMESTAMP(3) WITHOUT TIME ZONE NOT NULL,
      "bio"            VARCHAR(255)                   NOT NULL DEFAULT '',
      "link"           VARCHAR(255)                   NULL
    --     CHECK ( "link" ~* '^(https?:\\/\\/(?:www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b(?:[-a-zA-Z0-9()@:%_\\+.~#?&\\/=]*))$')
      ,
      "avatarUrl"      VARCHAR(255)                   NOT NULL
    --     CHECK ( "avatarUrl" ~* '^(http(s):\\/\\/.)[-a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)$')
      ,
      "canBeSearched"  BOOLEAN                        NOT NULL DEFAULT TRUE,
      "visibilityType" "ProfileVisibilityType"        NOT NULL DEFAULT 'public',
      "location"       TEXT                           NULL,
      "displayName"    VARCHAR(40)                    NOT NULL
    --     CHECK ( "displayName" ~* '^.{3,26}$')
    );

    CREATE TABLE "User"
    (
      "id"                       SERIAL               NOT NULL PRIMARY KEY,
      "email"                    VARCHAR(255)         NOT NULL UNIQUE
    --     CHECK ( "email" ~* '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')
      ,
      "uid"                      UUID                 NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
      "hashedPassword"           VARCHAR(255)         NOT NULL,
      "isActivated"              BOOLEAN              NOT NULL        DEFAULT FALSE,
      "twoFactorEnabled"         BOOLEAN              NOT NULL        DEFAULT FALSE,
      "twoFactorSecret"          VARCHAR(255)         NULL,
      "phoneNumber"              VARCHAR(20)          NULL,
      "languageType"             "LanguageType"       NOT NULL        DEFAULT 'en',
      "role"                     "UserRole"           NOT NULL        DEFAULT 'user',
      "profileId"                INTEGER              NOT NULL
        CONSTRAINT "userProfileFk"
          REFERENCES "Profile" ("id")
          ON DELETE CASCADE,
      "enabledNotificationTypes" "NotificationType"[] NOT NULL        DEFAULT ARRAY [
        'comments_replies'::"NotificationType",
        'comments_threads'::"NotificationType",
        'mints'::"NotificationType",
        'follow_requests'::"NotificationType",
        'follow_requests_accepted'::"NotificationType"]
    );

    CREATE TABLE "TeaBag"
    (
      "id"        SERIAL  NOT NULL PRIMARY KEY,
      "profileId" INTEGER NOT NULL
        CONSTRAINT "teaBagProfileFk"
          REFERENCES "Profile" ("id")
          ON DELETE CASCADE
    );

    CREATE TABLE "Nft"
    (
      "id"              SERIAL                         NOT NULL PRIMARY KEY,
      "ownerUserId"     INTEGER                        NOT NULL
        CONSTRAINT "nftOwnerUserFk"
          REFERENCES "User" ("id")
          ON DELETE CASCADE,
      "showOnProfileId" INTEGER                        NOT NULL
        CONSTRAINT "nftShowOnProfileFk"
          REFERENCES "Profile" ("id")
          ON DELETE CASCADE,
      "title"           VARCHAR(255)                   NOT NULL,
      "description"     TEXT                           NOT NULL DEFAULT '',
      "location"        TEXT                           NULL,
      "price"           DOUBLE PRECISION               NOT NULL,
      "currencyType"    "CurrencyType"                 NOT NULL,
      "contentUrl"      VARCHAR(255)                   NOT NULL,
      "postedAt"        TIMESTAMP(3) WITHOUT TIME ZONE NOT NULL,
      "type"            "NftType"                      NOT NULL
    );

    CREATE TABLE "Mint"
    (
      "nftId"  INTEGER                        NOT NULL
        CONSTRAINT "mintNftFk"
          REFERENCES "Nft" ("id")
          ON DELETE CASCADE,
      "profileId" INTEGER                        NOT NULL
        CONSTRAINT "mintProfileFk"
          REFERENCES "Profile" ("id")
          ON DELETE CASCADE,
      "mintAt" TIMESTAMP(3) WITHOUT TIME ZONE NOT NULL,
      PRIMARY KEY ("nftId", "profileId")
    );

    CREATE TABLE "HashtagNft"
    (
      "hashtag" VARCHAR(255) NOT NULL CHECK ( "hashtag" ~* '^#[a-zA-Z0-9_]{3,255}$'),
      "nftId"   INTEGER      NOT NULL
        CONSTRAINT "hashtagNftFk"
          REFERENCES "Nft" ("id")
          ON DELETE CASCADE,
      PRIMARY KEY ("hashtag", "nftId")
    );

    CREATE TABLE "Comment"
    (
      "id"             SERIAL                         NOT NULL PRIMARY KEY,
      "nftId"          INTEGER                        NOT NULL
        CONSTRAINT "commentNftFk"
          REFERENCES "Nft" ("id")
          ON DELETE CASCADE,
      "profileId"      INTEGER                        NOT NULL
        CONSTRAINT "commentProfileFk"
          REFERENCES "Profile" ("id")
          ON DELETE CASCADE,
      "commentedAt"    TIMESTAMP(3) WITHOUT TIME ZONE NOT NULL,
      "commentary"     VARCHAR(1000)                  NOT NULL,
      "replyCommentId" INTEGER                        NULL
        CONSTRAINT "replyCommentFk"
          REFERENCES "Comment" ("id")
          ON DELETE CASCADE
    );

    CREATE TABLE "ReportComment"
    (
      "reporterProfileId" INTEGER                        NOT NULL
        CONSTRAINT "reporterProfileFk"
          REFERENCES "Profile" ("id")
          ON DELETE CASCADE,
      "reportedCommentId" INTEGER                        NOT NULL
        CONSTRAINT "reportedCommentFk"
          REFERENCES "Comment" ("id")
          ON DELETE CASCADE,
      "reason"            VARCHAR(1000)                  NULL,
      "reportAt"          TIMESTAMP(3) WITHOUT TIME ZONE NOT NULL,
      PRIMARY KEY ("reporterProfileId", "reportedCommentId")
    );

    CREATE TABLE "ReportNft"
    (
      "reporterProfileId" INTEGER                        NOT NULL
        CONSTRAINT "reporterProfileFk"
          REFERENCES "Profile" ("id")
          ON DELETE CASCADE,
      "reportedNftId"  INTEGER                        NOT NULL
        CONSTRAINT "reportedNftFk"
          REFERENCES "Nft" ("id")
          ON DELETE CASCADE,
      "reason"         VARCHAR(1000)                  NULL,
      "reportAt"       TIMESTAMP(3) WITHOUT TIME ZONE NOT NULL,
      PRIMARY KEY ("reporterProfileId", "reportedNftId")
    );

    CREATE TABLE "ReportProfile"
    (
      "reporterProfileId" INTEGER                        NOT NULL
        CONSTRAINT "reporterProfileFk"
          REFERENCES "Profile" ("id")
          ON DELETE CASCADE,
      "reportedProfileId" INTEGER                        NOT NULL
        CONSTRAINT "reportedProfileFk"
          REFERENCES "Profile" ("id")
          ON DELETE CASCADE,
      "reason"         VARCHAR(1000)               NULL,
      "reportAt"       TIMESTAMP(3) WITH TIME ZONE NOT NULL,
      PRIMARY KEY ("reporterProfileId", "reportedProfileId")
    );

    CREATE TABLE "Whitelist"
    (
      "id"       SERIAL                         NOT NULL PRIMARY KEY,
      "startAt"  TIMESTAMP(3) WITHOUT TIME ZONE NOT NULL,
      "endAt"    TIMESTAMP(3) WITHOUT TIME ZONE NOT NULL,
      "teaBagId" INTEGER                        NOT NULL
        CONSTRAINT "whitelistTeaBagFk"
          REFERENCES "TeaBag" ("id")
          ON DELETE CASCADE
    );

    CREATE TABLE "ViewProfile"
    (
      "id"              SERIAL                         NOT NULL PRIMARY KEY,
      "viewerProfileId" INTEGER                        NOT NULL
        CONSTRAINT "viewerProfileFk"
          REFERENCES "Profile" ("id")
          ON DELETE CASCADE,
      "viewedProfileId" INTEGER                        NOT NULL
        CONSTRAINT "viewedProfileFk"
          REFERENCES "Profile" ("id")
          ON DELETE CASCADE,
      "viewAt"          TIMESTAMP(3) WITHOUT TIME ZONE NOT NULL
    );

    CREATE TABLE "ScheduleDeletionUser"
    (
      "id"         SERIAL                         NOT NULL PRIMARY KEY,
      "userId"     INTEGER                        NOT NULL UNIQUE
        CONSTRAINT "scheduledDeletionUserFk"
          REFERENCES "User" ("id")
          ON DELETE CASCADE,
      "scheduleAt" TIMESTAMP(3) WITHOUT TIME ZONE NOT NULL,
      "byUserId"   INTEGER                        NOT NULL
        CONSTRAINT "scheduledDeletionByUserFk"
          REFERENCES "User" ("id")
          ON DELETE CASCADE,
      "reason"     VARCHAR(1000)                  NULL
    );

    CREATE TABLE "DraftNft"
    (
      "id"          SERIAL          NOT NULL PRIMARY KEY,
      "description" TEXT            NULL,
      "ownerId"     INTEGER         NOT NULL
        CONSTRAINT "draftNftOwnerFk"
          REFERENCES "User" ("id")
          ON DELETE CASCADE,
      "hashtags"    VARCHAR(255)[5] NOT NULL CHECK (check_hashtags("hashtags")),
      "location"    TEXT            NOT NULL
    );

    CREATE TABLE "WhitelistUser"
    (
      "whitelistId"       INTEGER NOT NULL
        CONSTRAINT "whitelistUserFk"
          REFERENCES "Whitelist" ("id")
          ON DELETE CASCADE,
      "whitelistedUserId" INTEGER NOT NULL
        CONSTRAINT "whitelistedUserFk"
          REFERENCES "User" ("id")
          ON DELETE CASCADE,
      PRIMARY KEY ("whitelistId", "whitelistedUserId")
    );

    CREATE TABLE "ViewNft"
    (
      "id"     SERIAL                         NOT NULL PRIMARY KEY,
      "profileId" INTEGER                        NOT NULL
        CONSTRAINT "viewNftProfileFk"
          REFERENCES "Profile" ("id")
          ON DELETE CASCADE,
      "nftId"  INTEGER                        NOT NULL
        CONSTRAINT "viewNftNftFk"
          REFERENCES "Nft" ("id")
          ON DELETE CASCADE,
      "viewAt" TIMESTAMP(3) WITHOUT TIME ZONE NOT NULL
    );

    CREATE TABLE "UserTeaBag"
    (
      "userId"   INTEGER          NOT NULL
        CONSTRAINT "userTeaBagUserFk"
          REFERENCES "User" ("id")
          ON DELETE CASCADE,
      "teaBagId" INTEGER          NOT NULL
        CONSTRAINT "userTeaBagTeaBagFk"
          REFERENCES "TeaBag" ("id")
          ON DELETE CASCADE,
      "role"     "UserTeaBagRole" NOT NULL DEFAULT 'user',
      PRIMARY KEY ("userId", "teaBagId")
    );

    CREATE TABLE "PrivateMessage"
    (
      "id"                    SERIAL                         NOT NULL PRIMARY KEY,
      "fromProfileId"         INTEGER                        NOT NULL
        CONSTRAINT "fromUserFk"
          REFERENCES "Profile" ("id")
          ON DELETE CASCADE,
      "toProfileId"           INTEGER                        NOT NULL
        CONSTRAINT "toUserFk"
          REFERENCES "Profile" ("id")
          ON DELETE CASCADE,
      "message"               VARCHAR(1000)                  NOT NULL,
      "sentAt"                TIMESTAMP(3) WITHOUT TIME ZONE NOT NULL,
      "replyPrivateMessageId" INTEGER                        NULL
        CONSTRAINT "replyPrivateMessageFk"
          REFERENCES "PrivateMessage" ("id")
          ON DELETE CASCADE
    );

    CREATE TABLE "Follow"
    (
      "followerProfileId" INTEGER                        NOT NULL
        CONSTRAINT "followerUserFk"
          REFERENCES "Profile" ("id")
          ON DELETE CASCADE,
      "followedProfileId" INTEGER                        NOT NULL
        CONSTRAINT "followedUserFk"
          REFERENCES "Profile" ("id")
          ON DELETE CASCADE,
      "followAt"          TIMESTAMP(3) WITHOUT TIME ZONE NOT NULL,
      PRIMARY KEY ("followerProfileId", "followedProfileId")
    );

    CREATE TABLE "PasswordReset"
    (
      "id"        SERIAL                         NOT NULL UNIQUE,
      "resetId"   UUID                           NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
      "userId"    INTEGER                        NOT NULL
        CONSTRAINT "passwordResetUserFk"
          REFERENCES "User" ("id")
          ON DELETE CASCADE,
      "createdAt" TIMESTAMP(3) WITHOUT TIME ZONE NOT NULL,
      "expireAt"  TIMESTAMP(3) WITHOUT TIME ZONE NOT NULL,
      "active"    BOOLEAN                        NOT NULL
    );

    CREATE TABLE "RequestFollow"
    (
      "requesterProfileId" INTEGER                        NOT NULL
        CONSTRAINT "requesterUserFk"
          REFERENCES "Profile" ("id")
          ON DELETE CASCADE,
      "requestedProfileId" INTEGER                        NOT NULL
        CONSTRAINT "requestedUserFk"
          REFERENCES "Profile" ("id")
          ON DELETE CASCADE,
      "requestAt"          TIMESTAMP(3) WITHOUT TIME ZONE NOT NULL,
      "isIgnored"          BOOLEAN                        NOT NULL DEFAULT FALSE,
      PRIMARY KEY ("requesterProfileId", "requestedProfileId")
    );

    CREATE TABLE "EmailVerification"
    (
      "id"             SERIAL                         NOT NULL PRIMARY KEY,
      "verificationId" UUID                           NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
      "email"          VARCHAR(255)                   NOT NULL,
      "createdAt"      TIMESTAMP(3) WITHOUT TIME ZONE NOT NULL,
      "expireAt"       TIMESTAMP(3) WITHOUT TIME ZONE NOT NULL,
      "isVerified"     BOOLEAN                        NOT NULL
    );

    CREATE TABLE "MintComment"
    (
      "commentId" INTEGER                       NOT NULL
        CONSTRAINT "mintCommentCommentFk"
          REFERENCES "Comment" ("id")
          ON DELETE CASCADE,
      "profileId" INTEGER                       NOT NULL
        CONSTRAINT "mintCommentProfileFk"
          REFERENCES "Profile" ("id")
          ON DELETE CASCADE,
      "mintAt"    TIMESTAMP(3) WITHOUT TIME ZONE NOT NULL,
      PRIMARY KEY ("commentId", "profileId")
    );
  `)
}

export async function down(knex) {
  await knex.raw(`
    DROP TABLE "Profile", "User", "TeaBag", "MintComment", "Nft", "Mint", "HashtagNft", "Comment", "ReportComment", "ReportNft", "ReportProfile", "Whitelist", "ViewProfile", "ScheduleDeletionUser", "DraftNft", "WhitelistUser", "ViewNft", "UserTeaBag", "PrivateMessage", "Follow", "PasswordReset", "RequestFollow", "EmailVerification";
    DROP TYPE "LanguageType", "UserRole", "ProfileVisibilityType", "CurrencyType", "UserTeaBagRole", "NotificationType", "NftType";
    DROP FUNCTION check_hashtags;
    DROP EXTENSION "uuid-ossp";
  `)
}
