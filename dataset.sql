INSERT INTO "Profile" ("id", "username", "createdAt", "bio", "link", "avatarUrl", "canBeSearched", "visibilityType",
                       "location", "displayName")
-- USERs Profile
VALUES (1, 'sane_blindness691', '2024-01-01 00:00:00', 'Just a bio', 'https://www.google.com/',
        'https://api.dicebear.com/8.x/pixel-art/svg?seed=sane_blindness691', TRUE, 'public', 'Paris, France',
        'sane_blindness691'),
       (2, 'hind_sunburst858', '2024-01-02 00:00:00', 'Wawwww', 'https://www.google.com/',
        'https://api.dicebear.com/8.x/pixel-art/svg?seed=hind_sunburst858',
        TRUE, 'public', 'Berlin, Germany', 'hind_sunburst858'),
       (3, 'organizational_emo', '2024-01-03 00:00:00', '', NULL,
        'https://api.dicebear.com/8.x/pixel-art/svg?seed=organizational_emo', FALSE, 'private', 'Tokyo, Japan',
        '赛啊苏拉卡慕'),
       (4, 'fraudulent_transla', '2024-01-04 00:00:00', 'Love coding', NULL,
        'https://api.dicebear.com/8.x/pixel-art/svg?seed=fraudulent_transla', TRUE, 'public', NULL, 'Coder'),
       (5, 'creased_bankruptcy', '2024-01-05 00:00:00', 'I like turtles', NULL,
        'https://api.dicebear.com/8.x/pixel-art/svg?seed=creased_bankruptcy', TRUE, 'private', 'Galapagos',
        'Turtle Lover 🐢'),
       (6, 'vascular_stare660', '2024-01-06 00:00:00', 'Coffee aficionado', NULL,
        'https://api.dicebear.com/8.x/pixel-art/svg?seed=vascular_stare660', TRUE, 'public', 'Colombia',
        'Coffee Guy ☕️'),
       (7, 'protective_refrige', '2024-01-07 00:00:00', 'Digital Nomad', NULL,
        'https://api.dicebear.com/8.x/pixel-art/svg?seed=protective_refrige', TRUE, 'public', 'Bali', 'Nomad'),
       (8, 'venerable_relation', '2024-01-08 00:00:00', 'Music Producer', NULL,
        'https://api.dicebear.com/8.x/pixel-art/svg?seed=venerable_relation', TRUE, 'public', 'Los Angeles',
        'MusicMan 🎸'),
       (9, 'decadent_construct', '2024-01-09 00:00:00', 'Startup Founder', NULL,
        'https://api.dicebear.com/8.x/pixel-art/svg?seed=decadent_construct', TRUE, 'public', 'Silicon Valley',
        'Entreprener Bitcoin'),
       (10, 'confidential_tanka', '2024-01-10 00:00:00', 'Blockchain Enthusiast', NULL,
        'https://api.dicebear.com/8.x/pixel-art/svg?seed=confidential_tanka', TRUE, 'public', 'New York',
        'Blockchain Guy'),
       (11, 'christ_david', '2024-01-10 00:00:00', 'Enjoy these as art, nothing more.', NULL,
        'https://api.dicebear.com/8.x/pixel-art/svg?seed=christ_david', TRUE, 'public', 'New York',
        'Christopher David');

-- TEA BAGs Profile
INSERT INTO "Profile" ("id", "username", "createdAt", "bio", "link", "avatarUrl", "canBeSearched", "visibilityType",
                       "location", "displayName")
VALUES (11, 'big_hugs', '2024-01-11 00:00:00',
        'The official Big Hugs collection. We love art <3.',
        'https://www.google.com/', 'https://api.dicebear.com/8.x/pixel-art/svg?seed=big_hugs', TRUE, 'public',
        'On Earth', 'Big Hugs'),
       (12, 'digital_artists', '2024-01-12 00:00:00',
        'A community for digital artists creating and selling NFTs. Let''s inspire each other and grow together.',
        'https://www.google.com/', 'https://api.dicebear.com/8.x/pixel-art/svg?seed=digital_artists', TRUE, 'public',
        'Paris, France',
        'Digital Artists Unite'),
       (13, 'crypto_art_market', '2024-01-13 00:00:00',
        'Exploring the intersection of art and blockchain. A hub for artists, collectors, and traders of crypto art.',
        'https://www.google.com/', 'https://api.dicebear.com/8.x/pixel-art/svg?seed=crypto_art_market', TRUE, 'public',
        'Japan',
        'Crypto Art Market'),
       (14, 'blockchain_gamers', '2024-01-14 00:00:00',
        'For the lovers of blockchain-based gaming. Discuss, trade, and explore NFTs within virtual worlds.',
        'https://www.google.com/', 'https://api.dicebear.com/8.x/pixel-art/svg?seed=blockchain_gamers', TRUE, 'public',
        'Global',
        'Blockchain Gamers'),
       (15, 'metaverseexplorers', '2024-01-15 00:00:00',
        'Join us in discovering new NFT projects and virtual lands within the expanding metaverse.',
        'https://www.google.com/', 'https://api.dicebear.com/8.x/pixel-art/svg?seed=metaverseexplorers', TRUE,
        'private', NULL,
        'Metaverse Explorers');



INSERT INTO "User" ("id", "email", "hashedPassword", "isActivated", "twoFactorEnabled", "languageType", "role", "profileId",
                    "enabledNotificationTypes")
VALUES (1, 'instaminttest+1@outlook.com', '$2a$12$w9sNymBUUbTNS8noPFjAweNbfXJn4IVRtqGyj2jrmAe6F.Ek5aR7.', TRUE, FALSE,
        'en',
        'user', 1, '{"replies_comments", "mint"}'),
-- PASSWORD: V5[tSp+k354/=}:J/u
       (2, 'instaminttest+2@outlook.com', '$2a$12$gLV.KwGrxkicA3RyuyFsjOl.xBLt3gFfXWbDUQnPljwXTq.X8tgG2', TRUE, FALSE,
        'fr',
        'user', 2, '{"replies_comments", "mint"}'),
-- PASSWORD: ?#95,>7jYnJymy},]E
       (3, 'instaminttest+3@outlook.com', '$2a$12$se2eiljsFIT0KKuNq2cCJeNt4mh78yvdIf1zhkUy01IQvtbLFnisG', TRUE, TRUE, 'es',
        'user', 3,
-- PASSWORD: 20Dl[FC4IAq%[rl\J8
        '{"follow", "follow_request_accepted"}'),
       (4, 'instaminttest+4@outlook.com', '$2a$12$8Sbh0/10ujcqToIhdCk8rOH83LvFYpFoTCINJW1m0rb9d5NpR1frq', TRUE, FALSE,
        'en',
        'admin', 4, '{"replies_comments"}'),
-- PASSWORD: p5e5g?J,tL*Jcx1*h[
       (5, 'instaminttest+5@outlook.com', '$2a$12$dYBEuTLvH.oeurkcTfaxs.THF7tFzw3SjeRfjn6Apk6ptoRjtyYIe', TRUE, TRUE, 'fr',
        'user', 5, '{"thread_comment", "follow"}'),
-- PASSWORD: )vs:7'8K2E<B.l9_+x
       (6, 'instaminttest+6@outlook.com', '$2a$12$HCItsBs6gnSwPiweCfHu0uQX00Qz06.yT8KTRGwNlmOtk99Jjzbhm', TRUE, FALSE,
        'es',
        'user', 6, '{"mint"}'),
-- PASSWORD: 6V0£8V<Z^8s:Z\Hs£d
       (7, 'instaminttest+7@outlook.com', '$2a$12$CNixFkbp.pd6Zr9oBPGPx.WvVMZsWNGKH0lMNPdgE3dqDxov1dCCi', TRUE, TRUE, 'en',
        'user', 7,
-- PASSWORD: 7hOms98+3,#_=(R9k4
        '{"replies_comments", "thread_comment"}'),
       (8, 'instaminttest+8@outlook.com', '$2a$12$QvtIf8qy4y/u4eie2w8bFO/.35juoxIc9TrX61IF330ycETcJIIF.', TRUE, FALSE,
        'fr',
        'user', 8,
-- PASSWORD: 74,:az3%vD+IH3jHDU
        '{"replies_comments", "follow_request_accepted"}'),
       (9, 'instaminttest+9@outlook.com', '$2a$12$YYq6g6ai5XKxLCjpVgaHjeaFq1OjB5K1HqXOWuLqVF1MOIctGJBmm', TRUE, TRUE, 'es',
        'user', 9, '{"thread_comment", "follow"}'),
-- PASSWORD: h8G6?87*£+7ae6srvp
       (10, 'instaminttest+10@outlook.com', '$2a$12$ybPHd.rWsbXL4FLjcanCg.tp7Lt5u/CVHzK3HiHFAfLgOPycgJb1S', TRUE, FALSE, 'en',
        'user', 10, '{"replies_comments", "thread_comment", "mint", "follow", "follow_request_accepted"}');
-- PASSWORD: +b.4e8&OqP7CBso6?g


INSERT INTO "TeaBag" ("id", "profileId")
VALUES (1, 11),
       (2, 12),
       (3, 13),
       (4, 14),
       (5, 15);

INSERT INTO "Nft" ("id", "ownerUserId", "showOnProfileId", "title", "description", "location", "price", "currencyType", "contentUrl")
VALUES (1, 1, 1, 'outcast', DEFAULT, NULL, 0.615, 'eth', 'https://raw.seadn.io/files/c1add1efc7fdf64f08768a48099889c8.png'),
       (2, 2, 1, 'Nyan Dot Cat', 'Under the eclipse''s aura, a single blue pixel transforms and lights up the digital sky.', NULL, 0.0012, 'eth', 'https://raw.seadn.io/files/e29af2a0fa0493b5cb1b954618f676a9.gif'),
       (3, 3, 1, 'MUTATIO', 'First discovered in Sector 7, these airborne mutants now plague the entire metaverse.', NULL, 0.001, 'eth', 'https://raw.seadn.io/files/a5b69e19890836a465bb3a0832de39cd.gif'),
       (4, 4, 1, 'rect()', 'rect() is the genesis generative art collection by 8-Bit', NULL, 0.0101, 'eth', 'https://raw.seadn.io/files/b359127fabd03e1e2a3465e39c915c5a.png'),
       (5, 11, 11, 'Big Hugs #1', E'Big Hugs is a pfp collection that was meant to be a joyful emotionally interesting collection of art. It is Christopher David Ryan''s brain worm that he has been itching at for the last 10 years.\n\nBrought to you by Big Hugs Studio which consists of CDR and Jeff Excell\n\nEnjoy these as art, nothing more.', NULL, 0.615, 'eth', 'https://raw.seadn.io/files/77c239a750637c1399816e4a5687457c.png'),
       (6, 11, 11, 'Big Hugs #2', E'Big Hugs is a pfp collection that was meant to be a joyful emotionally interesting collection of art. It is Christopher David Ryan''s brain worm that he has been itching at for the last 10 years.\n\nBrought to you by Big Hugs Studio which consists of CDR and Jeff Excell\n\nEnjoy these as art, nothing more.', NULL, 0.025, 'eth', 'https://raw.seadn.io/files/d12bce77d2aa670ec8a1d30f0ffc7e5b.png'),
       (7, 11, 11, 'Big Hugs #3', E'Big Hugs is a pfp collection that was meant to be a joyful emotionally interesting collection of art. It is Christopher David Ryan''s brain worm that he has been itching at for the last 10 years.\n\nBrought to you by Big Hugs Studio which consists of CDR and Jeff Excell\n\nEnjoy these as art, nothing more.', NULL, 0.405, 'eth', 'https://raw.seadn.io/files/42df2a8297215dca102b8bda8e831960.png'),
       (8, 11, 11, 'Big Hugs #4', E'Big Hugs is a pfp collection that was meant to be a joyful emotionally interesting collection of art. It is Christopher David Ryan''s brain worm that he has been itching at for the last 10 years.\n\nBrought to you by Big Hugs Studio which consists of CDR and Jeff Excell\n\nEnjoy these as art, nothing more.', NULL, 0.300, 'eth', 'https://raw.seadn.io/files/f2767195d117c004cf521535ba5fa3f5.png'),
       (9, 11, 11, 'Big Hugs #5', E'Big Hugs is a pfp collection that was meant to be a joyful emotionally interesting collection of art. It is Christopher David Ryan''s brain worm that he has been itching at for the last 10 years.\n\nBrought to you by Big Hugs Studio which consists of CDR and Jeff Excell\n\nEnjoy these as art, nothing more.', NULL, 0.240, 'eth', 'https://raw.seadn.io/files/fb91c909f956f5b7b1ff6273118283ca.png'),
       (10, 11, 11, 'Big Hugs #6', E'Big Hugs is a pfp collection that was meant to be a joyful emotionally interesting collection of art. It is Christopher David Ryan''s brain worm that he has been itching at for the last 10 years.\n\nBrought to you by Big Hugs Studio which consists of CDR and Jeff Excell\n\nEnjoy these as art, nothing more.', NULL, 0.542, 'eth', 'https://raw.seadn.io/files/487e090781dfdeaf662fc3f41cfe953a.png'),
       (11, 11, 11, 'Big Hugs #7', E'Big Hugs is a pfp collection that was meant to be a joyful emotionally interesting collection of art. It is Christopher David Ryan''s brain worm that he has been itching at for the last 10 years.\n\nBrought to you by Big Hugs Studio which consists of CDR and Jeff Excell\n\nEnjoy these as art, nothing more.', NULL, 0.643, 'eth', 'https://raw.seadn.io/files/aeea1b5d4886b071d0974e637bfbeb0c.png'),
       (12, 11, 11, 'Big Hugs #8', E'Big Hugs is a pfp collection that was meant to be a joyful emotionally interesting collection of art. It is Christopher David Ryan''s brain worm that he has been itching at for the last 10 years.\n\nBrought to you by Big Hugs Studio which consists of CDR and Jeff Excell\n\nEnjoy these as art, nothing more.', NULL, 0.123, 'eth', 'https://raw.seadn.io/files/2ba8ed7c296cd37ac15c79f8ea33870d.png'),
       (12, 11, 11, 'Big Hugs #9', E'Big Hugs is a pfp collection that was meant to be a joyful emotionally interesting collection of art. It is Christopher David Ryan''s brain worm that he has been itching at for the last 10 years.\n\nBrought to you by Big Hugs Studio which consists of CDR and Jeff Excell\n\nEnjoy these as art, nothing more.', NULL, 1.64, 'eth', 'https://raw.seadn.io/files/dfbf365fe384ab7f8e993643fddcfca1.png'),
       (13, 11, 11, 'Big Hugs #10', E'Big Hugs is a pfp collection that was meant to be a joyful emotionally interesting collection of art. It is Christopher David Ryan''s brain worm that he has been itching at for the last 10 years.\n\nBrought to you by Big Hugs Studio which consists of CDR and Jeff Excell\n\nEnjoy these as art, nothing more.', NULL, 0.754, 'eth', 'https://raw.seadn.io/files/e5924f44f4d9be15d1e943a17528eb3e.png'),
       (14, 1, 1, 'outcast', 'Man read book', NULL, 0.615, 'eth', 'https://i.seadn.io/s/raw/files/c1add1efc7fdf64f08768a48099889c8.png?auto=format&dpr=1&w=1000'),
       (15, 1, 1, 'outcast', 'Man read book', NULL, 0.615, 'eth', 'https://i.seadn.io/s/raw/files/c1add1efc7fdf64f08768a48099889c8.png?auto=format&dpr=1&w=1000'),
       (16, 1, 1, 'outcast', 'Man read book', NULL, 0.615, 'eth', 'https://i.seadn.io/s/raw/files/c1add1efc7fdf64f08768a48099889c8.png?auto=format&dpr=1&w=1000'),
       (17, 1, 1, 'outcast', 'Man read book', NULL, 0.615, 'eth', 'https://i.seadn.io/s/raw/files/c1add1efc7fdf64f08768a48099889c8.png?auto=format&dpr=1&w=1000'),
       (18, 1, 1, 'outcast', 'Man read book', NULL, 0.615, 'eth', 'https://i.seadn.io/s/raw/files/c1add1efc7fdf64f08768a48099889c8.png?auto=format&dpr=1&w=1000');


INSERT INTO "Mint" ("nftId", "userId", "mintAt")
VALUES (1, 1, '2024-01-01 01:00:00'),
       (2, 2, '2024-01-02 02:00:00'),
       (3, 3, '2024-01-03 03:00:00'),
       (4, 4, '2024-01-04 04:00:00'),
       (5, 5, '2024-01-05 05:00:00'),
       (6, 6, '2024-01-06 06:00:00'),
       (7, 7, '2024-01-07 07:00:00'),
       (8, 8, '2024-01-08 08:00:00'),
       (9, 9, '2024-01-09 09:00:00'),
       (10, 10, '2024-01-10 10:00:00');

INSERT INTO "HashtagNft" ("hashtag", "nftId")
VALUES ('#cool', 1),
       ('#art', 2),
       ('#crypto', 3),
       ('#collectible', 4),
       ('#digital', 5),
       ('#unique', 6),
       ('#blockchain', 7),
       ('#cryptoart', 8),
       ('#nftcommunity', 9),
       ('#nftcollector', 10);

INSERT INTO "Comment" ("nftId", "userId", "commentedAt", "commentary", "replyCommentId")
VALUES (1, 2, '2024-01-01 12:00:00', 'Amazing piece!', NULL),
       (2, 3, '2024-01-02 13:00:00', 'Really like this one.', NULL),
       (3, 4, '2024-01-03 14:00:00', 'Incredible work!', NULL),
       (4, 5, '2024-01-04 15:00:00', 'So cool!', NULL),
       (5, 6, '2024-01-05 16:00:00', 'Wow!', NULL),
       (6, 7, '2024-01-06 17:00:00', 'This is awesome.', NULL),
       (7, 8, '2024-01-07 18:00:00', 'Love it!', NULL),
       (8, 9, '2024-01-08 19:00:00', 'Great job!', NULL),
       (9, 10, '2024-01-09 20:00:00', 'So creative.', NULL),
       (10, 1, '2024-01-10 21:00:00', 'Fabulous!', NULL);

INSERT INTO "ReportComment" ("reporterUserId", "reportedCommentId", "reason", "reportAt")
VALUES (1, 5, 'Inappropriate language', '2024-02-01 09:00:00'),
       (2, 6, 'Spam', '2024-02-02 10:00:00'),
       (3, 7, 'Hate speech', '2024-02-03 11:00:00'),
       (4, 8, 'Off-topic', '2024-02-04 12:00:00'),
       (5, 9, 'Harassment', '2024-02-05 13:00:00'),
       (6, 10, 'Inappropriate content', '2024-02-06 14:00:00'),
       (7, 1, 'Violates terms of service', '2024-02-07 15:00:00'),
       (8, 2, 'Other', '2024-02-08 16:00:00'),
       (9, 3, 'Inappropriate language', '2024-02-09 17:00:00'),
       (10, 4, 'Spam', '2024-02-10 18:00:00');

INSERT INTO "ReportNft" ("reporterUserId", "reportedNftId", "reason", "reportAt")
VALUES (2, 1, 'Copywrite infringement', '2024-03-01 09:00:00'),
       (3, 2, 'Fake', '2024-03-02 10:00:00'),
       (4, 3, 'Scam', '2024-03-03 11:00:00'),
       (5, 4, 'Inappropriate content', '2024-03-04 12:00:00'),
       (6, 5, 'Violates terms of service', '2024-03-05 13:00:00'),
       (7, 6, 'Other', '2024-03-06 14:00:00'),
       (8, 7, 'Copywrite infringement', '2024-03-07 15:00:00'),
       (9, 8, 'Fake', '2024-03-08 16:00:00'),
       (10, 9, 'Scam', '2024-03-09 17:00:00'),
       (1, 10, 'Inappropriate content', '2024-03-10 18:00:00');

INSERT INTO "ReportUser" ("reporterUserId", "reportedUserId", "reason", "reportAt")
VALUES (1, 2, 'Harassment', '2024-04-01 08:00:00+00'),
       (2, 3, 'Fake profile', '2024-04-02 09:00:00+00'),
       (3, 4, 'Scamming', '2024-04-03 10:00:00+00'),
       (4, 5, 'Inappropriate behavior', '2024-04-04 11:00:00+00'),
       (5, 6, 'Violates terms of service', '2024-04-05 12:00:00+00'),
       (6, 7, 'Other', '2024-04-06 13:00:00+00'),
       (7, 8, 'Harassment', '2024-04-07 14:00:00+00'),
       (8, 9, 'Fake profile', '2024-04-08 15:00:00+00'),
       (9, 10, 'Scamming', '2024-04-09 16:00:00+00'),
       (10, 1, 'Inappropriate behavior', '2024-04-10 17:00:00+00');
