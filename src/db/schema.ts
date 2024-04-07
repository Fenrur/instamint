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
import {relations} from "drizzle-orm"

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

export const userRelations = relations(User, ({ one, many }) => ({
  profile: one(Profile, { fields: [User.profileId], references: [Profile.id] }),
  nfts: many(Nft),
  mints: many(Mint),
  comments: many(Comment),
  reportingComments: many(ReportComment),
  reportingNfts: many(ReportNft),
}))

export const TeaBag = pgTable("TeaBag", {
  id: serial("id").notNull().primaryKey(),
  profileId: integer("profileId").notNull().references(() => Profile.id, {onDelete: "cascade"})
})

export const teaBagRelations = relations(TeaBag, ({ one }) => ({
  profile: one(Profile, { fields: [TeaBag.profileId], references: [Profile.id] }),
}))

export const Nft = pgTable("Nft", {
  id: serial("id").notNull().primaryKey(),
  ownerUserId: integer("ownerUserId").notNull().references(() => User.id, {onDelete: "cascade"}),
  showOnProfileId: integer("showOnProfileId").notNull().references(() => Profile.id, {onDelete: "cascade"}),
  description: text("description").notNull(),
  location: text("location").notNull(),
  price: doublePrecision("price").notNull(),
  currencyType: CurrencyType("currencyType").notNull(),
})

export const nftRelations = relations(Nft, ({ one, many }) => ({
  owner: one(User, { fields: [Nft.ownerUserId], references: [User.id] }),
  showOnProfile: one(Profile, { fields: [Nft.showOnProfileId], references: [Profile.id] }),
  mints: many(Mint),
  hashtagNfts: many(HashtagNft),
  comments: many(Comment),
  usersReporting: many(ReportNft),
}))

export const Mint = pgTable("Mint", {
  nftId: integer("nftId").notNull().references(() => Nft.id, {onDelete: "cascade"}).primaryKey(),
  userId: integer("userId").notNull().references(() => User.id, {onDelete: "cascade"}).primaryKey(),
  mintAt: timestamp("mintAt", {withTimezone: false}).notNull(),
})

export const mintRelations = relations(Mint, ({ one }) => ({
  nft: one(Nft, { fields: [Mint.nftId], references: [Nft.id] }),
  user: one(User, { fields: [Mint.userId], references: [User.id] }),
}))

export const HashtagNft = pgTable("HashtagNft", {
  hashtag: varchar("hashtag", {length: 255}).notNull().primaryKey(),
  nftId: integer("nftId").notNull().references(() => Nft.id, {onDelete: "cascade"}).primaryKey(),
})

export const hashtagNftRelations = relations(HashtagNft, ({ one }) => ({
  nft: one(Nft, { fields: [HashtagNft.nftId], references: [Nft.id] }),
}))

export const Comment = pgTable("Comment", {
  id: serial("id").notNull().primaryKey(),
  nftId: integer("nftId").notNull().references(() => Nft.id, {onDelete: "cascade"}),
  userId: integer("userId").notNull().references(() => User.id, {onDelete: "cascade"}),
  commentedAt: timestamp("commentedAt", {withTimezone: false}).notNull(),
  commentary: varchar("commentary", {length: 1000}).notNull(),
  replyCommentId: integer("replyCommentId")
})

export const commentRelations = relations(Comment, ({ one, many }) => ({
  nft: one(Nft, { fields: [Comment.nftId], references: [Nft.id] }),
  user: one(User, { fields: [Comment.userId], references: [User.id] }),
  usersReporting: many(ReportComment),
}))

export const ReportComment = pgTable("ReportComment", {
  reporterUserId: integer("reporterUserId").notNull().references(() => User.id, {onDelete: "cascade"}).primaryKey(),
  reportedCommentId: integer("reportedCommentId").notNull().references(() => Comment.id, {onDelete: "cascade"}).primaryKey(),
  reason: varchar("reason", {length: 1000}),
  reportAt: timestamp("reportAt", {withTimezone: false}).notNull(),
})

export const reportCommentRelations = relations(ReportComment, ({ one }) => ({
  reporter: one(User, { fields: [ReportComment.reporterUserId], references: [User.id] }),
  reportedComment: one(Comment, { fields: [ReportComment.reportedCommentId], references: [Comment.id] }),
}))

export const ReportNft = pgTable("ReportNft", {
  reporterUserId: integer("reporterUserId").notNull().references(() => User.id, {onDelete: "cascade"}).primaryKey(),
  reportedNftId: integer("reportedNftId").notNull().references(() => Nft.id, {onDelete: "cascade"}).primaryKey(),
  reason: varchar("reason", {length: 1000}),
  reportAt: timestamp("reportAt", {withTimezone: false}).notNull(),
})

export const reportNftRelations = relations(ReportNft, ({ one }) => ({
  reporter: one(User, { fields: [ReportNft.reporterUserId], references: [User.id] }),
  reportedNft: one(Nft, { fields: [ReportNft.reportedNftId], references: [Nft.id] }),
}))

export const ReportUser = pgTable("ReportUser", {
  reporterUserId: integer("reporterUserId").notNull().references(() => User.id, {onDelete: "cascade"}).primaryKey(),
  reportedUserId: integer("reportedUserId").notNull().references(() => User.id, {onDelete: "cascade"}).primaryKey(),
  reason: varchar("reason", {length: 1000}),
  reportAt: timestamp("reportAt", {withTimezone: false}).notNull(),
})

export const reportUserRelations = relations(ReportUser, ({ one }) => ({
  reporter: one(User, { fields: [ReportUser.reporterUserId], references: [User.id] }),
  reportedUser: one(User, { fields: [ReportUser.reportedUserId], references: [User.id] }),
}))

export const Whitelist = pgTable("Whitelist", {
  id: serial("id").notNull().primaryKey(),
  startAt: timestamp("startAt", {withTimezone: false}).notNull(),
  endAt: timestamp("endAt", {withTimezone: false}).notNull(),
  teaBagId: integer("teaBagId").notNull().references(() => TeaBag.id, {onDelete: "cascade"}),
})

export const whitelistRelations = relations(Whitelist, ({ one }) => ({
  teaBag: one(TeaBag, { fields: [Whitelist.teaBagId], references: [TeaBag.id] }),
}))

export const ViewProfile = pgTable("ViewProfile", {
  id: serial("id").notNull().primaryKey(),
  viewerUserId: integer("viewerUserId").notNull().references(() => User.id, {onDelete: "cascade"}),
  viewedProfileId: integer("viewedProfileId").notNull().references(() => Profile.id, {onDelete: "cascade"}),
  viewAt: timestamp("viewAt", {withTimezone: false}).notNull(),
})

export const viewProfileRelations = relations(ViewProfile, ({ one }) => ({
  viewer: one(User, { fields: [ViewProfile.viewerUserId], references: [User.id] }),
  viewedProfile: one(Profile, { fields: [ViewProfile.viewedProfileId], references: [Profile.id] }),
}))

export const ScheduleDeletionUser = pgTable("ScheduleDeletionUser", {
  id: serial("id").notNull().primaryKey(),
  userId: integer("userId").notNull().unique().references(() => User.id, {onDelete: "cascade"}),
  scheduleAt: timestamp("scheduleAt", {withTimezone: false}).notNull(),
  byUserId: integer("byUserId").notNull().references(() => User.id, {onDelete: "cascade"}),
  reason: varchar("reason", {length: 1000})
})

export const scheduleDeletionUserRelations = relations(ScheduleDeletionUser, ({ one }) => ({
  user: one(User, { fields: [ScheduleDeletionUser.userId], references: [User.id] }),
  byUser: one(User, { fields: [ScheduleDeletionUser.byUserId], references: [User.id] }),
}))

export const DraftNft= pgTable("DraftNft", {
  id: serial("id").notNull().primaryKey(),
  description: text("description").notNull(),
  ownerId: integer("ownerId").notNull().references(() => User.id, {onDelete: "cascade"}),
  hashtags: varchar("hashtags", {length: 255}).array(5).notNull(),
  location: text("location").notNull(),
})

export const draftNftRelations = relations(DraftNft, ({ one }) => ({
  owner: one(User, { fields: [DraftNft.ownerId], references: [User.id] }),
}))

export const WhitelistUser = pgTable("WhitelistUser", {
  whitelistId: integer("whitelistId").notNull().references(() => Whitelist.id, {onDelete: "cascade"}).primaryKey(),
  whitelistedUserId: integer("whitelistedUserId").notNull().references(() => User.id, {onDelete: "cascade"}).primaryKey(),
})

export const whitelistUserRelations = relations(WhitelistUser, ({ one }) => ({
  whitelist: one(Whitelist, { fields: [WhitelistUser.whitelistId], references: [Whitelist.id] }),
  whitelistedUser: one(User, { fields: [WhitelistUser.whitelistedUserId], references: [User.id] }),
}))

export const ViewNft = pgTable("ViewNft", {
  id: serial("id").notNull().primaryKey(),
  userId: integer("userId").notNull().references(() => User.id, {onDelete: "cascade"}),
  nftId: integer("nftId").notNull().references(() => Nft.id, {onDelete: "cascade"}),
  viewAt: timestamp("viewAt", {withTimezone: false}).notNull(),
})

export const viewNftRelations = relations(ViewNft, ({ one }) => ({
  user: one(User, { fields: [ViewNft.userId], references: [User.id] }),
  nft: one(Nft, { fields: [ViewNft.nftId], references: [Nft.id] }),
}))

export const UserTeaBag = pgTable("UserTeaBag", {
  userId: integer("userId").notNull().references(() => User.id, {onDelete: "cascade"}).primaryKey(),
  teaBagId: integer("teaBagId").notNull().references(() => TeaBag.id, {onDelete: "cascade"}).primaryKey(),
  role: UserTeaBagRole("role").notNull().default("user"),
})

export const userTeaBagRelations = relations(UserTeaBag, ({ one }) => ({
  user: one(User, { fields: [UserTeaBag.userId], references: [User.id] }),
  teaBag: one(TeaBag, { fields: [UserTeaBag.teaBagId], references: [TeaBag.id] }),
}))

export const PrivateMessage = pgTable("PrivateMessage", {
  id: serial("id").notNull().primaryKey(),
  fromUserId: integer("fromUserId").notNull().references(() => User.id, {onDelete: "cascade"}),
  toUserId: integer("toUserId").notNull().references(() => User.id, {onDelete: "cascade"}),
  message: varchar("message", {length: 1000}).notNull(),
  replyPrivateMessageId: integer("replyPrivateMessageId"),
})

export const privateMessageRelations = relations(PrivateMessage, ({ one }) => ({
  fromUser: one(User, { fields: [PrivateMessage.fromUserId], references: [User.id] }),
  toUser: one(User, { fields: [PrivateMessage.toUserId], references: [User.id] }),
}))

export const Follow = pgTable("Follow", {
  followerUserId: integer("followerUserId").notNull().references(() => User.id, {onDelete: "cascade"}).primaryKey(),
  followedUserId: integer("followedUserId").notNull().references(() => User.id, {onDelete: "cascade"}).primaryKey(),
  followAt: timestamp("followAt", {withTimezone: false}).notNull(),
})

export const followRelations = relations(Follow, ({ one }) => ({
  follower: one(User, { fields: [Follow.followerUserId], references: [User.id] }),
  followed: one(User, { fields: [Follow.followedUserId], references: [User.id] }),
}))

export const PasswordReset = pgTable("PasswordReset", {
  id: serial("id").notNull().primaryKey(),
  resetId: uuid("resetId").notNull().unique().defaultRandom(),
  userId: integer("userId").notNull().references(() => User.id, {onDelete: "cascade"}),
  createdAt: timestamp("createdAt", {withTimezone: false}).notNull(),
  expireAt: timestamp("expireAt", {withTimezone: false}).notNull(),
  active: boolean("active").notNull(),
})

export const passwordResetRelations = relations(PasswordReset, ({ one }) => ({
  user: one(User, { fields: [PasswordReset.userId], references: [User.id] }),
}))

export const RequestFollow = pgTable("RequestFollow", {
  requesterUserId: integer("requesterUserId").notNull().references(() => User.id, {onDelete: "cascade"}).primaryKey(),
  requestedUserId: integer("requestedUserId").notNull().references(() => User.id, {onDelete: "cascade"}).primaryKey(),
  requestAt: timestamp("requestAt", {withTimezone: false}).notNull(),
  isIgnored: boolean("isIgnored").notNull().default(false),
})

export const requestFollowRelations = relations(RequestFollow, ({ one }) => ({
  requester: one(User, { fields: [RequestFollow.requesterUserId], references: [User.id] }),
  requested: one(User, { fields: [RequestFollow.requestedUserId], references: [User.id] }),
}))
