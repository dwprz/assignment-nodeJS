SELECT * FROM users;

SELECT * FROM "userFollows";

INSERT INTO "userFollows" (follower, following)
VALUES ('johndoe1', 'johndoe2'),
       ('johndoe1', 'johndoe3'),
       ('johndoe1', 'johndoe4'),
       ('johndoe2', 'johndoe1'),
       ('johndoe2', 'johndoe3'),
       ('johndoe2', 'johndoe4'),
       ('johndoe3', 'johndoe1'),
       ('johndoe3', 'johndoe2'),
       ('johndoe3', 'johndoe4'),
       ('johndoe4', 'johndoe1'),
       ('johndoe4', 'johndoe2'),
       ('johndoe4', 'johndoe3');