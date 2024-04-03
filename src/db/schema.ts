import {
  boolean,
  doublePrecision, foreignKey,
  integer,
  pgEnum,
  pgTable, primaryKey,
  serial,
  text,
  timestamp,
  uuid,
  varchar
} from "drizzle-orm/pg-core"

export const LanguageType = pgEnum("LanguageType", ["en", "fr", "es"])

export const UserRole = pgEnum("UserRole", ["user", "admin"])

export const ProfileVisibilityType = pgEnum("ProfileVisibilityType", ["public", "private"])

export const CurrencyType = pgEnum("CurrencyType", ["usd", "eur", "eth", "sol"])

export const UserTeaBagRole = pgEnum("UserTeaBagRole", ["user", "cooker"])

export const NotificationType = pgEnum("NotificationType", ["replies_comments", "thread_comment", "mint", "follow", "follow_request_accepted"])

export const Profile = pgTable("Profile", {
  id: serial("id").notNull().primaryKey(),
  username: varchar("username", {length: 16}).notNull().unique(),
  createdAt: timestamp("createdAt", {withTimezone: false}).notNull(),
  bio: varchar("bio", {length: 255}).notNull().default(""),
  link: varchar("link", {length: 255}).notNull(),
  avatarUrl: varchar("avatarUrl", {length: 255}).notNull(),
  canBeSearched: boolean("canBeSearched").notNull().default(true),
  visibilityType: ProfileVisibilityType("visibilityType").notNull().default("public"),
  location: text("location"),
  displayName: varchar("displayName", {length: 25}).notNull()
})

export const User = pgTable("User", {
  id: serial("id").notNull().primaryKey(),
  email: varchar("email", {length: 255}).notNull().unique(),
  uid: uuid("uid").notNull().unique().defaultRandom(),
  hashedPassword: varchar("hashedPassword", {length: 255}).notNull(),
  isActivated: boolean("isActivated").notNull().default(false),
  twoFactorEnabled: boolean("twoFactorEnabled").notNull().default(false),
  twoFactorSecret: varchar("twoFactorSecret", {length: 255}),
  phoneNumber: varchar("phoneNumber", {length: 20}),
  languageType: LanguageType("languageType").notNull().default("en"),
  role: UserRole("role").notNull().default("user"),
  profileId: integer("profileId").notNull().references(() => Profile.id, {onDelete: "cascade"}),
  enabledNotificationTypes: NotificationType("enabledNotificationTypes").array().notNull().default(["replies_comments", "thread_comment", "mint", "follow", "follow_request_accepted"]),
})

export const TeaBag = pgTable("TeaBag", {
  id: serial("id").notNull().primaryKey(),
  profileId: integer("profileId").notNull().references(() => Profile.id, {onDelete: "cascade"})
})

export const Nft = pgTable("Nft", {
  id: serial("id").notNull().primaryKey(),
  ownerUserId: integer("ownerUserId").notNull().references(() => User.id, {onDelete: "cascade"}),
  showOnProfileId: integer("showOnProfileId").notNull().references(() => Profile.id, {onDelete: "cascade"}),
  description: text("description").notNull(),
  location: text("location").notNull(),
  price: doublePrecision("price").notNull(),
  currencyType: CurrencyType("currencyType").notNull(),
})

export const Mint = pgTable("Mint", {
  nftId: integer("nftId").notNull().references(() => Nft.id, {onDelete: "cascade"}).primaryKey(),
  userId: integer("userId").notNull().references(() => User.id, {onDelete: "cascade"}).primaryKey(),
  mintAt: timestamp("mintAt", {withTimezone: false}).notNull(),
})

export const HashtagNft = pgTable("HashtagNft", {
  hashtag: varchar("hashtag", {length: 255}).notNull().primaryKey(),
  nftId: integer("nftId").notNull().references(() => Nft.id, {onDelete: "cascade"}).primaryKey(),
})

export const Comment = pgTable("Comment", {
  id: serial("id").notNull().primaryKey(),
  nftId: integer("nftId").notNull().references(() => Nft.id, {onDelete: "cascade"}),
  userId: integer("userId").notNull().references(() => User.id, {onDelete: "cascade"}),
  commentedAt: timestamp("commentedAt", {withTimezone: false}).notNull(),
  commentary: varchar("commentary", {length: 1000}).notNull(),
  replyCommentId: integer("replyCommentId")
})

export const ReportComment = pgTable("ReportComment", {
  reporterUserId: integer("reporterUserId").notNull().references(() => User.id, {onDelete: "cascade"}).primaryKey(),
  reportedCommentId: integer("reportedCommentId").notNull().references(() => Comment.id, {onDelete: "cascade"}).primaryKey(),
  reason: varchar("reason", {length: 1000}),
  reportAt: timestamp("reportAt", {withTimezone: false}).notNull(),
})

export const ReportNft = pgTable("ReportNft", {
  reporterUserId: integer("reporterUserId").notNull().references(() => User.id, {onDelete: "cascade"}).primaryKey(),
  reportedNftId: integer("reportedNftId").notNull().references(() => Nft.id, {onDelete: "cascade"}).primaryKey(),
  reason: varchar("reason", {length: 1000}),
  reportAt: timestamp("reportAt", {withTimezone: false}).notNull(),
})

export const ReportUser = pgTable("ReportUser", {
  reporterUserId: integer("reporterUserId").notNull().references(() => User.id, {onDelete: "cascade"}).primaryKey(),
  reportedUserId: integer("reportedUserId").notNull().references(() => User.id, {onDelete: "cascade"}).primaryKey(),
  reason: varchar("reason", {length: 1000}),
  reportAt: timestamp("reportAt", {withTimezone: false}).notNull(),
})

export const Whitelist = pgTable("Whitelist", {
  id: serial("id").notNull().primaryKey(),
  startAt: timestamp("startAt", {withTimezone: false}).notNull(),
  endAt: timestamp("endAt", {withTimezone: false}).notNull(),
  teaBagId: integer("teaBagId").notNull().references(() => TeaBag.id, {onDelete: "cascade"}),
})

export const ViewProfile = pgTable("ViewProfile", {
  id: serial("id").notNull().primaryKey(),
  viewerUserId: integer("viewerUserId").notNull().references(() => User.id, {onDelete: "cascade"}),
  viewedProfileId: integer("viewedProfileId").notNull().references(() => Profile.id, {onDelete: "cascade"}),
  viewAt: timestamp("viewAt", {withTimezone: false}).notNull(),
})

export const ScheduleDeletionUser = pgTable("ScheduleDeletionUser", {
  id: serial("id").notNull().primaryKey(),
  userId: integer("userId").notNull().unique().references(() => User.id, {onDelete: "cascade"}),
  scheduleAt: timestamp("scheduleAt", {withTimezone: false}).notNull(),
  byUserId: integer("byUserId").notNull().references(() => User.id, {onDelete: "cascade"}),
  reason: varchar("reason", {length: 1000})
})

export const DraftNft= pgTable("DraftNft", {
  id: serial("id").notNull().primaryKey(),
  description: text("description").notNull(),
  ownerId: integer("ownerId").notNull().references(() => User.id, {onDelete: "cascade"}),
  hashtags: varchar("hashtags", {length: 255}).array(5).notNull(),
  location: text("location").notNull(),
})

export const WhitelistUser = pgTable("WhitelistUser", {
  whitelistId: integer("whitelistId").notNull().references(() => Whitelist.id, {onDelete: "cascade"}).primaryKey(),
  whitelistedUserId: integer("whitelistedUserId").notNull().references(() => User.id, {onDelete: "cascade"}).primaryKey(),
})

export const ViewNft = pgTable("ViewNft", {
  id: serial("id").notNull().primaryKey(),
  userId: integer("userId").notNull().references(() => User.id, {onDelete: "cascade"}),
  nftId: integer("nftId").notNull().references(() => Nft.id, {onDelete: "cascade"}),
  viewAt: timestamp("viewAt", {withTimezone: false}).notNull(),
})

export const UserTeaBag = pgTable("UserTeaBag", {
  userId: integer("userId").notNull().references(() => User.id, {onDelete: "cascade"}).primaryKey(),
  teaBagId: integer("teaBagId").notNull().references(() => TeaBag.id, {onDelete: "cascade"}).primaryKey(),
  role: UserTeaBagRole("role").notNull().default("user"),
})

export const PrivateMessage = pgTable("PrivateMessage", {
  id: serial("id").notNull().primaryKey(),
  fromUserId: integer("fromUserId").notNull().references(() => User.id, {onDelete: "cascade"}),
  toUserId: integer("toUserId").notNull().references(() => User.id, {onDelete: "cascade"}),
  message: varchar("message", {length: 1000}).notNull(),
  replyPrivateMessageId: integer("replyPrivateMessageId"),
})

export const Follow = pgTable("Follow", {
  followerUserId: integer("followerUserId").notNull().references(() => User.id, {onDelete: "cascade"}).primaryKey(),
  followedUserId: integer("followedUserId").notNull().references(() => User.id, {onDelete: "cascade"}).primaryKey(),
  followAt: timestamp("followAt", {withTimezone: false}).notNull(),
})

export const PasswordReset = pgTable("PasswordReset", {
  id: serial("id").notNull().primaryKey(),
  resetId: uuid("resetId").notNull().unique().defaultRandom(),
  userId: integer("userId").notNull().references(() => User.id, {onDelete: "cascade"}),
  createdAt: timestamp("createdAt", {withTimezone: false}).notNull(),
  expireAt: timestamp("expireAt", {withTimezone: false}).notNull(),
  active: boolean("active").notNull(),
})

export const RequestFollow = pgTable("RequestFollow", {
  requesterUserId: integer("requesterUserId").notNull().references(() => User.id, {onDelete: "cascade"}).primaryKey(),
  requestedUserId: integer("requestedUserId").notNull().references(() => User.id, {onDelete: "cascade"}).primaryKey(),
  requestAt: timestamp("requestAt", {withTimezone: false}).notNull(),
  isIgnored: boolean("isIgnored").notNull().default(false),
})
