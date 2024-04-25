import {
  boolean,
  doublePrecision,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
  varchar
} from "drizzle-orm/pg-core"
import {relations} from "drizzle-orm"

export const LanguageTypeEnum = pgEnum("LanguageType", ["en", "fr", "es"])

export const UserRoleEnum = pgEnum("UserRole", ["user", "admin"])

export const ProfileVisibilityTypeEnum = pgEnum("ProfileVisibilityType", ["public", "private"])

export const CurrencyTypeEnum = pgEnum("CurrencyType", ["usd", "eur", "eth", "sol"])

export const UserTeaBagRoleEnum = pgEnum("UserTeaBagRole", ["user", "cooker"])

export const NotificationTypeEnum = pgEnum("NotificationType", ["replies_comments", "thread_comment", "mint", "follow", "follow_request_accepted"])

export const ProfileTable = pgTable("Profile", {
  id: serial("id").notNull().primaryKey(),
  username: varchar("username", {length: 16}).notNull().unique(),
  createdAt: timestamp("createdAt", {withTimezone: false, mode: "string", precision: 3}).notNull(),
  bio: varchar("bio", {length: 255}).notNull().default(""),
  link: varchar("link", {length: 255}),
  avatarUrl: varchar("avatarUrl", {length: 255}).notNull(),
  canBeSearched: boolean("canBeSearched").notNull().default(true),
  visibilityType: ProfileVisibilityTypeEnum("visibilityType").notNull().default("public"),
  location: text("location"),
  displayName: varchar("displayName", {length: 40}).notNull()
})

export const UserTable = pgTable("User", {
  id: serial("id").notNull().primaryKey(),
  email: varchar("email", {length: 255}).notNull().unique(),
  uid: uuid("uid").notNull().unique().defaultRandom(),
  hashedPassword: varchar("hashedPassword", {length: 255}).notNull(),
  isActivated: boolean("isActivated").notNull().default(false),
  twoFactorEnabled: boolean("twoFactorEnabled").notNull().default(false),
  twoFactorSecret: varchar("twoFactorSecret", {length: 255}),
  phoneNumber: varchar("phoneNumber", {length: 20}),
  languageType: LanguageTypeEnum("languageType").notNull().default("en"),
  role: UserRoleEnum("role").notNull().default("user"),
  profileId: integer("profileId").notNull().references(() => ProfileTable.id, {onDelete: "cascade"}),
  enabledNotificationTypes: NotificationTypeEnum("enabledNotificationTypes").array().notNull().default(["replies_comments", "thread_comment", "mint", "follow", "follow_request_accepted"]),
})

export const userRelations = relations(UserTable, ({ one, many }) => ({
  profile: one(ProfileTable, { fields: [UserTable.profileId], references: [ProfileTable.id] }),
  nfts: many(NftTable),
  mints: many(MintTable),
  comments: many(CommentTable),
  reportedComments: many(ReportCommentTable),
  reportedNfts: many(ReportNftTable),
  reportedUsers: many(ReportUserTable),
  teaBags: many(TeaBagTable),
  viewedProfiles: many(TeaBagTable),
  scheduledDeletion: many(ScheduleDeletionUserTable),
  drafts: many(DraftNftTable),
  whitelists: many(WhitelistTable),
  whitelistUsers: many(WhitelistUserTable),
  privateMessages: many(PrivateMessageTable)
}))

export const TeaBagTable = pgTable("TeaBag", {
  id: serial("id").notNull().primaryKey(),
  profileId: integer("profileId").notNull().references(() => ProfileTable.id, {onDelete: "cascade"})
})

export const teaBagRelations = relations(TeaBagTable, ({ one }) => ({
  profile: one(ProfileTable, { fields: [TeaBagTable.profileId], references: [ProfileTable.id] }),
}))

export const NftTable = pgTable("Nft", {
  id: serial("id").notNull().primaryKey(),
  ownerUserId: integer("ownerUserId").notNull().references(() => UserTable.id, {onDelete: "cascade"}),
  showOnProfileId: integer("showOnProfileId").notNull().references(() => ProfileTable.id, {onDelete: "cascade"}),
  title: varchar("title", {length: 255}).notNull(),
  description: text("description").notNull().default(""),
  location: text("location"),
  price: doublePrecision("price").notNull(),
  currencyType: CurrencyTypeEnum("currencyType").notNull(),
  contentUrl: varchar("contentUrl", {length: 255}).notNull(),
})

export const nftRelations = relations(NftTable, ({ one, many }) => ({
  owner: one(UserTable, { fields: [NftTable.ownerUserId], references: [UserTable.id] }),
  showOnProfile: one(ProfileTable, { fields: [NftTable.showOnProfileId], references: [ProfileTable.id] }),
  mints: many(MintTable),
  hashtagNfts: many(HashtagNftTable),
  comments: many(CommentTable),
  usersReporting: many(ReportNftTable),
}))

export const MintTable = pgTable("Mint", {
  nftId: integer("nftId").notNull().references(() => NftTable.id, {onDelete: "cascade"}).primaryKey(),
  userId: integer("userId").notNull().references(() => UserTable.id, {onDelete: "cascade"}).primaryKey(),
  mintAt: timestamp("mintAt", {withTimezone: false, mode: "string", precision: 3}).notNull(),
})

export const mintRelations = relations(MintTable, ({ one }) => ({
  nft: one(NftTable, { fields: [MintTable.nftId], references: [NftTable.id] }),
  user: one(UserTable, { fields: [MintTable.userId], references: [UserTable.id] }),
}))

export const HashtagNftTable = pgTable("HashtagNft", {
  hashtag: varchar("hashtag", {length: 255}).notNull().primaryKey(),
  nftId: integer("nftId").notNull().references(() => NftTable.id, {onDelete: "cascade"}).primaryKey(),
})

export const hashtagNftRelations = relations(HashtagNftTable, ({ one }) => ({
  nft: one(NftTable, { fields: [HashtagNftTable.nftId], references: [NftTable.id] }),
}))

export const CommentTable = pgTable("Comment", {
  id: serial("id").notNull().primaryKey(),
  nftId: integer("nftId").notNull().references(() => NftTable.id, {onDelete: "cascade"}),
  userId: integer("userId").notNull().references(() => UserTable.id, {onDelete: "cascade"}),
  commentedAt: timestamp("commentedAt", {withTimezone: false, mode: "string", precision: 3}).notNull(),
  commentary: varchar("commentary", {length: 1000}).notNull(),
  replyCommentId: integer("replyCommentId")
})

export const commentRelations = relations(CommentTable, ({ one, many }) => ({
  nft: one(NftTable, { fields: [CommentTable.nftId], references: [NftTable.id] }),
  user: one(UserTable, { fields: [CommentTable.userId], references: [UserTable.id] }),
  usersReporting: many(ReportCommentTable),
}))

export const ReportCommentTable = pgTable("ReportComment", {
  reporterUserId: integer("reporterUserId").notNull().references(() => UserTable.id, {onDelete: "cascade"}).primaryKey(),
  reportedCommentId: integer("reportedCommentId").notNull().references(() => CommentTable.id, {onDelete: "cascade"}).primaryKey(),
  reason: varchar("reason", {length: 1000}),
  reportAt: timestamp("reportAt", {withTimezone: false, mode: "string", precision: 3}).notNull(),
})

export const reportCommentRelations = relations(ReportCommentTable, ({ one }) => ({
  reporter: one(UserTable, { fields: [ReportCommentTable.reporterUserId], references: [UserTable.id] }),
  reportedComment: one(CommentTable, { fields: [ReportCommentTable.reportedCommentId], references: [CommentTable.id] }),
}))

export const ReportNftTable = pgTable("ReportNft", {
  reporterUserId: integer("reporterUserId").notNull().references(() => UserTable.id, {onDelete: "cascade"}).primaryKey(),
  reportedNftId: integer("reportedNftId").notNull().references(() => NftTable.id, {onDelete: "cascade"}).primaryKey(),
  reason: varchar("reason", {length: 1000}),
  reportAt: timestamp("reportAt", {withTimezone: false, mode: "string", precision: 3}).notNull(),
})

export const reportNftRelations = relations(ReportNftTable, ({ one }) => ({
  reporter: one(UserTable, { fields: [ReportNftTable.reporterUserId], references: [UserTable.id] }),
  reportedNft: one(NftTable, { fields: [ReportNftTable.reportedNftId], references: [NftTable.id] }),
}))

export const ReportUserTable = pgTable("ReportUser", {
  reporterUserId: integer("reporterUserId").notNull().references(() => UserTable.id, {onDelete: "cascade"}).primaryKey(),
  reportedUserId: integer("reportedUserId").notNull().references(() => UserTable.id, {onDelete: "cascade"}).primaryKey(),
  reason: varchar("reason", {length: 1000}),
  reportAt: timestamp("reportAt", {withTimezone: false, mode: "string", precision: 3}).notNull(),
})

export const reportUserRelations = relations(ReportUserTable, ({ one }) => ({
  reporter: one(UserTable, { fields: [ReportUserTable.reporterUserId], references: [UserTable.id] }),
  reportedUser: one(UserTable, { fields: [ReportUserTable.reportedUserId], references: [UserTable.id] }),
}))

export const WhitelistTable = pgTable("Whitelist", {
  id: serial("id").notNull().primaryKey(),
  startAt: timestamp("startAt", {withTimezone: false, mode: "string", precision: 3}).notNull(),
  endAt: timestamp("endAt", {withTimezone: false, mode: "string", precision: 3}).notNull(),
  teaBagId: integer("teaBagId").notNull().references(() => TeaBagTable.id, {onDelete: "cascade"}),
})

export const whitelistRelations = relations(WhitelistTable, ({ one }) => ({
  teaBag: one(TeaBagTable, { fields: [WhitelistTable.teaBagId], references: [TeaBagTable.id] }),
}))

export const ViewProfileTable = pgTable("ViewProfile", {
  id: serial("id").notNull().primaryKey(),
  viewerUserId: integer("viewerUserId").notNull().references(() => UserTable.id, {onDelete: "cascade"}),
  viewedProfileId: integer("viewedProfileId").notNull().references(() => ProfileTable.id, {onDelete: "cascade"}),
  viewAt: timestamp("viewAt", {withTimezone: false, mode: "string", precision: 3}).notNull(),
})

export const viewProfileRelations = relations(ViewProfileTable, ({ one }) => ({
  viewer: one(UserTable, { fields: [ViewProfileTable.viewerUserId], references: [UserTable.id] }),
  viewedProfile: one(ProfileTable, { fields: [ViewProfileTable.viewedProfileId], references: [ProfileTable.id] }),
}))

export const ScheduleDeletionUserTable = pgTable("ScheduleDeletionUser", {
  id: serial("id").notNull().primaryKey(),
  userId: integer("userId").notNull().unique().references(() => UserTable.id, {onDelete: "cascade"}),
  scheduleAt: timestamp("scheduleAt", {withTimezone: false, mode: "string", precision: 3}).notNull(),
  byUserId: integer("byUserId").notNull().references(() => UserTable.id, {onDelete: "cascade"}),
  reason: varchar("reason", {length: 1000})
})

export const scheduleDeletionUserRelations = relations(ScheduleDeletionUserTable, ({ one }) => ({
  user: one(UserTable, { fields: [ScheduleDeletionUserTable.userId], references: [UserTable.id] }),
  byUser: one(UserTable, { fields: [ScheduleDeletionUserTable.byUserId], references: [UserTable.id] }),
}))

export const DraftNftTable= pgTable("DraftNft", {
  id: serial("id").notNull().primaryKey(),
  description: text("description").notNull(),
  ownerId: integer("ownerId").notNull().references(() => UserTable.id, {onDelete: "cascade"}),
  hashtags: varchar("hashtags", {length: 255}).array(5).notNull(),
  location: text("location").notNull(),
})

export const draftNftRelations = relations(DraftNftTable, ({ one }) => ({
  owner: one(UserTable, { fields: [DraftNftTable.ownerId], references: [UserTable.id] }),
}))

export const WhitelistUserTable = pgTable("WhitelistUser", {
  whitelistId: integer("whitelistId").notNull().references(() => WhitelistTable.id, {onDelete: "cascade"}).primaryKey(),
  whitelistedUserId: integer("whitelistedUserId").notNull().references(() => UserTable.id, {onDelete: "cascade"}).primaryKey(),
})

export const whitelistUserRelations = relations(WhitelistUserTable, ({ one }) => ({
  whitelist: one(WhitelistTable, { fields: [WhitelistUserTable.whitelistId], references: [WhitelistTable.id] }),
  whitelistedUser: one(UserTable, { fields: [WhitelistUserTable.whitelistedUserId], references: [UserTable.id] }),
}))

export const ViewNftTable = pgTable("ViewNft", {
  id: serial("id").notNull().primaryKey(),
  userId: integer("userId").notNull().references(() => UserTable.id, {onDelete: "cascade"}),
  nftId: integer("nftId").notNull().references(() => NftTable.id, {onDelete: "cascade"}),
  viewAt: timestamp("viewAt", {withTimezone: false, mode: "string", precision: 3}).notNull(),
})

export const viewNftRelations = relations(ViewNftTable, ({ one }) => ({
  user: one(UserTable, { fields: [ViewNftTable.userId], references: [UserTable.id] }),
  nft: one(NftTable, { fields: [ViewNftTable.nftId], references: [NftTable.id] }),
}))

export const UserTeaBagTable = pgTable("UserTeaBag", {
  userId: integer("userId").notNull().references(() => UserTable.id, {onDelete: "cascade"}).primaryKey(),
  teaBagId: integer("teaBagId").notNull().references(() => TeaBagTable.id, {onDelete: "cascade"}).primaryKey(),
  role: UserTeaBagRoleEnum("role").notNull().default("user"),
})

export const userTeaBagRelations = relations(UserTeaBagTable, ({ one }) => ({
  user: one(UserTable, { fields: [UserTeaBagTable.userId], references: [UserTable.id] }),
  teaBag: one(TeaBagTable, { fields: [UserTeaBagTable.teaBagId], references: [TeaBagTable.id] }),
}))

export const PrivateMessageTable = pgTable("PrivateMessage", {
  id: serial("id").notNull().primaryKey(),
  fromUserId: integer("fromUserId").notNull().references(() => UserTable.id, {onDelete: "cascade"}),
  toUserId: integer("toUserId").notNull().references(() => UserTable.id, {onDelete: "cascade"}),
  message: varchar("message", {length: 1000}).notNull(),
  replyPrivateMessageId: integer("replyPrivateMessageId"),
})

export const privateMessageRelations = relations(PrivateMessageTable, ({ one }) => ({
  fromUser: one(UserTable, { fields: [PrivateMessageTable.fromUserId], references: [UserTable.id] }),
  toUser: one(UserTable, { fields: [PrivateMessageTable.toUserId], references: [UserTable.id] }),
}))

export const FollowTable = pgTable("Follow", {
  followerUserId: integer("followerUserId").notNull().references(() => UserTable.id, {onDelete: "cascade"}).primaryKey(),
  followedUserId: integer("followedUserId").notNull().references(() => UserTable.id, {onDelete: "cascade"}).primaryKey(),
  followAt: timestamp("followAt", {withTimezone: false, mode: "string", precision: 3}).notNull(),
})

export const followRelations = relations(FollowTable, ({ one }) => ({
  follower: one(UserTable, { fields: [FollowTable.followerUserId], references: [UserTable.id] }),
  followed: one(UserTable, { fields: [FollowTable.followedUserId], references: [UserTable.id] }),
}))

export const PasswordResetTable = pgTable("PasswordReset", {
  id: serial("id").notNull().primaryKey(),
  resetId: uuid("resetId").notNull().unique().defaultRandom(),
  userId: integer("userId").notNull().references(() => UserTable.id, {onDelete: "cascade"}),
  createdAt: timestamp("createdAt", {withTimezone: false, mode: "string", precision: 3}).notNull(),
  expireAt: timestamp("expireAt", {withTimezone: false, mode: "string", precision: 3}).notNull(),
  active: boolean("active").notNull(),
})

export const passwordResetRelations = relations(PasswordResetTable, ({ one }) => ({
  user: one(UserTable, { fields: [PasswordResetTable.userId], references: [UserTable.id] }),
}))

export const EmailVerificationTable = pgTable("EmailVerification", {
  id: serial("id").notNull().primaryKey(),
  verificationId: uuid("verificationId").notNull().unique().defaultRandom(),
  email: varchar("email", {length: 255}).notNull(),
  createdAt: timestamp("createdAt", {withTimezone: false, mode: "string", precision: 3}).notNull(),
  expireAt: timestamp("expireAt", {withTimezone: false, mode: "string", precision: 3}).notNull(),
  isVerified: boolean("isVerified").notNull()
})

export const RequestFollowTable = pgTable("RequestFollow", {
  requesterUserId: integer("requesterUserId").notNull().references(() => UserTable.id, {onDelete: "cascade"}).primaryKey(),
  requestedUserId: integer("requestedUserId").notNull().references(() => UserTable.id, {onDelete: "cascade"}).primaryKey(),
  requestAt: timestamp("requestAt", {withTimezone: false, mode: "string", precision: 3}).notNull(),
  isIgnored: boolean("isIgnored").notNull().default(false),
})

export const requestFollowRelations = relations(RequestFollowTable, ({ one }) => ({
  requester: one(UserTable, { fields: [RequestFollowTable.requesterUserId], references: [UserTable.id] }),
  requested: one(UserTable, { fields: [RequestFollowTable.requestedUserId], references: [UserTable.id] }),
}))
