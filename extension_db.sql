/*
 Navicat Premium Data Transfer

 Source Server         : test
 Source Server Type    : MySQL
 Source Server Version : 100413
 Source Host           : localhost:3306
 Source Schema         : extension_db

 Target Server Type    : MySQL
 Target Server Version : 100413
 File Encoding         : 65001

 Date: 12/11/2022 05:25:44
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for account_type
-- ----------------------------
DROP TABLE IF EXISTS `account_type`;
CREATE TABLE `account_type`  (
  `id` int(255) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(30) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT 'account_type name',
  `max_count` bigint(255) NOT NULL COMMENT 'level_up members',
  `level` int(255) NOT NULL COMMENT 'level of account',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 10 CHARACTER SET = utf8 COLLATE = utf8_bin ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of account_type
-- ----------------------------
INSERT INTO `account_type` VALUES (1, 'Mercury', 56, 1);
INSERT INTO `account_type` VALUES (2, 'Venus', 112, 2);
INSERT INTO `account_type` VALUES (3, 'Earth', 168, 3);
INSERT INTO `account_type` VALUES (4, 'Mars', 226, 4);
INSERT INTO `account_type` VALUES (5, 'Jupiter', 280, 5);
INSERT INTO `account_type` VALUES (6, 'Saturn', 356, 6);
INSERT INTO `account_type` VALUES (7, 'Uranus', 412, 7);
INSERT INTO `account_type` VALUES (8, 'Neptune', 468, 8);
INSERT INTO `account_type` VALUES (9, 'pluto', 524, 9);

-- ----------------------------
-- Table structure for connection
-- ----------------------------
DROP TABLE IF EXISTS `connection`;
CREATE TABLE `connection`  (
  `id` bigint(255) UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint(255) NOT NULL,
  `total_member` bigint(255) NULL DEFAULT NULL,
  `follow_id` bigint(255) NOT NULL,
  `create_at` datetime(0) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_bin ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for invite
-- ----------------------------
DROP TABLE IF EXISTS `invite`;
CREATE TABLE `invite`  (
  `id` bigint(255) UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint(255) NOT NULL,
  `email` varchar(50) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `is_accept` tinyint(1) NULL DEFAULT 0,
  `is_joined` tinyint(1) NULL DEFAULT 0,
  `create_at` datetime(0) NOT NULL,
  `hash` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL,
  `accept_at` datetime(0) NULL DEFAULT NULL,
  `joind_at` datetime(0) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_bin ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for notification
-- ----------------------------
DROP TABLE IF EXISTS `notification`;
CREATE TABLE `notification`  (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `text` text CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `link` varchar(200) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL,
  `category` tinyint(1) NULL DEFAULT NULL,
  `create_at` datetime(0) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_bin ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for progress
-- ----------------------------
DROP TABLE IF EXISTS `progress`;
CREATE TABLE `progress`  (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `project_id` bigint(20) NOT NULL,
  `budget` int(11) NOT NULL COMMENT 'amount of adding budget',
  `total_progress` int(11) NOT NULL COMMENT 'total amount of progressing',
  `create_at` datetime(0) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 11 CHARACTER SET = utf8 COLLATE = utf8_bin ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of progress
-- ----------------------------
INSERT INTO `progress` VALUES (3, 1, 3, 1, '0000-00-00 00:00:00');
INSERT INTO `progress` VALUES (4, 1, 3, 2, '0000-00-00 00:00:00');
INSERT INTO `progress` VALUES (5, 1, 3, 3, '0000-00-00 00:00:00');
INSERT INTO `progress` VALUES (6, 1, 3, 4, '0000-00-00 00:00:00');
INSERT INTO `progress` VALUES (7, 2, 4, 1, '0000-00-00 00:00:00');
INSERT INTO `progress` VALUES (8, 2, 4, 2, '0000-00-00 00:00:00');
INSERT INTO `progress` VALUES (9, 2, 4, 2, '0000-00-00 00:00:00');
INSERT INTO `progress` VALUES (10, 2, 4, 3, '0000-00-00 00:00:00');

-- ----------------------------
-- Table structure for projects
-- ----------------------------
DROP TABLE IF EXISTS `projects`;
CREATE TABLE `projects`  (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `description` text CHARACTER SET utf8 COLLATE utf8_bin NULL,
  `budget` int(11) NOT NULL COMMENT 'user suggest budget',
  `owner_id` bigint(20) NOT NULL,
  `allocate_budget` int(11) NULL DEFAULT 0 COMMENT 'admin set bedget finaly',
  `seted_date` datetime(0) NULL DEFAULT NULL COMMENT 'date that admin set budget',
  `create_at` datetime(0) NOT NULL,
  `publish_at` datetime(0) NULL DEFAULT NULL COMMENT 'date that project is published',
  `total_power` int(11) NOT NULL,
  `img_url` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8 COLLATE = utf8_bin ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of projects
-- ----------------------------
INSERT INTO `projects` VALUES (1, 'title', '2', 2, 1, 2, '2022-11-05 00:14:45', '2022-11-10 00:14:49', '2022-11-18 00:14:55', 2, '22');
INSERT INTO `projects` VALUES (2, 'title1', '2332', 4, 4, 44, '2022-11-15 04:50:40', '2022-11-17 04:50:43', '2022-11-23 04:50:46', 22, '11');

-- ----------------------------
-- Table structure for support_project
-- ----------------------------
DROP TABLE IF EXISTS `support_project`;
CREATE TABLE `support_project`  (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `project_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `total_support` bigint(20) NOT NULL DEFAULT 0 COMMENT 'acount of memeber supporting project',
  `create_at` datetime(0) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_bin ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for upgrade
-- ----------------------------
DROP TABLE IF EXISTS `upgrade`;
CREATE TABLE `upgrade`  (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL,
  `to_level_id` int(11) NOT NULL,
  `create_at` datetime(0) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_bin ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` bigint(255) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'id',
  `username` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `email` varchar(30) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL,
  `last_name` varchar(20) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL,
  `first_name` varchar(20) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL,
  `city` varchar(20) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL,
  `state` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL,
  `country` varchar(50) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL,
  `image_url` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL COMMENT 'img url',
  `create_at` date NULL DEFAULT NULL,
  `is_admin` tinyint(1) NOT NULL DEFAULT 0,
  `is_init` tinyint(1) NULL DEFAULT 0 COMMENT 'check if resiget profile',
  `account_type` int(255) NULL DEFAULT NULL COMMENT 'account_type',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_bin ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;
