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

export const userRelations = relations(UserTable, ({one, many}) => ({
  profile: one(ProfileTable, {fields: [UserTable.profileId], references: [ProfileTable.id]}),
  nfts: many(NftTable),
  comments: many(CommentTable),
  reportsNfts: many(ReportNftTable),
  reportsComments: many(ReportCommentTable),
  scheduleDeletionUser: one(ScheduleDeletionUserTable),
  passwordResets: many(PasswordResetTable),
  emailVerifications: many(EmailVerificationTable),
  requestFollows: many(RequestFollowTable),
  userTeaBags: many(UserTeaBagTable),
  whitelists: many(WhitelistUserTable),
  viewsNfts: many(ViewNftTable),
  viewsProfiles: many(ViewProfileTable),
  privateMessages: many(PrivateMessageTable),
  follows: many(FollowTable),
}))

export const TeaBagTable = pgTable("TeaBag", {
  id: serial("id").notNull().primaryKey(),
  profileId: integer("profileId").notNull().references(() => ProfileTable.id, {onDelete: "cascade"})
})

export const teaBagRelations = relations(TeaBagTable, ({one, many}) => ({
  profile: one(ProfileTable, {fields: [TeaBagTable.profileId], references: [ProfileTable.id]}),
  users: many(UserTeaBagTable),
  whitelists: many(WhitelistTable),
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
  postedAt: timestamp("postedAt", {withTimezone: false, mode: "string", precision: 3}).notNull().defaultNow(),
})

export const nftRelations = relations(NftTable, ({one, many}) => ({
  owner: one(UserTable, {fields: [NftTable.ownerUserId], references: [UserTable.id]}),
  showOnProfile: one(ProfileTable, {fields: [NftTable.showOnProfileId], references: [ProfileTable.id]}),
  minted: many(MintTable),
  hashtags: many(HashtagNftTable),
  comments: many(CommentTable),
  reports: many(ReportNftTable),
  views: many(ViewNftTable),
}))

export const MintTable = pgTable("Mint", {
  nftId: integer("nftId").notNull().references(() => NftTable.id, {onDelete: "cascade"}).primaryKey(),
  profileId: integer("profileId").notNull().references(() => ProfileTable.id, {onDelete: "cascade"}).primaryKey(),
  mintAt: timestamp("mintAt", {withTimezone: false, mode: "string", precision: 3}).notNull(),
})

export const mintRelations = relations(MintTable, ({one, many}) => ({
  nft: one(NftTable, {fields: [MintTable.nftId], references: [NftTable.id]}),
  profile: one(ProfileTable, {fields: [MintTable.profileId], references: [ProfileTable.id]}),
  usersReporting: many(ReportNftTable),
}))

export const HashtagNftTable = pgTable("HashtagNft", {
  hashtag: varchar("hashtag", {length: 255}).notNull().primaryKey(),
  nftId: integer("nftId").notNull().references(() => NftTable.id, {onDelete: "cascade"}).primaryKey(),
})

export const hashtagNftRelations = relations(HashtagNftTable, ({one, many}) => ({
  nft: one(NftTable, {fields: [HashtagNftTable.nftId], references: [NftTable.id]}),
  usersReporting: many(ReportNftTable),
}))

export const CommentTable = pgTable("Comment", {
  id: serial("id").notNull().primaryKey(),
  nftId: integer("nftId").notNull().references(() => NftTable.id, {onDelete: "cascade"}),
  profileId: integer("profileId").notNull().references(() => ProfileTable.id, {onDelete: "cascade"}),
  commentedAt: timestamp("commentedAt", {withTimezone: false, mode: "string", precision: 3}).notNull(),
  commentary: varchar("commentary", {length: 1000}).notNull(),
  replyCommentId: integer("replyCommentId")
})

export const commentRelations = relations(CommentTable, ({one, many}) => ({
  nft: one(NftTable, {fields: [CommentTable.nftId], references: [NftTable.id]}),
  profile: one(ProfileTable, {fields: [CommentTable.profileId], references: [ProfileTable.id]}),
  reports: many(ReportCommentTable),
  replies: many(CommentTable),
}))

export const ReportCommentTable = pgTable("ReportComment", {
  reporterProfileId: integer("reporterProfileId").notNull().references(() => ProfileTable.id, {onDelete: "cascade"}).primaryKey(),
  reportedCommentId: integer("reportedCommentId").notNull().references(() => CommentTable.id, {onDelete: "cascade"}).primaryKey(),
  reason: varchar("reason", {length: 1000}),
  reportAt: timestamp("reportAt", {withTimezone: false, mode: "string", precision: 3}).notNull(),
})

export const reportCommentRelations = relations(ReportCommentTable, ({one, many}) => ({
  reporter: one(UserTable, {fields: [ReportCommentTable.reporterUserId], references: [UserTable.id]}),
  reportedComment: one(CommentTable, {fields: [ReportCommentTable.reportedCommentId], references: [CommentTable.id]}),
  usersReporting: many(ReportCommentTable),
}))

export const ReportNftTable = pgTable("ReportNft", {
  reporterProfileId: integer("reporterProfileId").notNull().references(() => ProfileTable.id, {onDelete: "cascade"}).primaryKey(),
  reportedNftId: integer("reportedNftId").notNull().references(() => NftTable.id, {onDelete: "cascade"}).primaryKey(),
  reason: varchar("reason", {length: 1000}),
  reportAt: timestamp("reportAt", {withTimezone: false, mode: "string", precision: 3}).notNull(),
})

export const reportNftRelations = relations(ReportNftTable, ({one, many}) => ({
  reporter: one(UserTable, {fields: [ReportNftTable.reporterUserId], references: [UserTable.id]}),
  reportedNft: one(NftTable, {fields: [ReportNftTable.reportedNftId], references: [NftTable.id]}),
  usersReporting: many(ReportNftTable),
}))

export const ReportProfileTable = pgTable("ReportProfile", {
  reporterProfileId: integer("reporterProfileId").notNull().references(() => ProfileTable.id, {onDelete: "cascade"}).primaryKey(),
  reportedProfileId: integer("reportedProfileId").notNull().references(() => ProfileTable.id, {onDelete: "cascade"}).primaryKey(),
  reason: varchar("reason", {length: 1000}),
  reportAt: timestamp("reportAt", {withTimezone: false, mode: "string", precision: 3}).notNull(),
})

export const reportUserRelations = relations(ReportProfileTable, ({one, many}) => ({
  reporter: one(UserTable, {fields: [ReportProfileTable.reporterUserId], references: [UserTable.id]}),
  reportedProfile: one(ProfileTable, {fields: [ReportProfileTable.reportedProfileId], references: [ProfileTable.id]}),
  usersReporting: many(ReportProfileTable),
}))

export const WhitelistTable = pgTable("Whitelist", {
  id: serial("id").notNull().primaryKey(),
  startAt: timestamp("startAt", {withTimezone: false, mode: "string", precision: 3}).notNull(),
  endAt: timestamp("endAt", {withTimezone: false, mode: "string", precision: 3}).notNull(),
  teaBagId: integer("teaBagId").notNull().references(() => TeaBagTable.id, {onDelete: "cascade"}),
})

export const whitelistRelations = relations(WhitelistTable, ({one, many}) => ({
  teaBag: one(TeaBagTable, {fields: [WhitelistTable.teaBagId], references: [TeaBagTable.id]}),
  users: many(WhitelistUserTable),
}))

export const ViewProfileTable = pgTable("ViewProfile", {
  id: serial("id").notNull().primaryKey(),
  viewerProfileId: integer("viewerProfileId").notNull().references(() => ProfileTable.id, {onDelete: "cascade"}),
  viewedProfileId: integer("viewedProfileId").notNull().references(() => ProfileTable.id, {onDelete: "cascade"}),
  viewAt: timestamp("viewAt", {withTimezone: false, mode: "string", precision: 3}).notNull(),
})

export const viewProfileRelations = relations(ViewProfileTable, ({one, many}) => ({
  viewer: one(UserTable, {fields: [ViewProfileTable.viewerUserId], references: [UserTable.id]}),
  viewed: one(UserTable, {fields: [ViewProfileTable.viewedUserId], references: [UserTable.id]}),
  users: many(ViewProfileTable),
}))

export const ScheduleDeletionUserTable = pgTable("ScheduleDeletionUser", {
  id: serial("id").notNull().primaryKey(),
  userId: integer("userId").notNull().unique().references(() => UserTable.id, {onDelete: "cascade"}),
  scheduleAt: timestamp("scheduleAt", {withTimezone: false, mode: "string", precision: 3}).notNull(),
  byUserId: integer("byUserId").notNull().references(() => UserTable.id, {onDelete: "cascade"}),
  reason: varchar("reason", {length: 1000})
})

export const scheduleDeletionUserRelations = relations(ScheduleDeletionUserTable, ({one, many}) => ({
  user: one(UserTable, {fields: [ScheduleDeletionUserTable.userId], references: [UserTable.id]}),
  byUser: one(UserTable, {fields: [ScheduleDeletionUserTable.byUserId], references: [UserTable.id]}),
}))

export const DraftNftTable = pgTable("DraftNft", {
  id: serial("id").notNull().primaryKey(),
  description: text("description").notNull(),
  ownerId: integer("ownerId").notNull().references(() => UserTable.id, {onDelete: "cascade"}),
  hashtags: varchar("hashtags", {length: 255}).array(5).notNull(),
  location: text("location").notNull(),
})

export const draftNftRelations = relations(DraftNftTable, ({one, many}) => ({
  owner: one(UserTable, {fields: [DraftNftTable.ownerId], references: [UserTable.id]}),
}))

export const WhitelistUserTable = pgTable("WhitelistUser", {
  whitelistId: integer("whitelistId").notNull().references(() => WhitelistTable.id, {onDelete: "cascade"}).primaryKey(),
  whitelistedUserId: integer("whitelistedUserId").notNull().references(() => UserTable.id, {onDelete: "cascade"}).primaryKey(),
})

export const whitelistUserRelations = relations(WhitelistUserTable, ({one, many}) => ({
  whitelist: one(WhitelistTable, {fields: [WhitelistUserTable.whitelistId], references: [WhitelistTable.id]}),
  whitelistedUser: one(UserTable, {fields: [WhitelistUserTable.whitelistedUserId], references: [UserTable.id]}),
}))

export const ViewNftTable = pgTable("ViewNft", {
  id: serial("id").notNull().primaryKey(),
  profileId: integer("profileId").notNull().references(() => ProfileTable.id, {onDelete: "cascade"}),
  nftId: integer("nftId").notNull().references(() => NftTable.id, {onDelete: "cascade"}),
  viewAt: timestamp("viewAt", {withTimezone: false, mode: "string", precision: 3}).notNull(),
})

export const viewNftRelations = relations(ViewNftTable, ({one, many}) => ({
  profile: one(ProfileTable, {fields: [ViewNftTable.profileId], references: [ProfileTable.id]}),
  nft: one(NftTable, {fields: [ViewNftTable.nftId], references: [NftTable.id]}),
  users: many(ViewNftTable),
}))

export const UserTeaBagTable = pgTable("UserTeaBag", {
  userId: integer("userId").notNull().references(() => UserTable.id, {onDelete: "cascade"}).primaryKey(),
  teaBagId: integer("teaBagId").notNull().references(() => TeaBagTable.id, {onDelete: "cascade"}).primaryKey(),
  role: UserTeaBagRoleEnum("role").notNull().default("user"),
})

export const userTeaBagRelations = relations(UserTeaBagTable, ({one, many}) => ({
  user: one(UserTable, {fields: [UserTeaBagTable.userId], references: [UserTable.id]}),
  teaBag: one(TeaBagTable, {fields: [UserTeaBagTable.teaBagId], references: [TeaBagTable.id]}),
  whitelists: many(WhitelistUserTable),
}))

export const PrivateMessageTable = pgTable("PrivateMessage", {
  id: serial("id").notNull().primaryKey(),
  fromProfileId: integer("fromProfileId").notNull().references(() => ProfileTable.id, {onDelete: "cascade"}),
  toProfileId: integer("toProfileId").notNull().references(() => ProfileTable.id, {onDelete: "cascade"}),
  message: varchar("message", {length: 1000}).notNull(),
  sentAt: timestamp("sentAt", {withTimezone: false, mode: "string", precision: 3}).notNull(),
  replyPrivateMessageId: integer("replyPrivateMessageId"),
})

export const privateMessageRelations = relations(PrivateMessageTable, ({one, many}) => ({
  from: one(UserTable, {fields: [PrivateMessageTable.fromUserId], references: [UserTable.id]}),
  to: one(UserTable, {fields: [PrivateMessageTable.toUserId], references: [UserTable.id]}),
  replies: many(PrivateMessageTable),
}))

export const FollowTable = pgTable("Follow", {
  followerProfileId: integer("followerProfileId").notNull().references(() => ProfileTable.id, {onDelete: "cascade"}).primaryKey(),
  followedProfileId: integer("followedProfileId").notNull().references(() => ProfileTable.id, {onDelete: "cascade"}).primaryKey(),
  followAt: timestamp("followAt", {withTimezone: false, mode: "string", precision: 3}).notNull(),
})

export const followRelations = relations(FollowTable, ({one, many}) => ({
  follower: one(UserTable, {fields: [FollowTable.followerUserId], references: [UserTable.id]}),
  followed: one(UserTable, {fields: [FollowTable.followedUserId], references: [UserTable.id]}),
  users: many(FollowTable),
}))

export const PasswordResetTable = pgTable("PasswordReset", {
  id: serial("id").notNull().primaryKey(),
  resetId: uuid("resetId").notNull().unique().defaultRandom(),
  userId: integer("userId").notNull().references(() => UserTable.id, {onDelete: "cascade"}),
  createdAt: timestamp("createdAt", {withTimezone: false, mode: "string", precision: 3}).notNull(),
  expireAt: timestamp("expireAt", {withTimezone: false, mode: "string", precision: 3}).notNull(),
  active: boolean("active").notNull(),
})

export const passwordResetRelations = relations(PasswordResetTable, ({one, many}) => ({
  user: one(UserTable, {fields: [PasswordResetTable.userId], references: [UserTable.id]}),
}))

export const EmailVerificationTable = pgTable("EmailVerification", {
  id: serial("id").notNull().primaryKey(),
  verificationId: uuid("verificationId").notNull().unique().defaultRandom(),
  email: varchar("email", {length: 255}).notNull(),
  createdAt: timestamp("createdAt", {withTimezone: false, mode: "string", precision: 3}).notNull(),
  expireAt: timestamp("expireAt", {withTimezone: false, mode: "string", precision: 3}).notNull(),
  isVerified: boolean("isVerified").notNull()
})

export const emailVerificationRelations = relations(EmailVerificationTable, ({one, many}) => ({
  user: one(UserTable, {fields: [EmailVerificationTable.userId], references: [UserTable.id]}),
}))

export const RequestFollowTable = pgTable("RequestFollow", {
  requesterProfileId: integer("requesterProfileId").notNull().references(() => ProfileTable.id, {onDelete: "cascade"}).primaryKey(),
  requestedProfileId: integer("requestedProfileId").notNull().references(() => ProfileTable.id, {onDelete: "cascade"}).primaryKey(),
  requestAt: timestamp("requestAt", {withTimezone: false, mode: "string", precision: 3}).notNull(),
  isIgnored: boolean("isIgnored").notNull().default(false),
})

export const requestFollowRelations = relations(RequestFollowTable, ({one, many}) => ({
  requester: one(UserTable, {fields: [RequestFollowTable.requesterUserId], references: [UserTable.id]}),
  requested: one(UserTable, {fields: [RequestFollowTable.requestedUserId], references: [UserTable.id]}),
}))
