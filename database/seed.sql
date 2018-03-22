INSERT INTO `user`
(id, username, password) VALUES
(uuid(), 'test', PASSWORD(CONCAT(MD5('secret'), 'C2H6O')));