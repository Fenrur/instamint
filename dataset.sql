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
        'Christopher David'),
       (12, 'k_mbappe', '2017-01-10 00:00:00', 'PSG & France', 'https://www.psg.fr/', '/mbappe.jpg', TRUE, 'public',
        'Paris', 'Kylian Mbappé');

DO
$$
  DECLARE
    sequence_name TEXT;
  BEGIN
    SELECT pg_get_serial_sequence('"Profile"', 'id') INTO sequence_name;
    EXECUTE 'SELECT setval(' || quote_literal(sequence_name) || ', (SELECT MAX(id) FROM "Profile") + 1)';
  END
$$;


INSERT INTO "User" ("id", "email", "hashedPassword", "isActivated", "twoFactorEnabled", "languageType", "role",
                    "profileId", "enabledNotificationTypes", "twoFactorSecret")
VALUES (1, 'instaminttest+1@outlook.com', '$2a$12$Uxou41mTi/jxwoU3yeINDeMRftoG/glmHUvGavVRXOJjVIEeiTjWO', TRUE, FALSE,
        'en', 'user', 1, '{"replies_comments", "mint"}', NULL),
-- PASSWORD: V5[tSp+k354/=}:J/u
       (2, 'instaminttest+2@outlook.com', '$2a$12$t6HtJgGogs9iTEFdh9VRc.HFO6RIWwm4eeqD4vwaU/vDVpaRmmUzy', TRUE, TRUE,
        'fr', 'user', 2, '{"replies_comments", "mint"}',
        '5192b5b444977100fdb024d8f30648c2:e480af9a24ea7eacf6a28f714195ec41e7a56db13ba0d07d555ed46d5e99690a5be6f15580e83fa673915753f01be4ed'),
-- PASSWORD: ?#95,>7jYnJymy},]E
-- TOTP SECRET: G5TVEKDKEZ4UWUCJPVVEMCZYG4DD4ODJ
       (3, 'instaminttest+3@outlook.com', '$2a$12$w9cXcd2VIk5dgLE1ktNLyuzNPp1cJfUkih95ttdpEOeN9CcyO9wri', TRUE, FALSE,
        'es', 'user', 3, '{"follow", "follow_request_accepted"}', NULL),
-- PASSWORD: 20Dl[FC4IAq%[rlJ8
       (4, 'instaminttest+4@outlook.com', '$2a$12$QbAsqcDOxe9PCiZe2rnUAeP/FhfXouBuV3/Vru5SdRPTcv3Mi95hK', TRUE, FALSE,
        'en', 'admin', 4, '{"replies_comments"}', NULL),
-- PASSWORD: p5e5g?J,tL*Jcx1*h
       (5, 'instaminttest+5@outlook.com', '$2a$12$rwBzxh48Cvr8oeFmn178mORYGKRxJrNVG7k8RliDZwkIuQQ5HNsf2', TRUE, TRUE,
        'fr', 'user', 5, '{"thread_comment", "follow"}',
        '93b8bf955b343631da0007aa22326322:29af8196c4cc5d1a8ba75aed6156880946ecd6bd9f5cb4d4f641663f409bf2ded542ad29b4a465fdf38493ce66cb5482'),
-- PASSWORD: )vs:7'8K2E<B.l9_+x
-- TOTP SECRET: G5QUIGLRBB7DAOLZHB4TKCD6FYATS7IE
       (6, 'instaminttest+6@outlook.com', '$2a$12$Hh3JR8I4PToRxSsGzVul.erhCMjvyvq7LXMB9P./M5VY47Y2iQTKC', TRUE, FALSE,
        'es', 'user', 6, '{"mint"}', NULL),
-- PASSWORD: 6V0£8V<Z^8s:ZHs£d
       (7, 'instaminttest+7@outlook.com', '$2a$12$sM5K2T5IYgboP0Ru.t5QyuebKmjEx68o4jwZBJ7I1S0pTJUcmKLWy', TRUE, TRUE,
        'en', 'user', 7, '{"replies_comments", "thread_comment"}',
        '901e44b579dd3e88cdcf40569a5eddd2:919985862d3ad3f7fafcce6c96c7e6df73d259b761d498ccab0c3fc698a980c3967c0bfbe0acf92692f8e7f7112ef1ef'),
-- PASSWORD: 7hOms98+3,#_=(R9k4
-- TOTP SECRET: ARCR2W2RMZ2GGLTPBU3FONBRHBNHQFJO
       (8, 'instaminttest+8@outlook.com', '$2a$12$bMdpGukNNNkkxlc/cCgQFumw9A2yUoYTB7s1m1gc4Wj5LtdQGy8IC', TRUE, FALSE,
        'fr', 'user', 8, '{"replies_comments", "follow_request_accepted"}', NULL),
-- PASSWORD: 74,:az3%vD+IH3jHDU
       (9, 'instaminttest+9@outlook.com', '$2a$12$.nz.4nrYjUTTcyt7aiE3.uoZQsmPpAIq3l3A155OqqViEFf/90qE2', TRUE, FALSE,
        'es', 'user', 9, '{"thread_comment", "follow"}', NULL),
-- PASSWORD: h8G6?87*£+7ae6srvp
       (10, 'instaminttest+10@outlook.com', '$2a$12$88CcZPjmX8ZY/qifYgEeZeMW756ojAAJ2jpN2bvrJyx8k9Z965AX2', TRUE, FALSE,
        'en', 'user', 10, '{"replies_comments", "thread_comment", "mint", "follow", "follow_request_accepted"}', NULL);
-- PASSWORD: +b.4e8&OqP7CBso6?g

DO
$$
  DECLARE
    sequence_name TEXT;
  BEGIN
    SELECT pg_get_serial_sequence('"User"', 'id') INTO sequence_name;
    EXECUTE 'SELECT setval(' || quote_literal(sequence_name) || ', (SELECT MAX(id) FROM "User") + 1)';
  END
$$;


INSERT INTO "Nft" ("id", "ownerUserId", "showOnProfileId", "title", "description", "location", "price", "currencyType",
                   "contentUrl", "postedAt", "type")
VALUES (1, 1, 12, 'test', 'coucou', 'France, Paris', 1, 'eur',
        'https://dl.openseauserdata.com/cache/originImage/files/eee083e63934370a740ecc2d56968389.png',
        '2024-01-01 00:00:00', 'image'),
       (2, 1, 12, 'test', 'coucou', 'France, Paris', 1, 'eur',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Donald_Trump_official_portrait.jpg/220px-Donald_Trump_official_portrait.jpg',
        '2024-01-02 00:00:00', 'image'),
       (3, 1, 12, 'test', 'coucou', 'France, Paris', 1, 'eur',
        'https://raw.seadn.io/files/d46a08251988b448ea2e039894ef9cdf.svg', '2024-01-03 00:00:00', 'image'),
       (4, 1, 12, 'test', 'coucou', 'France, Paris', 1, 'eur',
        'https://dl.openseauserdata.com/cache/originImage/files/92fc4711ddaa3900be427aae7fe1a432.png',
        '2024-01-04 00:00:00', 'image'),
       (5, 1, 12, 'test', 'coucou', 'France, Paris', 1, 'eur',
        'https://raw.seadn.io/files/4c470e00718aea29c5dca586b342ec0f.gif', '2024-01-05 00:00:00', 'image'),
       (6, 1, 12, 'test', 'coucou', 'France, Paris', 1, 'eur',
        'https://raw.seadn.io/files/484e278e570694c368ce4c41a6641488.png', '2024-01-06 00:00:00', 'image'),
       (7, 1, 12, 'test', 'coucou', 'France, Paris', 1, 'eur',
        'https://dl.openseauserdata.com/cache/originImage/files/c07eef18a62227221beb08f5175aab0a.jpg',
        '2024-01-07 00:00:00', 'image'),
       (8, 1, 12, 'test', 'coucou', 'France, Paris', 1, 'eur',
        'https://raw.seadn.io/files/be199935653af8169a748075f88c53d1.jpg', '2024-01-09 00:00:00', 'image'),
       (9, 1, 12, 'test', 'coucou', 'France, Paris', 1, 'eur',
        'https://raw.seadn.io/files/dcad9c430e76a028e1cd9d35ee65edf3.jpg', '2024-01-10 00:00:00', 'image'),
       (10, 1, 12, 'test', 'coucou', 'France, Paris', 1, 'eur',
        'https://raw.seadn.io/files/e290a34a6d1894521f766be9f42bb308.jpg', '2024-01-11 00:00:00', 'image'),
       (11, 1, 12, 'test', 'coucou', 'France, Paris', 1, 'eur',
        'https://raw.seadn.io/files/294275029b4bc4d27027e818cb0d646d.jpg', '2024-01-12 00:00:00', 'image'),
       (12, 1, 12, 'test', 'coucou', 'France, Paris', 1, 'eur',
        'https://raw.seadn.io/files/8cf43cdf041ab6c7109c4258d4966b7d.jpg', '2024-01-13 00:00:00', 'image'),
       (13, 1, 12, 'test', 'coucou', 'France, Paris', 1, 'eur',
        'https://raw.seadn.io/files/4534d1da13b1480dbc60f898e9088709.jpg', '2024-01-14 00:00:00', 'image'),
       (14, 1, 12, 'test', 'coucou', 'France, Paris', 1, 'eur',
        'https://raw.seadn.io/files/1f6475cfe20222d796f35d9467f07747.jpg', '2024-01-15 00:00:00', 'image'),
       (15, 1, 12, 'test', 'coucou', 'France, Paris', 1, 'eur',
        'https://raw.seadn.io/files/a659de4d357a271da08422e108e8883b.jpg', '2024-01-16 00:00:00', 'image'),

       (16, 1, 12, 'test', 'coucou', 'France, Paris', 1, 'eur',
        'https://dl.openseauserdata.com/cache/originImage/files/27e343594e358a1fd3d1311c5120269b.png',
        '2024-01-01 00:00:00', 'image'),
       (17, 1, 12, 'test', 'coucou', 'France, Paris', 1, 'eur',
        'https://dl.openseauserdata.com/cache/originImage/files/0f668e225849de25413a1b41f6e21018.png',
        '2024-01-02 00:00:00', 'image'),
       (18, 1, 12, 'test', 'coucou', 'France, Paris', 1, 'eur',
        'https://raw.seadn.io/files/2e44a91fe88e2ce21af0397c98290125.png', '2024-01-03 00:00:00', 'image'),
       (19, 1, 12, 'test', 'coucou', 'France, Paris', 1, 'eur',
        'https://raw.seadn.io/files/797e499bfe5e06889ae4644bcfe0ba15.png',
        '2024-01-04 00:00:00', 'image'),
       (20, 1, 12, 'test', 'coucou', 'France, Paris', 1, 'eur',
        'https://raw.seadn.io/files/0d215c4168635c2e8c03bd465cbd1ac4.png', '2024-01-05 00:00:00', 'image'),
       (21, 1, 12, 'test', 'coucou', 'France, Paris', 1, 'eur',
        'https://raw.seadn.io/files/0331c00739bd807300f5baad27890a6e.png', '2024-01-06 00:00:00', 'image'),
       (22, 1, 12, 'test', 'coucou', 'France, Paris', 1, 'eur',
        'https://raw.seadn.io/files/0c0f9ed14af8a3c792b619cda17c66a2.png',
        '2024-01-07 00:00:00', 'image'),
       (23, 1, 12, 'test', 'coucou', 'France, Paris', 1, 'eur',
        'https://raw.seadn.io/files/ce129c0003ba80e3e2657bea3090d581.png', '2024-01-09 00:00:00', 'image'),
       (24, 1, 12, 'test', 'coucou', 'France, Paris', 1, 'eur',
        'https://raw.seadn.io/files/297a215d1634f5ebb00c5ba0be21f90b.png', '2024-01-10 00:00:00', 'image'),
       (25, 1, 12, 'test', 'coucou', 'France, Paris', 1, 'eur',
        'https://dl.openseauserdata.com/cache/originImage/files/2a00a34bd2e96a64d88fdc7621f0c0d8.png', '2024-01-11 00:00:00', 'image'),
       (26, 1, 12, 'test', 'coucou', 'France, Paris', 1, 'eur',
        'https://dl.openseauserdata.com/cache/originImage/files/e1c1b03ef07fc776a093ac7e860499e6.png', '2024-01-12 00:00:00', 'image'),
       (27, 1, 12, 'test', 'coucou', 'France, Paris', 1, 'eur',
        'https://dl.openseauserdata.com/cache/originImage/files/7dc691a2f28455afa62bdc194fdf9630.png', '2024-01-13 00:00:00', 'image'),
       (28, 1, 12, 'test', 'coucou', 'France, Paris', 1, 'eur',
        'https://dl.openseauserdata.com/cache/originImage/files/7474335b48ef8db98ab20cdb72ec2d17.png', '2024-01-14 00:00:00', 'image'),
       (29, 1, 12, 'test', 'coucou', 'France, Paris', 1, 'eur',
        'https://dl.openseauserdata.com/cache/originImage/files/efca725988e7979b30b1e7b4e6a2fb21.png', '2024-01-15 00:00:00', 'image'),
       (30, 1, 12, 'test', 'coucou', 'France, Paris', 1, 'eur',
        'https://dl.openseauserdata.com/cache/originImage/files/8c4931b4305827060e5b6864c2bb32d8.png', '2024-01-16 00:00:00', 'image');

DO
$$
  DECLARE
    sequence_name TEXT;
  BEGIN
    SELECT pg_get_serial_sequence('"Nft"', 'id') INTO sequence_name;
    EXECUTE 'SELECT setval(' || quote_literal(sequence_name) || ', (SELECT MAX(id) FROM "Nft") + 1)';
  END
$$;


INSERT INTO "Follow" ("followerProfileId", "followedProfileId", "followAt")
VALUES (1, 12, '2024-01-01 00:00:00'),
       (2, 12, '2024-01-02 00:00:00'),
       (3, 12, '2024-01-03 00:00:00'),
       (4, 12, '2024-01-04 00:00:00'),
       (5, 12, '2024-01-05 00:00:00'),
       (6, 12, '2024-01-06 00:00:00'),
       (7, 12, '2024-01-07 00:00:00'),
       (8, 12, '2024-01-08 00:00:00'),
       (9, 12, '2024-01-09 00:00:00'),
       (10, 12, '2024-01-10 00:00:00'),
       (12, 1, '2017-01-10 00:00:00'),
       (12, 2, '2017-01-10 00:00:00'),
       (12, 3, '2017-01-10 00:00:00');

INSERT INTO "Mint" ("nftId", "profileId", "mintAt")
VALUES (15, 1, '2024-01-01 00:00:00'),
       (15, 2, '2024-01-02 00:00:00'),
       (15, 3, '2024-01-03 00:00:00'),
       (15, 4, '2024-01-04 00:00:00'),
       (15, 5, '2024-01-05 00:00:00'),
       (15, 6, '2024-01-06 00:00:00'),
       (15, 7, '2024-01-07 00:00:00'),
       (15, 8, '2024-01-08 00:00:00'),
       (15, 9, '2024-01-09 00:00:00'),
       (15, 10, '2024-01-10 00:00:00'),
       (15, 11, '2024-01-11 00:00:00'),
       (15, 12, '2024-01-12 00:00:00');
