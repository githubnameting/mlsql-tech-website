/*
 Navicat Premium Data Transfer

 Source Server         : M
 Source Server Type    : MySQL
 Source Server Version : 50735
 Source Host           : localhost:3306
 Source Schema         : mlsql_website

 Target Server Type    : MySQL
 Target Server Version : 50735
 File Encoding         : 65001

 Date: 27/09/2021 18:38:55
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for email_template
-- ----------------------------
CREATE TABLE IF NOT EXISTS  `email_template` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usage` varchar(255) DEFAULT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `content` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of email_template
-- ----------------------------
BEGIN;
INSERT IGNORE INTO `email_template` VALUES (1, 'reset_password_confirm', 'MLSQL LAB Password Reset Instructions', '您好，\n\n我们收到您的 MLSQL Lab 密码重置请求。如果您想要重置密码，请在您的浏览器中打开以下链接：\n\n%1$s/api/user/reset/%2$s\n\n链接有效期为30分钟。\n\nThanks,\nThe MLSQL Lab Team\n\n\n');
INSERT IGNORE INTO `email_template` VALUES (2, 'register_verify', '欢迎在线试用 MLSQL ，请验证您的邮箱', '您好，%1$s:\n     非常感谢您试用 MLSQL Lab，我们将带您体验一站式数据科学平台，在此之前，请点击下方链接验证您的邮箱。\n\n%2$s/api/user/verification/%3$s\n\n链接有效期为30分钟。\n\nThanks,\nThe MLSQL Lab Team\n\n\n');
COMMIT;

-- ----------------------------
-- Table structure for user_info
-- ----------------------------
CREATE TABLE IF NOT EXISTS  `user_info` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(256) NOT NULL,
  `password` varchar(256) NOT NULL,
  `company` varchar(256) NOT NULL,
  `telephone` varchar(256) NOT NULL,
  `email` varchar(256) NOT NULL,
  `is_verified` tinyint(1) NOT NULL,
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_name` (`name`),
  UNIQUE KEY `uniq_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user_info
-- ----------------------------
BEGIN;
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
