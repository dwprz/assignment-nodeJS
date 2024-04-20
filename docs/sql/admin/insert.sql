SELECT * FROM admins;

INSERT INTO admins ("userName", password, role)
VALUES ('admin1', '$2a$10$Fra5j3hPIB8WHm3oB5touewucsUoGlAwMmZ9qMiH3KXjTXM0RcaCm', 'SUPER ADMIN'),
       ('admin2', '$2a$10$Fra5j3hPIB8WHm3oB5touewucsUoGlAwMmZ9qMiH3KXjTXM0RcaCm', 'ADMIN');
