import {
  boolean,
  doublePrecision,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  uuid,
  varchar
} from "drizzle-orm/pg-core"
import {relations} from "drizzle-orm"
import {
  currencyTypeArray,
  languageTypeArray,
  nftTypeArray,
  notificationTypeArray,
  profileVisibilityTypeArray,
  userRoleArray,
  userTeaBagRoleArray
} from "@/domain/types"

export const LanguageTypeEnum = pgEnum("LanguageType", languageTypeArray)

export const UserRoleEnum = pgEnum("UserRole", userRoleArray)

export const ProfileVisibilityTypeEnum = pgEnum("ProfileVisibilityType", profileVisibilityTypeArray)

export const CurrencyTypeEnum = pgEnum("CurrencyType", currencyTypeArray)

export const UserTeaBagRoleEnum = pgEnum("UserTeaBagRole", userTeaBagRoleArray)

export const NotificationTypeEnum = pgEnum("NotificationType", notificationTypeArray)

export const NftTypeEnum = pgEnum("NftType", nftTypeArray)

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

export const profileRelations = relations(ProfileTable, ({ many }) => ({
  followers: many(FollowTable, {
    relationName: "followerUserFk"
  }),
  following: many(FollowTable, {
    relationName: "followedUserFk"
  }),
  requesters: many(RequestFollowTable, {
    relationName: "requesterUserFk"
  }),
  showOnNfts: many(NftTable, {
    relationName: "nftShowOnProfileFk"
  }),
}))

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
  enabledNotificationTypes: NotificationTypeEnum("enabledNotificationTypes").array().notNull().default(["comments_replies", "comments_threads", "mints", "follow_requests", "follow_requests_accepted"]),
})

export const userRelations = relations(UserTable, ({one}) => ({
  profile: one(ProfileTable, {
    fields: [UserTable.profileId],
    references: [ProfileTable.id],
  }),
}))

export const TeaBagTable = pgTable("TeaBag", {
  id: serial("id").notNull().primaryKey(),
  profileId: integer("profileId").notNull().references(() => ProfileTable.id, {onDelete: "cascade"})
})

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
  type: NftTypeEnum("type").notNull(),
})

export const nftRelations = relations(NftTable, ({many, one}) => ({
  mints: many(MintTable),
  profile: one(ProfileTable, {
    fields: [NftTable.showOnProfileId],
    references: [ProfileTable.id],
  }),
}))

export const MintTable = pgTable("Mint", {
  nftId: integer("nftId").notNull().references(() => NftTable.id, {onDelete: "cascade"}),
  profileId: integer("profileId").notNull().references(() => ProfileTable.id, {onDelete: "cascade"}),
  mintAt: timestamp("mintAt", {withTimezone: false, mode: "string", precision: 3}).notNull(),
})

export const mintRelations = relations(MintTable, ({one}) => ({
  author: one(NftTable, {
    fields: [MintTable.nftId],
    references: [NftTable.id],
  }),
}))

export const HashtagNftTable = pgTable("HashtagNft", {
  hashtag: varchar("hashtag", {length: 255}).notNull().primaryKey(),
  nftId: integer("nftId").notNull().references(() => NftTable.id, {onDelete: "cascade"}).primaryKey(),
})

export const CommentTable = pgTable("Comment", {
  id: serial("id").notNull().primaryKey(),
  nftId: integer("nftId").notNull().references(() => NftTable.id, {onDelete: "cascade"}),
  profileId: integer("profileId").notNull().references(() => ProfileTable.id, {onDelete: "cascade"}),
  commentedAt: timestamp("commentedAt", {withTimezone: false, mode: "string", precision: 3}).notNull(),
  commentary: varchar("commentary", {length: 1000}).notNull(),
  replyCommentId: integer("replyCommentId")
})

export const commentRelations = relations(CommentTable, ({one}) => ({
  nft: one(NftTable, {
    fields: [CommentTable.nftId],
    references: [NftTable.id],
  }),
}))

export const ReportCommentTable = pgTable("ReportComment", {
  reporterProfileId: integer("reporterProfileId").notNull().references(() => ProfileTable.id, {onDelete: "cascade"}).primaryKey(),
  reportedCommentId: integer("reportedCommentId").notNull().references(() => CommentTable.id, {onDelete: "cascade"}).primaryKey(),
  reason: varchar("reason", {length: 1000}),
  reportAt: timestamp("reportAt", {withTimezone: false, mode: "string", precision: 3}).notNull(),
})

export const ReportNftTable = pgTable("ReportNft", {
  reporterProfileId: integer("reporterProfileId").notNull().references(() => ProfileTable.id, {onDelete: "cascade"}).primaryKey(),
  reportedNftId: integer("reportedNftId").notNull().references(() => NftTable.id, {onDelete: "cascade"}).primaryKey(),
  reason: varchar("reason", {length: 1000}),
  reportAt: timestamp("reportAt", {withTimezone: false, mode: "string", precision: 3}).notNull(),
})

export const ReportProfileTable = pgTable("ReportProfile", {
  reporterProfileId: integer("reporterProfileId").notNull().references(() => ProfileTable.id, {onDelete: "cascade"}).primaryKey(),
  reportedProfileId: integer("reportedProfileId").notNull().references(() => ProfileTable.id, {onDelete: "cascade"}).primaryKey(),
  reason: varchar("reason", {length: 1000}),
  reportAt: timestamp("reportAt", {withTimezone: false, mode: "string", precision: 3}).notNull(),
})

export const WhitelistTable = pgTable("Whitelist", {
  id: serial("id").notNull().primaryKey(),
  startAt: timestamp("startAt", {withTimezone: false, mode: "string", precision: 3}).notNull(),
  endAt: timestamp("endAt", {withTimezone: false, mode: "string", precision: 3}).notNull(),
  teaBagId: integer("teaBagId").notNull().references(() => TeaBagTable.id, {onDelete: "cascade"}),
})

export const ViewProfileTable = pgTable("ViewProfile", {
  id: serial("id").notNull().primaryKey(),
  viewerProfileId: integer("viewerProfileId").notNull().references(() => ProfileTable.id, {onDelete: "cascade"}),
  viewedProfileId: integer("viewedProfileId").notNull().references(() => ProfileTable.id, {onDelete: "cascade"}),
  viewAt: timestamp("viewAt", {withTimezone: false, mode: "string", precision: 3}).notNull(),
})

export const ScheduleDeletionUserTable = pgTable("ScheduleDeletionUser", {
  id: serial("id").notNull().primaryKey(),
  userId: integer("userId").notNull().unique().references(() => UserTable.id, {onDelete: "cascade"}),
  scheduleAt: timestamp("scheduleAt", {withTimezone: false, mode: "string", precision: 3}).notNull(),
  byUserId: integer("byUserId").notNull().references(() => UserTable.id, {onDelete: "cascade"}),
  reason: varchar("reason", {length: 1000})
})

export const DraftNftTable = pgTable("DraftNft", {
  id: serial("id").notNull().primaryKey(),
  description: text("description").notNull(),
  ownerId: integer("ownerId").notNull().references(() => UserTable.id, {onDelete: "cascade"}),
  hashtags: varchar("hashtags", {length: 255}).array(5).notNull(),
  location: text("location").notNull(),
})

export const WhitelistUserTable = pgTable("WhitelistUser", {
  whitelistId: integer("whitelistId").notNull().references(() => WhitelistTable.id, {onDelete: "cascade"}).primaryKey(),
  whitelistedUserId: integer("whitelistedUserId").notNull().references(() => UserTable.id, {onDelete: "cascade"}).primaryKey(),
})

export const ViewNftTable = pgTable("ViewNft", {
  id: serial("id").notNull().primaryKey(),
  profileId: integer("profileId").notNull().references(() => ProfileTable.id, {onDelete: "cascade"}),
  nftId: integer("nftId").notNull().references(() => NftTable.id, {onDelete: "cascade"}),
  viewAt: timestamp("viewAt", {withTimezone: false, mode: "string", precision: 3}).notNull(),
})

export const UserTeaBagTable = pgTable("UserTeaBag", {
  userId: integer("userId").notNull().references(() => UserTable.id, {onDelete: "cascade"}).primaryKey(),
  teaBagId: integer("teaBagId").notNull().references(() => TeaBagTable.id, {onDelete: "cascade"}).primaryKey(),
  role: UserTeaBagRoleEnum("role").notNull().default("user"),
})

export const PrivateMessageTable = pgTable("PrivateMessage", {
  id: serial("id").notNull().primaryKey(),
  fromProfileId: integer("fromProfileId").notNull().references(() => ProfileTable.id, {onDelete: "cascade"}),
  toProfileId: integer("toProfileId").notNull().references(() => ProfileTable.id, {onDelete: "cascade"}),
  message: varchar("message", {length: 1000}).notNull(),
  sentAt: timestamp("sentAt", {withTimezone: false, mode: "string", precision: 3}).notNull(),
  replyPrivateMessageId: integer("replyPrivateMessageId"),
})

export const FollowTable = pgTable("Follow", {
  followerProfileId: integer("followerProfileId").notNull().references(() => ProfileTable.id, {onDelete: "cascade"}),
  followedProfileId: integer("followedProfileId").notNull().references(() => ProfileTable.id, {onDelete: "cascade"}),
  followAt: timestamp("followAt", {withTimezone: false, mode: "string", precision: 3}).notNull(),
}, (table) => {
  return {
    pk: primaryKey({name: "Follow_pkey", columns: [table.followerProfileId, table.followedProfileId]})
  }
})

export const followRelations = relations(FollowTable, ({one}) => ({
  follower: one(ProfileTable, {
    fields: [FollowTable.followerProfileId],
    references: [ProfileTable.id],
  }),
  followed: one(ProfileTable, {
    fields: [FollowTable.followedProfileId],
    references: [ProfileTable.id],
  }),
}))

export const PasswordResetTable = pgTable("PasswordReset", {
  id: serial("id").notNull().primaryKey(),
  resetId: uuid("resetId").notNull().unique().defaultRandom(),
  userId: integer("userId").notNull().references(() => UserTable.id, {onDelete: "cascade"}),
  createdAt: timestamp("createdAt", {withTimezone: false, mode: "string", precision: 3}).notNull(),
  expireAt: timestamp("expireAt", {withTimezone: false, mode: "string", precision: 3}).notNull(),
  active: boolean("active").notNull(),
})

export const EmailVerificationTable = pgTable("EmailVerification", {
  id: serial("id").notNull().primaryKey(),
  verificationId: uuid("verificationId").notNull().unique().defaultRandom(),
  email: varchar("email", {length: 255}).notNull(),
  createdAt: timestamp("createdAt", {withTimezone: false, mode: "string", precision: 3}).notNull(),
  expireAt: timestamp("expireAt", {withTimezone: false, mode: "string", precision: 3}).notNull(),
  isVerified: boolean("isVerified").notNull()
})

export const RequestFollowTable = pgTable("RequestFollow", {
  requesterProfileId: integer("requesterProfileId").notNull().references(() => ProfileTable.id, {onDelete: "cascade"}).primaryKey(),
  requestedProfileId: integer("requestedProfileId").notNull().references(() => ProfileTable.id, {onDelete: "cascade"}).primaryKey(),
  requestAt: timestamp("requestAt", {withTimezone: false, mode: "string", precision: 3}).notNull(),
  isIgnored: boolean("isIgnored").notNull().default(false),
})

export const requestFollowRelations = relations(RequestFollowTable, ({one}) => ({
  requester: one(ProfileTable, {
    fields: [RequestFollowTable.requesterProfileId],
    references: [ProfileTable.id],
  }),
}))

export const MintCommentTable = pgTable("MintComment", {
  commentId: integer("commentId").notNull().references(() => CommentTable.id, {onDelete: "cascade"}),
  profileId: integer("profileId").notNull().references(() => ProfileTable.id, {onDelete: "cascade"}),
  mintAt: timestamp("mintAt", {withTimezone: false, mode: "string", precision: 3}).notNull(),
})
