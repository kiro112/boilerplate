CREATE DATABASE IF NOT EXISTS `db_name`;

USE `db_name`;

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
    `id`                CHAR(36)        PRIMARY KEY     NOT NULL,
    `username`          VARCHAR(64)     NOT NULL,
    `password`          VARCHAR(64)     NOT NULL,
    `created`           DATETIME        NOT NULL        DEFAULT CURRENT_TIMESTAMP,
    `updated`           DATETIME        NOT NULL        DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted`           DATETIME        NOT NULL        DEFAULT '0000-00-00 00:00:00',
    UNIQUE KEY `uniq_username`  (`username`, `deleted`)
) ENGINE = InnoDB DEFAULT CHARSET=utf8mb4;