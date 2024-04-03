CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE OR REPLACE FUNCTION check_hashtags(hashtags VARCHAR[])
  RETURNS BOOLEAN AS
$$
DECLARE
  hashtag VARCHAR;
BEGIN
  FOREACH hashtag IN ARRAY hashtags
    LOOP
      IF NOT (hashtag ~* '^#[a-zA-Z0-9_]{3,255}$') THEN
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

CREATE TYPE "NotificationType" AS ENUM ('replies_comments', 'thread_comment', 'mint', 'follow', 'follow_request_accepted');

CREATE TABLE "Profile"
(
  "id"             SERIAL                         NOT NULL PRIMARY KEY,
  "username"       VARCHAR(16)                    NOT NULL UNIQUE CHECK ("username" ~* '^[a-zA-Z0-9_]{3,16}$'),
  "createdAt"      TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
  "bio"            VARCHAR(255)                   NOT NULL DEFAULT '',
  "link"           VARCHAR(255)                   NOT NULL CHECK ( "link" ~* '^https?://(www\.)?[\w-]+\.[\w-]+(/\S*)?$'),
  "avatarUrl"      VARCHAR(255)                   NOT NULL CHECK ( "avatarUrl" ~* '^https?://(www\.)?[\w-]+\.[\w-]+(/\S*)?$'),
  "canBeSearched"  BOOLEAN                        NOT NULL DEFAULT TRUE,
  "visibilityType" "ProfileVisibilityType"        NOT NULL DEFAULT 'public',
  "location"       TEXT                           NULL,
  "displayName"    VARCHAR(25)                    NOT NULL
);

CREATE TABLE "User"
(
  "id"                       SERIAL               NOT NULL PRIMARY KEY,
  "email"                    VARCHAR(255)         NOT NULL UNIQUE CHECK ( "email" ~* '^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$'),
  "uid"                      UUID                 NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
  "hashedPassword"           VARCHAR(255)         NOT NULL,
  "isActivated"              BOOLEAN              NOT NULL        DEFAULT FALSE,
  "twoFactorEnabled"         BOOLEAN              NOT NULL        DEFAULT FALSE,
  "twoFactorSecret"          VARCHAR(255)         NULL,
  "phoneNumber"              VARCHAR(20)          NULL,
  languageType               "LanguageType"       NOT NULL        DEFAULT 'en',
  "role"                     "UserRole"           NOT NULL        DEFAULT 'user',
  "profileId"                INTEGER              NOT NULL
    CONSTRAINT "userProfileFk"
      REFERENCES "Profile" ("id")
      ON DELETE CASCADE,
  "enabledNotificationTypes" "NotificationType"[] NOT NULL        DEFAULT ARRAY [
    'replies_comments'::"NotificationType",
    'thread_comment'::"NotificationType",
    'mint'::"NotificationType",
    'follow'::"NotificationType",
    'follow_request_accepted'::"NotificationType"]
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
  "id"              SERIAL           NOT NULL PRIMARY KEY,
  "ownerUserId"     INTEGER          NOT NULL
    CONSTRAINT "nftOwnerUserFk"
      REFERENCES "User" ("id")
      ON DELETE CASCADE,
  "showOnProfileId" INTEGER          NOT NULL
    CONSTRAINT "nftShowOnProfileFk"
      REFERENCES "Profile" ("id")
      ON DELETE CASCADE,
  "description"     TEXT             NOT NULL,
  "location"        TEXT             NOT NULL,
  "price"           DOUBLE PRECISION NOT NULL,
  "currencyType"    "CurrencyType"   NOT NULL
);

CREATE TABLE "Mint"
(
  "nftId"  INTEGER                        NOT NULL
    CONSTRAINT "mintNftFk"
      REFERENCES "Nft" ("id")
      ON DELETE CASCADE,
  "userId" INTEGER                        NOT NULL
    CONSTRAINT "mintUserFk"
      REFERENCES "User" ("id")
      ON DELETE CASCADE,
  "mintAt" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
  PRIMARY KEY ("nftId", "userId")
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
  "userId"         INTEGER                        NOT NULL
    CONSTRAINT "commentUserFk"
      REFERENCES "User" ("id")
      ON DELETE CASCADE,
  "commentedAt"    TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
  "commentary"     VARCHAR(1000)                  NOT NULL,
  "replyCommentId" INTEGER                        NULL
    CONSTRAINT "replyCommentFk"
      REFERENCES "Comment" ("id")
      ON DELETE CASCADE
);

CREATE TABLE "ReportComment"
(
  "reporterUserId"    INTEGER                        NOT NULL
    CONSTRAINT "reporterUserFk"
      REFERENCES "User" ("id")
      ON DELETE CASCADE,
  "reportedCommentId" INTEGER                        NOT NULL
    CONSTRAINT "reportedCommentFk"
      REFERENCES "Comment" ("id")
      ON DELETE CASCADE,
  "reason"            VARCHAR(300)                   NULL,
  "reportAt"          TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
  PRIMARY KEY ("reporterUserId", "reportedCommentId")
);

CREATE TABLE "ReportNft"
(
  "reporterUserId" BIGINT                         NOT NULL
    CONSTRAINT "reporterUserFk"
      REFERENCES "User" ("id")
      ON DELETE CASCADE,
  "reportedNftId"  BIGINT                         NOT NULL
    CONSTRAINT "reportedNftFk"
      REFERENCES "Nft" ("id")
      ON DELETE CASCADE,
  "reason"         VARCHAR(300)                   NULL,
  "reportAt"       TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
  PRIMARY KEY ("reporterUserId", "reportedNftId")
);

CREATE TABLE "ReportUser"
(
  "reporterUserId" BIGINT                      NOT NULL
    CONSTRAINT "reporterUserFk"
      REFERENCES "User" ("id")
      ON DELETE CASCADE,
  "reportedUserId" BIGINT                      NOT NULL
    CONSTRAINT "reportedUserFk"
      REFERENCES "User" ("id")
      ON DELETE CASCADE,
  "reason"         VARCHAR(1000)               NULL,
  "reportAt"       TIMESTAMP(0) WITH TIME ZONE NOT NULL,
  PRIMARY KEY ("reporterUserId", "reportedUserId")
);

CREATE TABLE "Whitelist"
(
  "id"       SERIAL                         NOT NULL PRIMARY KEY,
  "startAt"  TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
  "endAt"    TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
  "teaBagId" INTEGER                        NOT NULL
    CONSTRAINT "whitelistTeaBagFk"
      REFERENCES "TeaBag" ("id")
      ON DELETE CASCADE
);

CREATE TABLE "ViewProfile"
(
  "id"              SERIAL                         NOT NULL PRIMARY KEY,
  "viewerUserId"    INTEGER                        NOT NULL
    CONSTRAINT "viewerUserFk"
      REFERENCES "User" ("id")
      ON DELETE CASCADE,
  "viewedProfileId" INTEGER                        NOT NULL
    CONSTRAINT "viewedProfileFk"
      REFERENCES "Profile" ("id")
      ON DELETE CASCADE,
  "viewAt"          TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL
);

CREATE TABLE "ScheduleDeletionUser"
(
  "id"          SERIAL                         NOT NULL PRIMARY KEY,
  "userId"      INTEGER                        NOT NULL UNIQUE
    CONSTRAINT "scheduledDeletionUserFk"
      REFERENCES "User" ("id")
      ON DELETE CASCADE,
  "detectionAt" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
  "byUserId"    INTEGER                        NOT NULL
    CONSTRAINT "scheduledDeletionByUserFk"
      REFERENCES "User" ("id")
      ON DELETE CASCADE,
  "reason"      VARCHAR(1000)                  NULL
);

CREATE TABLE "DraftNft"
(
  "id"          SERIAL          NOT NULL PRIMARY KEY,
  "description" VARCHAR(255)    NULL,
  "ownerId"     BIGINT          NOT NULL,
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
  "userId" INTEGER                        NOT NULL
    CONSTRAINT "viewNftUserFk"
      REFERENCES "User" ("id")
      ON DELETE CASCADE,
  "nftId"  INTEGER                        NOT NULL
    CONSTRAINT "viewNftNftFk"
      REFERENCES "Nft" ("id")
      ON DELETE CASCADE,
  "viewAt" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL
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
  "id"                    SERIAL        NOT NULL PRIMARY KEY,
  "fromUserId"            INTEGER       NOT NULL
    CONSTRAINT "fromUserFk"
      REFERENCES "User" ("id")
      ON DELETE CASCADE,
  "toUserId"              INTEGER       NOT NULL
    CONSTRAINT "toUserFk"
      REFERENCES "User" ("id")
      ON DELETE CASCADE,
  "message"               VARCHAR(1000) NOT NULL,
  "replyPrivateMessageId" INTEGER       NULL
    CONSTRAINT "replyPrivateMessageFk"
      REFERENCES "PrivateMessage" ("id")
      ON DELETE CASCADE
);

CREATE TABLE "Follow"
(
  "followerUserId" INTEGER NOT NULL
    CONSTRAINT "followerUserFk"
      REFERENCES "User" ("id")
      ON DELETE CASCADE,
  "followedUserId" INTEGER NOT NULL
    CONSTRAINT "followedUserFk"
      REFERENCES "User" ("id")
      ON DELETE CASCADE,
  PRIMARY KEY ("followerUserId", "followedUserId")
);

CREATE TABLE "PasswordReset"
(
  "id"        SERIAL                         NOT NULL UNIQUE,
  "resetId"   UUID                           NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
  "userId"    INTEGER                        NOT NULL
    CONSTRAINT "passwordResetUserFk"
      REFERENCES "User" ("id")
      ON DELETE CASCADE,
  "createdAt" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
  "expireAt"  TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
  "active"    BOOLEAN                        NOT NULL
);

CREATE TABLE "RequestFollow"
(
  "requesterUserId" INTEGER NOT NULL
    CONSTRAINT "requesterUserFk"
      REFERENCES "User" ("id")
      ON DELETE CASCADE,
  "requestedUserId" INTEGER NOT NULL
    CONSTRAINT "requestedUserFk"
      REFERENCES "User" ("id")
      ON DELETE CASCADE,
  "isIgnored"       BOOLEAN NOT NULL DEFAULT FALSE,
  PRIMARY KEY ("requesterUserId", "requestedUserId")
);
