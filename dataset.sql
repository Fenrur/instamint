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
       (16, 'christ_david', '2024-01-10 00:00:00', 'Enjoy these as art, nothing more.', NULL,
        'https://api.dicebear.com/8.x/pixel-art/svg?seed=christ_david', TRUE, 'public', 'New York',
        'Christopher David');

INSERT INTO "User" ("id", "email", "hashedPassword", "isActivated", "twoFactorEnabled", "languageType", "role", "profileId", "enabledNotificationTypes", "twoFactorSecret")
VALUES (1, 'instaminttest+1@outlook.com', '$2a$12$Uxou41mTi/jxwoU3yeINDeMRftoG/glmHUvGavVRXOJjVIEeiTjWO', TRUE, FALSE, 'en', 'user', 1, '{"replies_comments", "mint"}', NULL),
-- PASSWORD: V5[tSp+k354/=}:J/u
       (2, 'instaminttest+2@outlook.com', '$2a$12$t6HtJgGogs9iTEFdh9VRc.HFO6RIWwm4eeqD4vwaU/vDVpaRmmUzy', TRUE, TRUE, 'fr', 'user', 2, '{"replies_comments", "mint"}', '5192b5b444977100fdb024d8f30648c2:e480af9a24ea7eacf6a28f714195ec41e7a56db13ba0d07d555ed46d5e99690a5be6f15580e83fa673915753f01be4ed'),
-- PASSWORD: ?#95,>7jYnJymy},]E
-- TOTP SECRET: G5TVEKDKEZ4UWUCJPVVEMCZYG4DD4ODJ
       (3, 'instaminttest+3@outlook.com', '$2a$12$w9cXcd2VIk5dgLE1ktNLyuzNPp1cJfUkih95ttdpEOeN9CcyO9wri', TRUE, FALSE, 'es', 'user', 3,'{"follow", "follow_request_accepted"}', NULL),
-- PASSWORD: 20Dl[FC4IAq%[rlJ8
       (4, 'instaminttest+4@outlook.com', '$2a$12$QbAsqcDOxe9PCiZe2rnUAeP/FhfXouBuV3/Vru5SdRPTcv3Mi95hK', TRUE, FALSE, 'en', 'admin', 4, '{"replies_comments"}', NULL),
-- PASSWORD: p5e5g?J,tL*Jcx1*h
       (5, 'instaminttest+5@outlook.com', '$2a$12$rwBzxh48Cvr8oeFmn178mORYGKRxJrNVG7k8RliDZwkIuQQ5HNsf2', TRUE, TRUE, 'fr', 'user', 5, '{"thread_comment", "follow"}', '93b8bf955b343631da0007aa22326322:29af8196c4cc5d1a8ba75aed6156880946ecd6bd9f5cb4d4f641663f409bf2ded542ad29b4a465fdf38493ce66cb5482'),
-- PASSWORD: )vs:7'8K2E<B.l9_+x
-- TOTP SECRET: G5QUIGLRBB7DAOLZHB4TKCD6FYATS7IE
       (6, 'instaminttest+6@outlook.com', '$2a$12$Hh3JR8I4PToRxSsGzVul.erhCMjvyvq7LXMB9P./M5VY47Y2iQTKC', TRUE, FALSE, 'es', 'user', 6, '{"mint"}', NULL),
-- PASSWORD: 6V0£8V<Z^8s:ZHs£d
       (7, 'instaminttest+7@outlook.com', '$2a$12$sM5K2T5IYgboP0Ru.t5QyuebKmjEx68o4jwZBJ7I1S0pTJUcmKLWy', TRUE, TRUE, 'en', 'user', 7, '{"replies_comments", "thread_comment"}', '901e44b579dd3e88cdcf40569a5eddd2:919985862d3ad3f7fafcce6c96c7e6df73d259b761d498ccab0c3fc698a980c3967c0bfbe0acf92692f8e7f7112ef1ef'),
-- PASSWORD: 7hOms98+3,#_=(R9k4
-- TOTP SECRET: ARCR2W2RMZ2GGLTPBU3FONBRHBNHQFJO
       (8, 'instaminttest+8@outlook.com', '$2a$12$bMdpGukNNNkkxlc/cCgQFumw9A2yUoYTB7s1m1gc4Wj5LtdQGy8IC', TRUE, FALSE, 'fr', 'user', 8, '{"replies_comments", "follow_request_accepted"}', NULL),
-- PASSWORD: 74,:az3%vD+IH3jHDU
       (9, 'instaminttest+9@outlook.com', '$2a$12$.nz.4nrYjUTTcyt7aiE3.uoZQsmPpAIq3l3A155OqqViEFf/90qE2', TRUE, FALSE, 'es', 'user', 9, '{"thread_comment", "follow"}', NULL),
-- PASSWORD: h8G6?87*£+7ae6srvp
       (10, 'instaminttest+10@outlook.com', '$2a$12$88CcZPjmX8ZY/qifYgEeZeMW756ojAAJ2jpN2bvrJyx8k9Z965AX2', TRUE, FALSE, 'en', 'user', 10, '{"replies_comments", "thread_comment", "mint", "follow", "follow_request_accepted"}', NULL);
-- PASSWORD: +b.4e8&OqP7CBso6?g
