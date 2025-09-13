-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Sep 13, 2025 at 08:21 PM
-- Server version: 9.1.0
-- PHP Version: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `web_analytics`
--

-- --------------------------------------------------------

--
-- Table structure for table `click_events`
--

DROP TABLE IF EXISTS `click_events`;
CREATE TABLE IF NOT EXISTS `click_events` (
  `id` int NOT NULL AUTO_INCREMENT,
  `session_id` varchar(36) DEFAULT NULL,
  `page_view_id` int DEFAULT NULL,
  `element_type` varchar(50) DEFAULT NULL,
  `element_id` varchar(255) DEFAULT NULL,
  `element_class` varchar(255) DEFAULT NULL,
  `element_text` text,
  `x_position` int DEFAULT NULL,
  `y_position` int DEFAULT NULL,
  `viewport_x` int DEFAULT NULL,
  `viewport_y` int DEFAULT NULL,
  `timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `page_view_id` (`page_view_id`),
  KEY `idx_session_id` (`session_id`),
  KEY `idx_timestamp` (`timestamp`)
) ENGINE=MyISAM AUTO_INCREMENT=143 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `click_events`
--

INSERT INTO `click_events` (`id`, `session_id`, `page_view_id`, `element_type`, `element_id`, `element_class`, `element_text`, `x_position`, `y_position`, `viewport_x`, `viewport_y`, `timestamp`) VALUES
(1, '225e4277-a405-40d5-8caa-34c5b1a31452', 1, 'A', '', 'banner-ad-cta', 'Shop Now', 1220, 1112, 1220, 212, '2025-09-12 19:56:43'),
(2, '225e4277-a405-40d5-8caa-34c5b1a31452', 1, 'H2', '', '', 'Featured Products', 371, 526, 371, 326, '2025-09-12 19:57:00'),
(3, '225e4277-a405-40d5-8caa-34c5b1a31452', 1, 'DIV', '', 'product-image', '💻', 368, 654, 368, 454, '2025-09-12 19:57:00'),
(4, '225e4277-a405-40d5-8caa-34c5b1a31452', 1, 'DIV', '', 'product-image', '📱', 765, 682, 765, 482, '2025-09-12 19:57:01'),
(5, '225e4277-a405-40d5-8caa-34c5b1a31452', 1, 'DIV', '', 'product-image', '🎧', 1152, 667, 1152, 467, '2025-09-12 19:57:02'),
(6, '225e4277-a405-40d5-8caa-34c5b1a31452', 1, 'A', '', '', 'Products', 834, 134, 834, 44, '2025-09-12 19:57:15'),
(7, '225e4277-a405-40d5-8caa-34c5b1a31452', 2, 'SELECT', 'category-filter', '', '\n                    All Categories\n                    Computers\n                    Phones\n       ', 653, 251, 653, 251, '2025-09-12 19:57:17'),
(8, '225e4277-a405-40d5-8caa-34c5b1a31452', 2, 'SELECT', 'category-filter', '', '\n                    All Categories\n                    Computers\n                    Phones\n       ', 176, 235, 176, 235, '2025-09-12 19:57:18'),
(9, '225e4277-a405-40d5-8caa-34c5b1a31452', 2, 'SELECT', 'category-filter', '', '\n                    All Categories\n                    Computers\n                    Phones\n       ', 544, 258, 544, 158, '2025-09-12 19:57:19'),
(10, '225e4277-a405-40d5-8caa-34c5b1a31452', 2, 'SELECT', 'category-filter', '', '\n                    All Categories\n                    Computers\n                    Phones\n       ', 176, 235, 176, 135, '2025-09-12 19:57:20'),
(11, '225e4277-a405-40d5-8caa-34c5b1a31452', 2, 'SELECT', 'category-filter', '', '\n                    All Categories\n                    Computers\n                    Phones\n       ', 500, 258, 500, 158, '2025-09-12 19:57:21'),
(12, '225e4277-a405-40d5-8caa-34c5b1a31452', 2, 'SELECT', 'category-filter', '', '\n                    All Categories\n                    Computers\n                    Phones\n       ', 176, 235, 176, 135, '2025-09-12 19:57:23'),
(13, '225e4277-a405-40d5-8caa-34c5b1a31452', 2, 'SELECT', 'category-filter', '', '\n                    All Categories\n                    Computers\n                    Phones\n       ', 648, 254, 648, 154, '2025-09-12 19:57:24'),
(14, '225e4277-a405-40d5-8caa-34c5b1a31452', 2, 'SELECT', 'category-filter', '', '\n                    All Categories\n                    Computers\n                    Phones\n       ', 176, 235, 176, 135, '2025-09-12 19:57:26'),
(15, '225e4277-a405-40d5-8caa-34c5b1a31452', 2, 'DIV', '', 'product-image', '🖥️', 496, 417, 496, 417, '2025-09-12 19:57:40'),
(16, '225e4277-a405-40d5-8caa-34c5b1a31452', 2, 'DIV', '', 'product-image', '📱', 841, 422, 841, 422, '2025-09-12 19:57:40'),
(17, '225e4277-a405-40d5-8caa-34c5b1a31452', 2, 'DIV', '', 'product-image', '⌨️', 384, 908, 384, 408, '2025-09-12 19:57:42'),
(18, '225e4277-a405-40d5-8caa-34c5b1a31452', 2, 'DIV', '', 'product-image', '🎮', 825, 918, 825, 418, '2025-09-12 19:57:43'),
(19, '225e4277-a405-40d5-8caa-34c5b1a31452', 2, 'DIV', '', 'product-image', '🖱️', 377, 1358, 377, 458, '2025-09-12 19:57:45'),
(20, '225e4277-a405-40d5-8caa-34c5b1a31452', 2, 'DIV', '', 'product-image', '📷', 808, 1351, 808, 351, '2025-09-12 19:57:47'),
(21, '225e4277-a405-40d5-8caa-34c5b1a31452', 2, 'P', '', 'product-price', '$2,499', 206, 624, 206, 224, '2025-09-12 19:58:01'),
(22, '225e4277-a405-40d5-8caa-34c5b1a31452', 2, 'P', '', 'product-price', '$2,499', 309, 636, 309, 236, '2025-09-12 19:58:02'),
(23, '225e4277-a405-40d5-8caa-34c5b1a31452', 2, 'P', '', 'product-price', '$2,499', 289, 618, 289, 218, '2025-09-12 19:58:03'),
(24, '225e4277-a405-40d5-8caa-34c5b1a31452', 2, 'P', '', 'product-price', '$799', 700, 626, 700, 226, '2025-09-12 19:58:06'),
(25, '225e4277-a405-40d5-8caa-34c5b1a31452', 2, 'P', '', 'product-price', '$799', 702, 631, 702, 231, '2025-09-12 19:58:07'),
(26, '225e4277-a405-40d5-8caa-34c5b1a31452', 2, 'P', '', 'product-price', '$799', 702, 631, 702, 231, '2025-09-12 19:58:08'),
(27, '225e4277-a405-40d5-8caa-34c5b1a31452', 2, 'P', '', 'product-price', '$499', 692, 1081, 692, 581, '2025-09-12 19:58:12'),
(28, '225e4277-a405-40d5-8caa-34c5b1a31452', 2, 'P', '', 'product-price', '$149', 235, 1081, 235, 581, '2025-09-12 19:58:15'),
(29, '225e4277-a405-40d5-8caa-34c5b1a31452', 2, 'INPUT', 'sidebar-newsletter-email', '', '', 1228, 525, 1228, 325, '2025-09-12 19:58:36'),
(30, '225e4277-a405-40d5-8caa-34c5b1a31452', 2, 'INPUT', 'sidebar-newsletter-email', '', '', 1228, 525, 1228, 325, '2025-09-12 19:58:42'),
(31, '225e4277-a405-40d5-8caa-34c5b1a31452', 2, 'DIV', 'products', 'page active', '\n        \n            All Products\n            \n            \n                Filter by Category:\n   ', 1363, 550, 1363, 350, '2025-09-12 19:58:43'),
(32, '225e4277-a405-40d5-8caa-34c5b1a31452', 2, 'A', '', '', 'About', 957, 242, 957, 42, '2025-09-12 19:58:46'),
(33, '8129d11d-53fe-4825-909b-2eb1ccc196e6', 4, 'A', '', 'btn', 'Shop Now', 805, 368, 805, 368, '2025-09-12 20:00:42'),
(34, '8129d11d-53fe-4825-909b-2eb1ccc196e6', 5, 'BUTTON', '', 'btn btn-primary', 'Add to Cart', 285, 712, 285, 512, '2025-09-12 20:00:46'),
(35, '8129d11d-53fe-4825-909b-2eb1ccc196e6', 5, 'BUTTON', '', 'btn btn-primary', 'Add to Cart', 720, 706, 720, 306, '2025-09-12 20:00:47'),
(36, '8129d11d-53fe-4825-909b-2eb1ccc196e6', 5, 'BUTTON', '', 'btn btn-primary', 'Add to Cart', 312, 1176, 312, 476, '2025-09-12 20:00:48'),
(37, '8129d11d-53fe-4825-909b-2eb1ccc196e6', 5, 'BUTTON', '', 'btn btn-primary', 'Add to Cart', 746, 1174, 746, 474, '2025-09-12 20:00:48'),
(38, '8129d11d-53fe-4825-909b-2eb1ccc196e6', 5, 'BUTTON', '', 'btn btn-primary', 'Add to Cart', 307, 1648, 307, 548, '2025-09-12 20:00:50'),
(39, '8129d11d-53fe-4825-909b-2eb1ccc196e6', 5, 'A', '', '', 'Cart 5', 1260, 859, 1260, 59, '2025-09-12 20:00:57'),
(40, '8129d11d-53fe-4825-909b-2eb1ccc196e6', 6, 'BUTTON', '', 'btn btn-primary', 'Proceed to Checkout', 861, 774, 861, 474, '2025-09-12 20:01:02'),
(41, '8129d11d-53fe-4825-909b-2eb1ccc196e6', 6, 'BUTTON', '', 'btn', 'Close', 562, 711, 562, 411, '2025-09-12 20:01:03'),
(42, '8129d11d-53fe-4825-909b-2eb1ccc196e6', 6, 'BUTTON', '', 'btn btn-primary', 'Proceed to Checkout', 670, 775, 670, 475, '2025-09-12 20:01:04'),
(43, '8129d11d-53fe-4825-909b-2eb1ccc196e6', 6, 'BUTTON', '', 'btn', 'Close', 588, 706, 588, 406, '2025-09-12 20:01:05'),
(44, '8129d11d-53fe-4825-909b-2eb1ccc196e6', 6, 'BUTTON', '', 'btn btn-primary', 'Proceed to Checkout', 744, 771, 744, 471, '2025-09-12 20:01:06'),
(45, '8129d11d-53fe-4825-909b-2eb1ccc196e6', 6, 'BUTTON', '', 'btn', 'Close', 595, 690, 595, 390, '2025-09-12 20:01:07'),
(46, '8129d11d-53fe-4825-909b-2eb1ccc196e6', 6, 'BUTTON', '', 'btn btn-primary', 'Proceed to Checkout', 716, 787, 716, 487, '2025-09-12 20:01:07'),
(47, '8129d11d-53fe-4825-909b-2eb1ccc196e6', 6, 'BUTTON', '', 'btn', 'Close', 594, 709, 594, 409, '2025-09-12 20:01:08'),
(48, '8129d11d-53fe-4825-909b-2eb1ccc196e6', 6, 'BUTTON', '', 'btn btn-primary', 'Proceed to Checkout', 732, 795, 732, 495, '2025-09-12 20:01:09'),
(49, '8129d11d-53fe-4825-909b-2eb1ccc196e6', 6, 'BUTTON', '', 'btn', 'Close', 595, 702, 595, 402, '2025-09-12 20:01:10'),
(50, '8129d11d-53fe-4825-909b-2eb1ccc196e6', 6, 'BUTTON', '', 'btn', 'Remove', 1223, 552, 1223, 352, '2025-09-12 20:01:12'),
(51, '8129d11d-53fe-4825-909b-2eb1ccc196e6', 6, 'BUTTON', '', 'btn', 'Remove', 1261, 488, 1261, 288, '2025-09-12 20:01:12'),
(52, '8129d11d-53fe-4825-909b-2eb1ccc196e6', 6, 'BUTTON', '', 'btn', 'Remove', 1261, 398, 1261, 198, '2025-09-12 20:01:13'),
(53, '8129d11d-53fe-4825-909b-2eb1ccc196e6', 6, 'BUTTON', '', 'btn', 'Remove', 1260, 334, 1260, 134, '2025-09-12 20:01:13'),
(54, '8129d11d-53fe-4825-909b-2eb1ccc196e6', 6, 'BUTTON', '', 'btn', 'Remove', 1248, 263, 1248, 263, '2025-09-12 20:01:14'),
(55, '8129d11d-53fe-4825-909b-2eb1ccc196e6', 6, 'A', '', 'logo', '🚀 TechStore', 276, 43, 276, 43, '2025-09-12 20:01:15'),
(56, '150ac7b1-2d32-4647-b03f-db7fa88e1ddd', 8, 'A', '', '', 'Contact', 1056, 44, 1056, 44, '2025-09-12 20:02:23'),
(57, '150ac7b1-2d32-4647-b03f-db7fa88e1ddd', 9, 'INPUT', 'contact-name', '', '', 587, 265, 587, 265, '2025-09-12 20:02:28'),
(58, '150ac7b1-2d32-4647-b03f-db7fa88e1ddd', 9, 'INPUT', 'contact-email', '', '', 473, 342, 473, 342, '2025-09-12 20:02:32'),
(59, '150ac7b1-2d32-4647-b03f-db7fa88e1ddd', 9, 'FORM', 'contactForm', '', '\n                    \n                        Full Name *\n                        \n                 ', 992, 403, 992, 403, '2025-09-12 20:02:41'),
(60, '150ac7b1-2d32-4647-b03f-db7fa88e1ddd', 9, 'INPUT', 'contact-phone', '', '', 645, 471, 645, 471, '2025-09-12 20:02:42'),
(61, '150ac7b1-2d32-4647-b03f-db7fa88e1ddd', 9, 'INPUT', 'contact-email', '', '', 645, 366, 645, 366, '2025-09-12 20:02:43'),
(62, '150ac7b1-2d32-4647-b03f-db7fa88e1ddd', 9, 'LABEL', '', '', 'Phone Number', 853, 414, 853, 414, '2025-09-12 20:02:46'),
(63, '150ac7b1-2d32-4647-b03f-db7fa88e1ddd', 9, 'INPUT', 'contact-phone', '', '', 853, 414, 853, 414, '2025-09-12 20:02:46'),
(64, '150ac7b1-2d32-4647-b03f-db7fa88e1ddd', 9, 'INPUT', 'contact-email', '', '', 771, 369, 771, 369, '2025-09-12 20:02:46'),
(65, '150ac7b1-2d32-4647-b03f-db7fa88e1ddd', 9, 'DIV', '', 'container', '\n            Contact Us\n            \n            \n                \n                    \n            ', 448, 356, 448, 356, '2025-09-12 20:02:50'),
(66, '150ac7b1-2d32-4647-b03f-db7fa88e1ddd', 9, 'INPUT', 'contact-phone', '', '', 581, 449, 581, 449, '2025-09-12 20:02:53'),
(67, '150ac7b1-2d32-4647-b03f-db7fa88e1ddd', 9, 'SELECT', 'contact-subject', '', '\n                            Select a subject\n                            General Inquiry\n          ', 554, 556, 554, 356, '2025-09-12 20:03:02'),
(68, '150ac7b1-2d32-4647-b03f-db7fa88e1ddd', 9, 'SELECT', 'contact-subject', '', '\n                            Select a subject\n                            General Inquiry\n          ', 456, 544, 456, 344, '2025-09-12 20:03:03'),
(69, '150ac7b1-2d32-4647-b03f-db7fa88e1ddd', 9, 'SELECT', 'contact-subject', '', '\n                            Select a subject\n                            General Inquiry\n          ', 533, 577, 533, 377, '2025-09-12 20:03:04'),
(70, '150ac7b1-2d32-4647-b03f-db7fa88e1ddd', 9, 'SELECT', 'contact-subject', '', '\n                            Select a subject\n                            General Inquiry\n          ', 456, 544, 456, 344, '2025-09-12 20:03:05'),
(71, '150ac7b1-2d32-4647-b03f-db7fa88e1ddd', 9, 'SELECT', 'contact-subject', '', '\n                            Select a subject\n                            General Inquiry\n          ', 553, 577, 553, 377, '2025-09-12 20:03:05'),
(72, '150ac7b1-2d32-4647-b03f-db7fa88e1ddd', 9, 'SELECT', 'contact-subject', '', '\n                            Select a subject\n                            General Inquiry\n          ', 456, 544, 456, 344, '2025-09-12 20:03:06'),
(73, '150ac7b1-2d32-4647-b03f-db7fa88e1ddd', 9, 'SELECT', 'contact-subject', '', '\n                            Select a subject\n                            General Inquiry\n          ', 561, 579, 561, 379, '2025-09-12 20:03:07'),
(74, '150ac7b1-2d32-4647-b03f-db7fa88e1ddd', 9, 'SELECT', 'contact-subject', '', '\n                            Select a subject\n                            General Inquiry\n          ', 456, 544, 456, 344, '2025-09-12 20:03:09'),
(75, '150ac7b1-2d32-4647-b03f-db7fa88e1ddd', 9, 'TEXTAREA', 'contact-message', '', '', 565, 799, 565, 399, '2025-09-12 20:03:18'),
(76, '150ac7b1-2d32-4647-b03f-db7fa88e1ddd', 9, 'SELECT', 'contact-subject', '', '\n                            Select a subject\n                            General Inquiry\n          ', 563, 575, 563, 175, '2025-09-12 20:05:27'),
(77, '150ac7b1-2d32-4647-b03f-db7fa88e1ddd', 9, 'SELECT', 'contact-subject', '', '\n                            Select a subject\n                            General Inquiry\n          ', 456, 544, 456, 144, '2025-09-12 20:06:19'),
(78, '150ac7b1-2d32-4647-b03f-db7fa88e1ddd', 9, 'INPUT', '', '', '', 761, 919, 761, 419, '2025-09-12 20:06:22'),
(79, '150ac7b1-2d32-4647-b03f-db7fa88e1ddd', 9, 'INPUT', '', '', '', 762, 919, 762, 419, '2025-09-12 20:06:25'),
(80, '150ac7b1-2d32-4647-b03f-db7fa88e1ddd', 9, 'INPUT', '', '', '', 762, 919, 762, 419, '2025-09-12 20:06:27'),
(81, '150ac7b1-2d32-4647-b03f-db7fa88e1ddd', 9, 'INPUT', '', '', '', 762, 919, 762, 419, '2025-09-12 20:06:28'),
(82, '150ac7b1-2d32-4647-b03f-db7fa88e1ddd', 9, 'INPUT', '', '', '', 762, 919, 762, 419, '2025-09-12 20:06:29'),
(83, '150ac7b1-2d32-4647-b03f-db7fa88e1ddd', 9, 'INPUT', '', '', '', 762, 919, 762, 419, '2025-09-12 20:06:30'),
(84, '150ac7b1-2d32-4647-b03f-db7fa88e1ddd', 9, 'BUTTON', '', 'btn btn-primary', 'Send Message', 616, 1072, 616, 572, '2025-09-12 20:06:42'),
(85, '150ac7b1-2d32-4647-b03f-db7fa88e1ddd', 9, 'SELECT', 'contact-priority', '', '\n                            Low\n                            Medium\n                            High', 700, 674, 700, 474, '2025-09-12 20:06:58'),
(86, '150ac7b1-2d32-4647-b03f-db7fa88e1ddd', 9, 'SELECT', 'contact-priority', '', '\n                            Low\n                            Medium\n                            High', 700, 674, 700, 474, '2025-09-12 20:06:59'),
(87, '150ac7b1-2d32-4647-b03f-db7fa88e1ddd', 9, 'TEXTAREA', 'contact-message', '', '', 812, 842, 812, 642, '2025-09-12 20:07:00'),
(88, '150ac7b1-2d32-4647-b03f-db7fa88e1ddd', 9, 'SELECT', 'contact-subject', '', '\n                            Select a subject\n                            General Inquiry\n          ', 990, 562, 990, 362, '2025-09-12 20:07:05'),
(89, '150ac7b1-2d32-4647-b03f-db7fa88e1ddd', 9, 'SELECT', 'contact-subject', '', '\n                            Select a subject\n                            General Inquiry\n          ', 456, 544, 456, 344, '2025-09-12 20:09:20'),
(90, '150ac7b1-2d32-4647-b03f-db7fa88e1ddd', 9, 'INPUT', '', '', '', 751, 988, 751, 388, '2025-09-12 20:09:22'),
(91, '150ac7b1-2d32-4647-b03f-db7fa88e1ddd', 9, 'BUTTON', '', 'btn btn-primary', 'Send Message', 510, 1067, 510, 467, '2025-09-12 20:09:23'),
(92, '52156a74-037f-466c-81a5-11db005fe7d0', 10, 'A', '', '', 'About', 950, 242, 950, 42, '2025-09-12 20:10:39'),
(93, '52156a74-037f-466c-81a5-11db005fe7d0', 11, 'A', '', '', 'Products', 821, 41, 821, 41, '2025-09-12 20:10:52'),
(94, '52156a74-037f-466c-81a5-11db005fe7d0', 12, 'A', '', '', 'About', 928, 47, 928, 47, '2025-09-12 20:10:54'),
(95, '7143fd2d-f820-4baf-9d09-0e28a5714c26', 14, 'INPUT', 'newsletter-email', '', '', 688, 1340, 688, 440, '2025-09-12 20:12:11'),
(96, '7143fd2d-f820-4baf-9d09-0e28a5714c26', 14, 'A', '', '', 'Products', 818, 956, 818, 56, '2025-09-12 20:12:28'),
(97, '7143fd2d-f820-4baf-9d09-0e28a5714c26', 15, 'INPUT', 'sidebar-newsletter-email', '', '', 1148, 522, 1148, 322, '2025-09-12 20:12:29'),
(98, '7143fd2d-f820-4baf-9d09-0e28a5714c26', 15, 'INPUT', 'sidebar-newsletter-interests', '', '', 1128, 592, 1128, 392, '2025-09-12 20:12:33'),
(99, '7143fd2d-f820-4baf-9d09-0e28a5714c26', 15, 'BUTTON', '', 'btn btn-primary', 'Subscribe Now', 1230, 623, 1230, 423, '2025-09-12 20:12:39'),
(100, '7143fd2d-f820-4baf-9d09-0e28a5714c26', 15, 'A', '', '', 'Home', 696, 235, 696, 35, '2025-09-12 20:12:41'),
(101, '7143fd2d-f820-4baf-9d09-0e28a5714c26', 16, 'DIV', '', 'container', '\n                Welcome to TechStore\n                Your one-stop shop for all things tech. Perfec', 908, 398, 908, 398, '2025-09-12 20:12:42'),
(102, '7143fd2d-f820-4baf-9d09-0e28a5714c26', 16, 'DIV', '', 'product-image', '💻', 426, 682, 426, 382, '2025-09-12 20:12:43'),
(103, '7143fd2d-f820-4baf-9d09-0e28a5714c26', 16, 'DIV', '', 'product-image', '📱', 755, 690, 755, 390, '2025-09-12 20:12:43'),
(104, '7143fd2d-f820-4baf-9d09-0e28a5714c26', 16, 'DIV', '', 'product-image', '🎧', 1118, 699, 1118, 399, '2025-09-12 20:12:44'),
(105, '7143fd2d-f820-4baf-9d09-0e28a5714c26', 16, 'DIV', '', 'product-image', '🎧', 1068, 676, 1068, 276, '2025-09-12 20:12:45'),
(106, '7143fd2d-f820-4baf-9d09-0e28a5714c26', 16, 'DIV', '', 'product-image', '📱', 832, 674, 832, 274, '2025-09-12 20:12:45'),
(107, '7143fd2d-f820-4baf-9d09-0e28a5714c26', 16, 'DIV', '', 'product-image', '💻', 493, 678, 493, 278, '2025-09-12 20:12:45'),
(108, '7143fd2d-f820-4baf-9d09-0e28a5714c26', 16, 'DIV', '', 'product-image', '💻', 414, 683, 414, 283, '2025-09-12 20:12:46'),
(109, '7143fd2d-f820-4baf-9d09-0e28a5714c26', 16, 'DIV', '', 'product-image', '📱', 744, 690, 744, 290, '2025-09-12 20:12:46'),
(110, '7143fd2d-f820-4baf-9d09-0e28a5714c26', 16, 'DIV', '', 'product-image', '🎧', 1169, 699, 1169, 299, '2025-09-12 20:12:46'),
(111, '7143fd2d-f820-4baf-9d09-0e28a5714c26', 16, 'BUTTON', '', 'btn btn-primary', 'Add to Cart', 665, 956, 665, 556, '2025-09-12 20:12:47'),
(112, '7143fd2d-f820-4baf-9d09-0e28a5714c26', 16, 'BUTTON', '', 'btn btn-primary', 'Add to Cart', 312, 946, 312, 546, '2025-09-12 20:12:47'),
(113, '7143fd2d-f820-4baf-9d09-0e28a5714c26', 16, 'DIV', '', 'product-info', '\n                        Wireless Headphones\n                        $299\n                        Pr', 1056, 938, 1056, 538, '2025-09-12 20:12:48'),
(114, '7143fd2d-f820-4baf-9d09-0e28a5714c26', 16, 'DIV', '', 'banner-ad', '\n                \n                    🎉 Special Offer: Save 20% Today!\n                    Use code', 719, 1050, 719, 650, '2025-09-12 20:12:48'),
(115, '7143fd2d-f820-4baf-9d09-0e28a5714c26', 16, 'SPAN', '', 'sidebar-ad-badge', 'NEWSLETTER', 752, 1233, 752, 133, '2025-09-12 20:12:51'),
(116, '7143fd2d-f820-4baf-9d09-0e28a5714c26', 16, 'P', '', '', 'Get the latest deals and tech insights delivered to your inbox', 700, 1294, 700, 194, '2025-09-12 20:12:51'),
(117, '7143fd2d-f820-4baf-9d09-0e28a5714c26', 16, 'H4', '', '', '📧 Stay Updated with Tech News', 640, 1286, 640, 186, '2025-09-12 20:12:51'),
(118, '7143fd2d-f820-4baf-9d09-0e28a5714c26', 16, 'INPUT', 'newsletter-email', '', '', 835, 1342, 835, 242, '2025-09-12 20:12:59'),
(119, '7143fd2d-f820-4baf-9d09-0e28a5714c26', 16, 'BUTTON', '', 'btn btn-primary', 'Subscribe to Newsletter', 788, 1413, 788, 313, '2025-09-12 20:13:02'),
(120, '7143fd2d-f820-4baf-9d09-0e28a5714c26', 16, 'DIV', '', 'stats', '\n                \n                    \n                        50K+\n                        Happy Cu', 564, 1510, 564, 410, '2025-09-12 20:13:03'),
(121, '7143fd2d-f820-4baf-9d09-0e28a5714c26', 16, 'DIV', '', 'stats-grid', '\n                    \n                        50K+\n                        Happy Customers\n         ', 376, 1597, 376, 497, '2025-09-12 20:13:04'),
(122, '7143fd2d-f820-4baf-9d09-0e28a5714c26', 16, 'DIV', '', 'stats', '\n                \n                    \n                        50K+\n                        Happy Cu', 824, 1531, 824, 431, '2025-09-12 20:13:04'),
(123, '7143fd2d-f820-4baf-9d09-0e28a5714c26', 16, 'H3', '', '', '24/7', 987, 1607, 987, 507, '2025-09-12 20:13:05'),
(124, '7143fd2d-f820-4baf-9d09-0e28a5714c26', 16, 'DIV', '', 'stats-grid', '\n                    \n                        50K+\n                        Happy Customers\n         ', 1052, 1608, 1052, 508, '2025-09-12 20:13:05'),
(125, '7143fd2d-f820-4baf-9d09-0e28a5714c26', 16, 'DIV', '', 'stat-item', '\n                        99.9%\n                        Uptime\n                    ', 1262, 1608, 1262, 508, '2025-09-12 20:13:05'),
(126, '7143fd2d-f820-4baf-9d09-0e28a5714c26', 16, 'A', '', '', 'Privacy Policy', 847, 1974, 847, 485, '2025-09-12 20:13:06'),
(127, '7143fd2d-f820-4baf-9d09-0e28a5714c26', 16, 'DIV', 'modal', 'modal active', '\n        \n            Privacy\n            This is the privacy modal content.\n            Close\n     ', 828, 527, 828, 527, '2025-09-12 20:13:06'),
(128, '7143fd2d-f820-4baf-9d09-0e28a5714c26', 16, 'DIV', '', 'modal-content', '\n            Privacy\n            This is the privacy modal content.\n            Close\n        ', 590, 424, 590, 424, '2025-09-12 20:13:07'),
(129, '7143fd2d-f820-4baf-9d09-0e28a5714c26', 16, 'BUTTON', '', 'btn', 'Close', 588, 409, 588, 409, '2025-09-12 20:13:07'),
(130, '7143fd2d-f820-4baf-9d09-0e28a5714c26', 16, 'A', '', '', 'YouTube', 1133, 2066, 1133, 576, '2025-09-12 20:13:09'),
(131, '30c7ca06-f33a-46c0-9904-6983539d06fe', 17, 'A', '', '', 'Contact', 1060, 47, 1060, 47, '2025-09-12 20:22:16'),
(132, '30c7ca06-f33a-46c0-9904-6983539d06fe', 18, 'SELECT', 'contact-subject', '', '\n                            Select a subject\n                            General Inquiry\n          ', 606, 570, 606, 370, '2025-09-12 20:22:18'),
(133, '135db118-7538-40b7-9944-c35436f04097', NULL, 'A', '', '', 'Products', 840, 49, 840, 49, '2025-09-13 20:19:27'),
(134, '135db118-7538-40b7-9944-c35436f04097', 19, 'A', '', '', 'About', 956, 51, 956, 51, '2025-09-13 20:19:27'),
(135, '135db118-7538-40b7-9944-c35436f04097', 20, 'A', '', '', 'Contact', 1028, 50, 1028, 50, '2025-09-13 20:19:27'),
(136, '135db118-7538-40b7-9944-c35436f04097', 22, 'A', '', '', 'Home', 722, 47, 722, 47, '2025-09-13 20:19:30'),
(137, '135db118-7538-40b7-9944-c35436f04097', 23, 'A', '', 'btn', 'Shop Now', 777, 370, 777, 298, '2025-09-13 20:19:32'),
(138, '135db118-7538-40b7-9944-c35436f04097', 24, 'BUTTON', '', 'btn', 'Learn More', 1217, 946, 1217, 323, '2025-09-13 20:19:35'),
(139, '135db118-7538-40b7-9944-c35436f04097', 24, 'BUTTON', '', 'btn btn-primary', 'Add to Cart', 722, 1170, 722, 546, '2025-09-13 20:19:37'),
(140, '135db118-7538-40b7-9944-c35436f04097', 24, 'A', '', '', 'Home', 698, 660, 698, 37, '2025-09-13 20:19:39'),
(141, '135db118-7538-40b7-9944-c35436f04097', 25, 'A', '', '', 'FAQ', 501, 2005, 501, 515, '2025-09-13 20:19:43'),
(142, '135db118-7538-40b7-9944-c35436f04097', 25, 'BUTTON', '', 'btn', 'Close', 560, 402, 560, 402, '2025-09-13 20:19:44');

-- --------------------------------------------------------

--
-- Table structure for table `form_events`
--

DROP TABLE IF EXISTS `form_events`;
CREATE TABLE IF NOT EXISTS `form_events` (
  `id` int NOT NULL AUTO_INCREMENT,
  `session_id` varchar(36) DEFAULT NULL,
  `page_view_id` int DEFAULT NULL,
  `form_id` varchar(255) DEFAULT NULL,
  `form_name` varchar(255) DEFAULT NULL,
  `field_name` varchar(255) DEFAULT NULL,
  `field_type` varchar(50) DEFAULT NULL,
  `interaction_type` varchar(50) DEFAULT NULL,
  `time_to_interact` int DEFAULT NULL,
  `timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `page_view_id` (`page_view_id`),
  KEY `idx_session_id` (`session_id`),
  KEY `idx_form_id` (`form_id`(250))
) ENGINE=MyISAM AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `form_events`
--

INSERT INTO `form_events` (`id`, `session_id`, `page_view_id`, `form_id`, `form_name`, `field_name`, `field_type`, `interaction_type`, `time_to_interact`, `timestamp`) VALUES
(1, '225e4277-a405-40d5-8caa-34c5b1a31452', 2, '', '', 'category-filter', 'select-one', 'focus', 0, '2025-09-12 19:57:17'),
(2, '225e4277-a405-40d5-8caa-34c5b1a31452', 2, '', '', 'category-filter', 'select-one', 'blur', 10044, '2025-09-12 19:57:28'),
(3, '225e4277-a405-40d5-8caa-34c5b1a31452', 2, '', '', 'category-filter', 'select-one', 'focus', 0, '2025-09-12 19:57:34'),
(4, '225e4277-a405-40d5-8caa-34c5b1a31452', 2, '', '', 'category-filter', 'select-one', 'blur', 5315, '2025-09-12 19:57:39'),
(5, '225e4277-a405-40d5-8caa-34c5b1a31452', 2, 'sidebarNewsletterForm', 'sidebar-newsletter-form', 'email', 'email', 'focus', 0, '2025-09-12 19:58:36'),
(6, '225e4277-a405-40d5-8caa-34c5b1a31452', 2, 'sidebarNewsletterForm', 'sidebar-newsletter-form', 'email', 'email', 'blur', 6867, '2025-09-12 19:58:43'),
(7, '150ac7b1-2d32-4647-b03f-db7fa88e1ddd', 9, 'contactForm', 'contact-form', 'name', 'text', 'focus', 0, '2025-09-12 20:02:28'),
(8, '150ac7b1-2d32-4647-b03f-db7fa88e1ddd', 9, 'contactForm', 'contact-form', 'name', 'text', 'blur', 3460, '2025-09-12 20:02:32'),
(9, '150ac7b1-2d32-4647-b03f-db7fa88e1ddd', 9, 'contactForm', 'contact-form', 'email', 'email', 'focus', 0, '2025-09-12 20:02:32'),
(10, '150ac7b1-2d32-4647-b03f-db7fa88e1ddd', 9, 'contactForm', 'contact-form', 'email', 'email', 'blur', 9550, '2025-09-12 20:02:41'),
(11, '150ac7b1-2d32-4647-b03f-db7fa88e1ddd', 9, 'contactForm', 'contact-form', 'phone', 'tel', 'focus', 0, '2025-09-12 20:02:42'),
(12, '150ac7b1-2d32-4647-b03f-db7fa88e1ddd', 9, 'contactForm', 'contact-form', 'phone', 'tel', 'blur', 589, '2025-09-12 20:02:43'),
(13, '150ac7b1-2d32-4647-b03f-db7fa88e1ddd', 9, 'contactForm', 'contact-form', 'email', 'email', 'focus', 0, '2025-09-12 20:02:43'),
(14, '150ac7b1-2d32-4647-b03f-db7fa88e1ddd', 9, 'contactForm', 'contact-form', 'email', 'email', 'blur', 3082, '2025-09-12 20:02:46'),
(15, '150ac7b1-2d32-4647-b03f-db7fa88e1ddd', 9, 'contactForm', 'contact-form', 'phone', 'tel', 'focus', 0, '2025-09-12 20:02:46'),
(16, '150ac7b1-2d32-4647-b03f-db7fa88e1ddd', 9, 'contactForm', 'contact-form', 'phone', 'tel', 'blur', 277, '2025-09-12 20:02:46'),
(17, '150ac7b1-2d32-4647-b03f-db7fa88e1ddd', 9, 'contactForm', 'contact-form', 'email', 'email', 'focus', 0, '2025-09-12 20:02:46'),
(18, '150ac7b1-2d32-4647-b03f-db7fa88e1ddd', 9, 'contactForm', 'contact-form', 'phone', 'tel', 'focus', 0, '2025-09-12 20:02:53'),
(19, '150ac7b1-2d32-4647-b03f-db7fa88e1ddd', 9, 'contactForm', 'contact-form', 'email', 'email', 'blur', 6375, '2025-09-12 20:02:53'),
(20, '150ac7b1-2d32-4647-b03f-db7fa88e1ddd', 9, 'contactForm', 'contact-form', 'phone', 'tel', 'blur', 9688, '2025-09-12 20:03:02'),
(21, '150ac7b1-2d32-4647-b03f-db7fa88e1ddd', 9, 'contactForm', 'contact-form', 'subject', 'select-one', 'focus', 0, '2025-09-12 20:03:02'),
(22, '150ac7b1-2d32-4647-b03f-db7fa88e1ddd', 9, 'contactForm', 'contact-form', 'subject', 'select-one', 'blur', 15203, '2025-09-12 20:03:18'),
(23, '150ac7b1-2d32-4647-b03f-db7fa88e1ddd', 9, 'contactForm', 'contact-form', 'message', 'textarea', 'focus', 0, '2025-09-12 20:03:18'),
(24, '150ac7b1-2d32-4647-b03f-db7fa88e1ddd', 9, 'contactForm', 'contact-form', 'message', 'textarea', 'blur', 129382, '2025-09-12 20:05:27'),
(25, '150ac7b1-2d32-4647-b03f-db7fa88e1ddd', 9, 'contactForm', 'contact-form', 'subject', 'select-one', 'focus', 0, '2025-09-12 20:05:27'),
(26, '150ac7b1-2d32-4647-b03f-db7fa88e1ddd', 9, 'contactForm', 'contact-form', 'subject', 'select-one', 'blur', 55490, '2025-09-12 20:06:22'),
(27, '150ac7b1-2d32-4647-b03f-db7fa88e1ddd', 9, 'contactForm', 'contact-form', 'newsletter', 'checkbox', 'focus', 0, '2025-09-12 20:06:22'),
(28, '150ac7b1-2d32-4647-b03f-db7fa88e1ddd', 9, 'contactForm', 'contact-form', 'newsletter', 'checkbox', 'blur', 19147, '2025-09-12 20:06:41'),
(29, '150ac7b1-2d32-4647-b03f-db7fa88e1ddd', 9, 'contactForm', 'contact-form', 'terms', 'checkbox', 'focus', 0, '2025-09-12 20:06:42'),
(30, '150ac7b1-2d32-4647-b03f-db7fa88e1ddd', 9, 'contactForm', 'contact-form', 'terms', 'checkbox', 'blur', 15918, '2025-09-12 20:06:58'),
(31, '150ac7b1-2d32-4647-b03f-db7fa88e1ddd', 9, 'contactForm', 'contact-form', 'priority', 'select-one', 'focus', 0, '2025-09-12 20:06:58'),
(32, '150ac7b1-2d32-4647-b03f-db7fa88e1ddd', 9, 'contactForm', 'contact-form', 'priority', 'select-one', 'blur', 2686, '2025-09-12 20:07:00'),
(33, '150ac7b1-2d32-4647-b03f-db7fa88e1ddd', 9, 'contactForm', 'contact-form', 'message', 'textarea', 'focus', 0, '2025-09-12 20:07:00'),
(34, '150ac7b1-2d32-4647-b03f-db7fa88e1ddd', 9, 'contactForm', 'contact-form', 'subject', 'select-one', 'focus', 0, '2025-09-12 20:07:05'),
(35, '150ac7b1-2d32-4647-b03f-db7fa88e1ddd', 9, 'contactForm', 'contact-form', 'message', 'textarea', 'blur', 4565, '2025-09-12 20:07:05'),
(36, '150ac7b1-2d32-4647-b03f-db7fa88e1ddd', 9, 'contactForm', 'contact-form', 'subject', 'select-one', 'blur', 137145, '2025-09-12 20:09:22'),
(37, '150ac7b1-2d32-4647-b03f-db7fa88e1ddd', 9, 'contactForm', 'contact-form', 'terms', 'checkbox', 'focus', 0, '2025-09-12 20:09:22'),
(38, '150ac7b1-2d32-4647-b03f-db7fa88e1ddd', 9, 'contactForm', 'contact-form', 'terms', 'checkbox', 'blur', 563, '2025-09-12 20:09:22'),
(39, '150ac7b1-2d32-4647-b03f-db7fa88e1ddd', 9, 'contactForm', 'contact-form', '', '', 'submit', 0, '2025-09-12 20:09:23'),
(40, '7143fd2d-f820-4baf-9d09-0e28a5714c26', 14, 'newsletterForm', 'newsletter-form', 'email', 'email', 'focus', 0, '2025-09-12 20:12:11'),
(41, '7143fd2d-f820-4baf-9d09-0e28a5714c26', 14, 'newsletterForm', 'newsletter-form', 'email', 'email', 'blur', 16325, '2025-09-12 20:12:28'),
(42, '7143fd2d-f820-4baf-9d09-0e28a5714c26', 15, 'sidebarNewsletterForm', 'sidebar-newsletter-form', 'email', 'email', 'focus', 0, '2025-09-12 20:12:29'),
(43, '7143fd2d-f820-4baf-9d09-0e28a5714c26', 15, 'sidebarNewsletterForm', 'sidebar-newsletter-form', 'interests', 'text', 'focus', 0, '2025-09-12 20:12:33'),
(44, '7143fd2d-f820-4baf-9d09-0e28a5714c26', 15, 'sidebarNewsletterForm', 'sidebar-newsletter-form', 'email', 'email', 'blur', 4198, '2025-09-12 20:12:33'),
(45, '7143fd2d-f820-4baf-9d09-0e28a5714c26', 15, 'sidebarNewsletterForm', 'sidebar-newsletter-form', 'interests', 'text', 'blur', 5890, '2025-09-12 20:12:39'),
(46, '7143fd2d-f820-4baf-9d09-0e28a5714c26', 15, 'sidebarNewsletterForm', 'sidebar-newsletter-form', '', '', 'submit', 0, '2025-09-12 20:12:39'),
(47, '7143fd2d-f820-4baf-9d09-0e28a5714c26', 16, 'newsletterForm', 'newsletter-form', 'email', 'email', 'focus', 0, '2025-09-12 20:12:59'),
(48, '7143fd2d-f820-4baf-9d09-0e28a5714c26', 16, 'newsletterForm', 'newsletter-form', 'email', 'email', 'blur', 3293, '2025-09-12 20:13:02'),
(49, '7143fd2d-f820-4baf-9d09-0e28a5714c26', 16, 'newsletterForm', 'newsletter-form', '', '', 'submit', 0, '2025-09-12 20:13:02'),
(50, '30c7ca06-f33a-46c0-9904-6983539d06fe', 18, 'contactForm', 'contact-form', 'subject', 'select-one', 'focus', 0, '2025-09-12 20:22:18'),
(51, '30c7ca06-f33a-46c0-9904-6983539d06fe', 18, 'contactForm', 'contact-form', 'subject', 'select-one', 'blur', 2989, '2025-09-12 20:22:22');

-- --------------------------------------------------------

--
-- Table structure for table `heatmap_data`
--

DROP TABLE IF EXISTS `heatmap_data`;
CREATE TABLE IF NOT EXISTS `heatmap_data` (
  `id` int NOT NULL AUTO_INCREMENT,
  `page_path` varchar(255) DEFAULT NULL,
  `element_selector` varchar(500) DEFAULT NULL,
  `x_percentage` decimal(5,2) DEFAULT NULL,
  `y_percentage` decimal(5,2) DEFAULT NULL,
  `click_count` int DEFAULT '1',
  `date` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_page_path` (`page_path`(250)),
  KEY `idx_date` (`date`)
) ENGINE=MyISAM AUTO_INCREMENT=143 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `heatmap_data`
--

INSERT INTO `heatmap_data` (`id`, `page_path`, `element_selector`, `x_percentage`, `y_percentage`, `click_count`, `date`, `created_at`) VALUES
(1, '/home', 'a.banner-ad-cta', 80.63, 49.91, 1, '2025-09-12', '2025-09-12 19:56:43'),
(2, '/home', 'h2', 24.52, 23.61, 1, '2025-09-12', '2025-09-12 19:57:00'),
(3, '/home', 'div.product-image', 24.32, 29.35, 1, '2025-09-12', '2025-09-12 19:57:00'),
(4, '/home', 'div.product-image', 50.56, 30.61, 1, '2025-09-12', '2025-09-12 19:57:01'),
(5, '/home', 'div.product-image', 76.14, 29.94, 1, '2025-09-12', '2025-09-12 19:57:02'),
(6, '/home', 'a', 55.12, 6.01, 1, '2025-09-12', '2025-09-12 19:57:15'),
(7, '/products', '#category-filter', 43.16, 11.35, 1, '2025-09-12', '2025-09-12 19:57:17'),
(8, '/products', '#category-filter', 11.63, 15.40, 1, '2025-09-12', '2025-09-12 19:57:18'),
(9, '/products', '#category-filter', 35.96, 16.91, 1, '2025-09-12', '2025-09-12 19:57:19'),
(10, '/products', '#category-filter', 11.63, 13.41, 1, '2025-09-12', '2025-09-12 19:57:20'),
(11, '/products', '#category-filter', 33.05, 14.72, 1, '2025-09-12', '2025-09-12 19:57:21'),
(12, '/products', '#category-filter', 11.63, 15.40, 1, '2025-09-12', '2025-09-12 19:57:23'),
(13, '/products', '#category-filter', 42.83, 16.64, 1, '2025-09-12', '2025-09-12 19:57:24'),
(14, '/products', '#category-filter', 11.63, 10.63, 1, '2025-09-12', '2025-09-12 19:57:26'),
(15, '/products', 'div.product-image', 32.78, 18.86, 1, '2025-09-12', '2025-09-12 19:57:40'),
(16, '/products', 'div.product-image', 55.58, 19.09, 1, '2025-09-12', '2025-09-12 19:57:40'),
(17, '/products', 'div.product-image', 25.38, 41.07, 1, '2025-09-12', '2025-09-12 19:57:42'),
(18, '/products', 'div.product-image', 54.53, 41.52, 1, '2025-09-12', '2025-09-12 19:57:43'),
(19, '/products', 'div.product-image', 24.92, 61.42, 1, '2025-09-12', '2025-09-12 19:57:45'),
(20, '/products', 'div.product-image', 53.40, 61.10, 1, '2025-09-12', '2025-09-12 19:57:47'),
(21, '/products', 'p.product-price', 13.62, 28.22, 1, '2025-09-12', '2025-09-12 19:58:01'),
(22, '/products', 'p.product-price', 20.42, 28.77, 1, '2025-09-12', '2025-09-12 19:58:02'),
(23, '/products', 'p.product-price', 19.10, 27.95, 1, '2025-09-12', '2025-09-12 19:58:03'),
(24, '/products', 'p.product-price', 46.27, 28.31, 1, '2025-09-12', '2025-09-12 19:58:06'),
(25, '/products', 'p.product-price', 46.40, 28.54, 1, '2025-09-12', '2025-09-12 19:58:07'),
(26, '/products', 'p.product-price', 46.40, 28.54, 1, '2025-09-12', '2025-09-12 19:58:08'),
(27, '/products', 'p.product-price', 45.74, 48.89, 1, '2025-09-12', '2025-09-12 19:58:12'),
(28, '/products', 'p.product-price', 15.53, 48.89, 1, '2025-09-12', '2025-09-12 19:58:15'),
(29, '/products', '#sidebar-newsletter-email', 81.16, 23.74, 1, '2025-09-12', '2025-09-12 19:58:36'),
(30, '/products', '#sidebar-newsletter-email', 81.16, 23.74, 1, '2025-09-12', '2025-09-12 19:58:42'),
(31, '/products', '#products', 90.09, 24.88, 1, '2025-09-12', '2025-09-12 19:58:43'),
(32, '/products', 'a', 63.25, 10.95, 1, '2025-09-12', '2025-09-12 19:58:46'),
(33, '/home', 'a.btn', 53.21, 16.52, 1, '2025-09-12', '2025-09-12 20:00:42'),
(34, '/products', 'button.btn.btn-primary', 18.84, 32.20, 1, '2025-09-12', '2025-09-12 20:00:46'),
(35, '/products', 'button.btn.btn-primary', 47.59, 31.93, 1, '2025-09-12', '2025-09-12 20:00:47'),
(36, '/products', 'button.btn.btn-primary', 20.62, 53.19, 1, '2025-09-12', '2025-09-12 20:00:48'),
(37, '/products', 'button.btn.btn-primary', 49.31, 53.10, 1, '2025-09-12', '2025-09-12 20:00:48'),
(38, '/products', 'button.btn.btn-primary', 20.29, 74.54, 1, '2025-09-12', '2025-09-12 20:00:50'),
(39, '/products', 'a', 83.28, 38.85, 1, '2025-09-12', '2025-09-12 20:00:57'),
(40, '/cart', 'button.btn.btn-primary', 56.91, 56.66, 1, '2025-09-12', '2025-09-12 20:01:02'),
(41, '/cart', 'button.btn', 37.14, 52.05, 1, '2025-09-12', '2025-09-12 20:01:03'),
(42, '/cart', 'button.btn.btn-primary', 44.28, 56.73, 1, '2025-09-12', '2025-09-12 20:01:04'),
(43, '/cart', 'button.btn', 38.86, 51.68, 1, '2025-09-12', '2025-09-12 20:01:05'),
(44, '/cart', 'button.btn.btn-primary', 49.17, 56.44, 1, '2025-09-12', '2025-09-12 20:01:06'),
(45, '/cart', 'button.btn', 39.33, 50.51, 1, '2025-09-12', '2025-09-12 20:01:07'),
(46, '/cart', 'button.btn.btn-primary', 47.32, 57.61, 1, '2025-09-12', '2025-09-12 20:01:07'),
(47, '/cart', 'button.btn', 39.26, 51.90, 1, '2025-09-12', '2025-09-12 20:01:08'),
(48, '/cart', 'button.btn.btn-primary', 48.38, 58.20, 1, '2025-09-12', '2025-09-12 20:01:09'),
(49, '/cart', 'button.btn', 39.33, 51.39, 1, '2025-09-12', '2025-09-12 20:01:10'),
(50, '/cart', 'button.btn', 80.83, 42.72, 1, '2025-09-12', '2025-09-12 20:01:12'),
(51, '/cart', 'button.btn', 83.34, 39.90, 1, '2025-09-12', '2025-09-12 20:01:12'),
(52, '/cart', 'button.btn', 83.34, 32.54, 1, '2025-09-12', '2025-09-12 20:01:13'),
(53, '/cart', 'button.btn', 83.28, 27.31, 1, '2025-09-12', '2025-09-12 20:01:13'),
(54, '/cart', 'button.btn', 82.49, 21.50, 1, '2025-09-12', '2025-09-12 20:01:14'),
(55, '/cart', 'a.logo', 18.24, 3.52, 1, '2025-09-12', '2025-09-12 20:01:15'),
(56, '/home', 'a', 69.80, 1.97, 1, '2025-09-12', '2025-09-12 20:02:23'),
(57, '/contact', '#contact-name', 38.80, 16.38, 1, '2025-09-12', '2025-09-12 20:02:28'),
(58, '/contact', '#contact-email', 31.26, 21.14, 1, '2025-09-12', '2025-09-12 20:02:32'),
(59, '/contact', '#contactForm', 65.57, 24.91, 1, '2025-09-12', '2025-09-12 20:02:41'),
(60, '/contact', '#contact-phone', 42.63, 29.11, 1, '2025-09-12', '2025-09-12 20:02:42'),
(61, '/contact', '#contact-email', 42.63, 22.62, 1, '2025-09-12', '2025-09-12 20:02:43'),
(62, '/contact', 'label', 56.38, 25.59, 1, '2025-09-12', '2025-09-12 20:02:46'),
(63, '/contact', '#contact-phone', 56.38, 25.59, 1, '2025-09-12', '2025-09-12 20:02:46'),
(64, '/contact', '#contact-email', 50.96, 22.81, 1, '2025-09-12', '2025-09-12 20:02:46'),
(65, '/contact', 'div.container', 29.61, 22.00, 1, '2025-09-12', '2025-09-12 20:02:50'),
(66, '/contact', '#contact-phone', 38.40, 27.75, 1, '2025-09-12', '2025-09-12 20:02:53'),
(67, '/contact', '#contact-subject', 36.62, 34.36, 1, '2025-09-12', '2025-09-12 20:03:03'),
(68, '/contact', '#contact-subject', 30.14, 33.62, 1, '2025-09-12', '2025-09-12 20:03:03'),
(69, '/contact', '#contact-subject', 35.23, 35.66, 1, '2025-09-12', '2025-09-12 20:03:04'),
(70, '/contact', '#contact-subject', 30.14, 33.62, 1, '2025-09-12', '2025-09-12 20:03:05'),
(71, '/contact', '#contact-subject', 36.55, 35.66, 1, '2025-09-12', '2025-09-12 20:03:05'),
(72, '/contact', '#contact-subject', 30.14, 33.62, 1, '2025-09-12', '2025-09-12 20:03:06'),
(73, '/contact', '#contact-subject', 37.08, 35.78, 1, '2025-09-12', '2025-09-12 20:03:07'),
(74, '/contact', '#contact-subject', 30.14, 33.62, 1, '2025-09-12', '2025-09-12 20:03:09'),
(75, '/contact', '#contact-message', 37.34, 49.38, 1, '2025-09-12', '2025-09-12 20:03:18'),
(76, '/contact', '#contact-subject', 37.21, 35.54, 1, '2025-09-12', '2025-09-12 20:05:27'),
(77, '/contact', '#contact-subject', 30.14, 33.62, 1, '2025-09-12', '2025-09-12 20:06:19'),
(78, '/contact', 'input', 50.30, 56.80, 1, '2025-09-12', '2025-09-12 20:06:22'),
(79, '/contact', 'input', 50.36, 56.80, 1, '2025-09-12', '2025-09-12 20:06:25'),
(80, '/contact', 'input', 50.36, 56.80, 1, '2025-09-12', '2025-09-12 20:06:27'),
(81, '/contact', 'input', 50.36, 56.80, 1, '2025-09-12', '2025-09-12 20:06:28'),
(82, '/contact', 'input', 50.36, 56.80, 1, '2025-09-12', '2025-09-12 20:06:29'),
(83, '/contact', 'input', 50.36, 56.80, 1, '2025-09-12', '2025-09-12 20:06:30'),
(84, '/contact', 'button.btn.btn-primary', 40.71, 66.25, 1, '2025-09-12', '2025-09-12 20:06:42'),
(85, '/contact', '#contact-priority', 46.27, 41.66, 1, '2025-09-12', '2025-09-12 20:06:58'),
(86, '/contact', '#contact-priority', 46.27, 41.66, 1, '2025-09-12', '2025-09-12 20:06:59'),
(87, '/contact', '#contact-message', 53.67, 52.04, 1, '2025-09-12', '2025-09-12 20:07:00'),
(88, '/contact', '#contact-subject', 65.43, 34.73, 1, '2025-09-12', '2025-09-12 20:07:05'),
(89, '/contact', '#contact-subject', 30.14, 33.62, 1, '2025-09-12', '2025-09-12 20:09:20'),
(90, '/contact', 'input', 49.64, 61.06, 1, '2025-09-12', '2025-09-12 20:09:22'),
(91, '/contact', 'button.btn.btn-primary', 33.71, 65.95, 1, '2025-09-12', '2025-09-12 20:09:23'),
(92, '/home', 'a', 62.79, 10.86, 1, '2025-09-12', '2025-09-12 20:10:39'),
(93, '/about', 'a', 54.26, 1.38, 1, '2025-09-12', '2025-09-12 20:10:52'),
(94, '/products', 'a', 61.34, 2.13, 1, '2025-09-12', '2025-09-12 20:10:54'),
(95, '/home', '#newsletter-email', 45.47, 60.14, 1, '2025-09-12', '2025-09-12 20:12:12'),
(96, '/home', 'a', 54.06, 42.91, 1, '2025-09-12', '2025-09-12 20:12:28'),
(97, '/products', '#sidebar-newsletter-email', 75.88, 23.61, 1, '2025-09-12', '2025-09-12 20:12:29'),
(98, '/products', '#sidebar-newsletter-interests', 74.55, 26.78, 1, '2025-09-12', '2025-09-12 20:12:33'),
(99, '/products', 'button.btn.btn-primary', 81.30, 28.18, 1, '2025-09-12', '2025-09-12 20:12:39'),
(100, '/products', 'a', 46.00, 10.63, 1, '2025-09-12', '2025-09-12 20:12:41'),
(101, '/home', 'div.container', 60.01, 17.86, 1, '2025-09-12', '2025-09-12 20:12:42'),
(102, '/home', 'div.product-image', 28.16, 30.61, 1, '2025-09-12', '2025-09-12 20:12:43'),
(103, '/home', 'div.product-image', 49.90, 30.97, 1, '2025-09-12', '2025-09-12 20:12:43'),
(104, '/home', 'div.product-image', 73.89, 31.37, 1, '2025-09-12', '2025-09-12 20:12:44'),
(105, '/home', 'div.product-image', 70.59, 30.34, 1, '2025-09-12', '2025-09-12 20:12:45'),
(106, '/home', 'div.product-image', 54.99, 30.25, 1, '2025-09-12', '2025-09-12 20:12:45'),
(107, '/home', 'div.product-image', 32.58, 30.43, 1, '2025-09-12', '2025-09-12 20:12:45'),
(108, '/home', 'div.product-image', 27.36, 30.66, 1, '2025-09-12', '2025-09-12 20:12:46'),
(109, '/home', 'div.product-image', 49.17, 30.97, 1, '2025-09-12', '2025-09-12 20:12:46'),
(110, '/home', 'div.product-image', 77.26, 31.37, 1, '2025-09-12', '2025-09-12 20:12:46'),
(111, '/home', 'button.btn.btn-primary', 43.95, 42.91, 1, '2025-09-12', '2025-09-12 20:12:47'),
(112, '/home', 'button.btn.btn-primary', 20.62, 42.46, 1, '2025-09-12', '2025-09-12 20:12:47'),
(113, '/home', 'div.product-info', 69.80, 42.10, 1, '2025-09-12', '2025-09-12 20:12:48'),
(114, '/home', 'div.banner-ad', 47.52, 47.13, 1, '2025-09-12', '2025-09-12 20:12:48'),
(115, '/home', 'span.sidebar-ad-badge', 49.70, 55.34, 1, '2025-09-12', '2025-09-12 20:12:51'),
(116, '/home', 'p', 46.27, 58.08, 1, '2025-09-12', '2025-09-12 20:12:51'),
(117, '/home', 'h4', 42.30, 57.72, 1, '2025-09-12', '2025-09-12 20:12:51'),
(118, '/home', '#newsletter-email', 55.19, 60.23, 1, '2025-09-12', '2025-09-12 20:12:59'),
(119, '/home', 'button.btn.btn-primary', 52.08, 63.42, 1, '2025-09-12', '2025-09-12 20:13:02'),
(120, '/home', 'div.stats', 37.28, 67.77, 1, '2025-09-12', '2025-09-12 20:13:03'),
(121, '/home', 'div.stats-grid', 24.85, 71.68, 1, '2025-09-12', '2025-09-12 20:13:04'),
(122, '/home', 'div.stats', 54.46, 68.72, 1, '2025-09-12', '2025-09-12 20:13:04'),
(123, '/home', 'h3', 65.23, 72.13, 1, '2025-09-12', '2025-09-12 20:13:05'),
(124, '/home', 'div.stats-grid', 69.53, 72.17, 1, '2025-09-12', '2025-09-12 20:13:05'),
(125, '/home', 'div.stat-item', 83.41, 72.17, 1, '2025-09-12', '2025-09-12 20:13:05'),
(126, '/home', 'a', 55.98, 88.60, 1, '2025-09-12', '2025-09-12 20:13:06'),
(127, '/home', '#modal', 54.73, 23.65, 1, '2025-09-12', '2025-09-12 20:13:06'),
(128, '/home', 'div.modal-content', 39.00, 19.03, 1, '2025-09-12', '2025-09-12 20:13:07'),
(129, '/home', 'button.btn', 38.86, 18.36, 1, '2025-09-12', '2025-09-12 20:13:07'),
(130, '/home', 'a', 74.88, 92.73, 1, '2025-09-12', '2025-09-12 20:13:09'),
(131, '/home', 'a', 70.06, 2.11, 1, '2025-09-12', '2025-09-12 20:22:17'),
(132, '/contact', '#contact-subject', 40.05, 35.23, 1, '2025-09-12', '2025-09-12 20:22:18'),
(133, '/home', 'a', 55.52, 2.20, 1, '2025-09-13', '2025-09-13 20:19:27'),
(134, '/products', 'a', 63.19, 2.31, 1, '2025-09-13', '2025-09-13 20:19:27'),
(135, '/about', 'a', 67.94, 1.69, 1, '2025-09-13', '2025-09-13 20:19:27'),
(136, '/contact', 'a', 47.72, 2.90, 1, '2025-09-13', '2025-09-13 20:19:30'),
(137, '/home', 'a.btn', 51.35, 16.61, 1, '2025-09-13', '2025-09-13 20:19:32'),
(138, '/products', 'button.btn', 80.44, 42.79, 1, '2025-09-13', '2025-09-13 20:19:35'),
(139, '/products', 'button.btn.btn-primary', 47.72, 52.92, 1, '2025-09-13', '2025-09-13 20:19:37'),
(140, '/products', 'a', 46.13, 29.85, 1, '2025-09-13', '2025-09-13 20:19:39'),
(141, '/home', 'a', 33.11, 89.99, 1, '2025-09-13', '2025-09-13 20:19:43'),
(142, '/home', 'button.btn', 37.01, 18.04, 1, '2025-09-13', '2025-09-13 20:19:44');

-- --------------------------------------------------------

--
-- Table structure for table `page_screenshots`
--

DROP TABLE IF EXISTS `page_screenshots`;
CREATE TABLE IF NOT EXISTS `page_screenshots` (
  `id` int NOT NULL AUTO_INCREMENT,
  `page_path` varchar(191) NOT NULL,
  `url` text NOT NULL,
  `filename` varchar(255) NOT NULL,
  `screenshot_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `file_size` int DEFAULT '0',
  `width` int DEFAULT '1920',
  `height` int DEFAULT '1080',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_page_path` (`page_path`),
  KEY `idx_page_path` (`page_path`),
  KEY `idx_screenshot_date` (`screenshot_date`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `page_screenshots`
--

INSERT INTO `page_screenshots` (`id`, `page_path`, `url`, `filename`, `screenshot_date`, `file_size`, `width`, `height`, `created_at`) VALUES
(1, '/home', 'http://127.0.0.1:5500/test.html#home', '_home_1757708134037.png', '2025-09-12 20:15:34', 620013, 1920, 1080, '2025-09-12 20:15:33');

-- --------------------------------------------------------

--
-- Table structure for table `page_views`
--

DROP TABLE IF EXISTS `page_views`;
CREATE TABLE IF NOT EXISTS `page_views` (
  `id` int NOT NULL AUTO_INCREMENT,
  `session_id` varchar(36) DEFAULT NULL,
  `page_url` text,
  `page_title` varchar(255) DEFAULT NULL,
  `page_path` varchar(255) DEFAULT NULL,
  `entry_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `exit_time` timestamp NULL DEFAULT NULL,
  `time_on_page` int DEFAULT '0',
  `bounce` tinyint(1) DEFAULT '0',
  `exit_page` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `idx_session_id` (`session_id`),
  KEY `idx_entry_time` (`entry_time`),
  KEY `idx_page_path` (`page_path`(250))
) ENGINE=MyISAM AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `page_views`
--

INSERT INTO `page_views` (`id`, `session_id`, `page_url`, `page_title`, `page_path`, `entry_time`, `exit_time`, `time_on_page`, `bounce`, `exit_page`) VALUES
(1, '225e4277-a405-40d5-8caa-34c5b1a31452', 'http://127.0.0.1:5500/test.html#home', 'TechStore - Analytics Test Site', '/home', '2025-09-12 19:56:27', '2025-09-12 19:57:15', 48, 0, 1),
(2, '225e4277-a405-40d5-8caa-34c5b1a31452', 'http://127.0.0.1:5500/test.html#products', 'Products - TechStore', '/products', '2025-09-12 19:57:15', '2025-09-12 19:58:47', 91, 0, 1),
(3, '225e4277-a405-40d5-8caa-34c5b1a31452', 'http://127.0.0.1:5500/test.html#about', 'About Us - TechStore', '/about', '2025-09-12 19:58:47', '2025-09-12 19:58:56', 7, 0, 1),
(4, '8129d11d-53fe-4825-909b-2eb1ccc196e6', 'http://127.0.0.1:5500/test.html#home', 'TechStore - Analytics Test Site', '/home', '2025-09-12 20:00:42', NULL, 0, 0, 0),
(5, '8129d11d-53fe-4825-909b-2eb1ccc196e6', 'http://127.0.0.1:5500/test.html#products', 'Products - TechStore', '/products', '2025-09-12 20:00:43', '2025-09-12 20:00:58', 14, 0, 1),
(6, '8129d11d-53fe-4825-909b-2eb1ccc196e6', 'http://127.0.0.1:5500/test.html#cart', 'Shopping Cart - TechStore', '/cart', '2025-09-12 20:00:57', '2025-09-12 20:01:15', 17, 0, 1),
(7, '8129d11d-53fe-4825-909b-2eb1ccc196e6', 'http://127.0.0.1:5500/test.html#home', 'TechStore - Analytics Test Site', '/home', '2025-09-12 20:01:15', '2025-09-12 20:01:19', 1, 0, 1),
(8, '150ac7b1-2d32-4647-b03f-db7fa88e1ddd', 'http://127.0.0.1:5500/test.html#home', 'TechStore - Analytics Test Site', '/home', '2025-09-12 20:02:22', '2025-09-12 20:02:23', 1, 0, 1),
(9, '150ac7b1-2d32-4647-b03f-db7fa88e1ddd', 'http://127.0.0.1:5500/test.html#contact', 'Contact - TechStore', '/contact', '2025-09-12 20:02:23', '2025-09-12 20:09:35', 430, 0, 1),
(10, '52156a74-037f-466c-81a5-11db005fe7d0', 'http://127.0.0.1:5500/test.html#home', 'TechStore - Analytics Test Site', '/home', '2025-09-12 20:10:32', '2025-09-12 20:10:39', 7, 0, 1),
(11, '52156a74-037f-466c-81a5-11db005fe7d0', 'http://127.0.0.1:5500/test.html#about', 'About Us - TechStore', '/about', '2025-09-12 20:10:39', '2025-09-12 20:10:52', 12, 0, 1),
(12, '52156a74-037f-466c-81a5-11db005fe7d0', 'http://127.0.0.1:5500/test.html#products', 'Products - TechStore', '/products', '2025-09-12 20:10:52', '2025-09-12 20:10:54', 2, 0, 1),
(13, '52156a74-037f-466c-81a5-11db005fe7d0', 'http://127.0.0.1:5500/test.html#about', 'About Us - TechStore', '/about', '2025-09-12 20:10:54', '2025-09-12 20:11:01', 6, 0, 1),
(14, '7143fd2d-f820-4baf-9d09-0e28a5714c26', 'http://127.0.0.1:5500/test.html#home', 'TechStore - Analytics Test Site', '/home', '2025-09-12 20:12:08', '2025-09-12 20:12:28', 19, 0, 1),
(15, '7143fd2d-f820-4baf-9d09-0e28a5714c26', 'http://127.0.0.1:5500/test.html#products', 'Products - TechStore', '/products', '2025-09-12 20:12:28', '2025-09-12 20:12:41', 13, 0, 1),
(16, '7143fd2d-f820-4baf-9d09-0e28a5714c26', 'http://127.0.0.1:5500/test.html#home', 'TechStore - Analytics Test Site', '/home', '2025-09-12 20:12:41', '2025-09-12 20:13:13', 30, 0, 1),
(17, '30c7ca06-f33a-46c0-9904-6983539d06fe', 'http://127.0.0.1:5500/test.html#home', 'TechStore - Analytics Test Site', '/home', '2025-09-12 20:22:16', '2025-09-12 20:22:17', 1, 0, 1),
(18, '30c7ca06-f33a-46c0-9904-6983539d06fe', 'http://127.0.0.1:5500/test.html#contact', 'Contact - TechStore', '/contact', '2025-09-12 20:22:17', '2025-09-12 20:22:22', 4, 0, 1),
(19, '135db118-7538-40b7-9944-c35436f04097', 'http://127.0.0.1:5500/test.html#home', 'TechStore - Analytics Test Site', '/home', '2025-09-13 20:19:26', NULL, 0, 0, 0),
(20, '135db118-7538-40b7-9944-c35436f04097', 'http://127.0.0.1:5500/test.html#products', 'Products - TechStore', '/products', '2025-09-13 20:19:27', NULL, 0, 0, 0),
(21, '135db118-7538-40b7-9944-c35436f04097', 'http://127.0.0.1:5500/test.html#about', 'About Us - TechStore', '/about', '2025-09-13 20:19:27', NULL, 0, 0, 0),
(22, '135db118-7538-40b7-9944-c35436f04097', 'http://127.0.0.1:5500/test.html#contact', 'Contact - TechStore', '/contact', '2025-09-13 20:19:27', '2025-09-13 20:19:30', 3, 0, 1),
(23, '135db118-7538-40b7-9944-c35436f04097', 'http://127.0.0.1:5500/test.html#home', 'TechStore - Analytics Test Site', '/home', '2025-09-13 20:19:30', '2025-09-13 20:19:32', 2, 0, 1),
(24, '135db118-7538-40b7-9944-c35436f04097', 'http://127.0.0.1:5500/test.html#products', 'Products - TechStore', '/products', '2025-09-13 20:19:32', '2025-09-13 20:19:39', 7, 0, 1),
(25, '135db118-7538-40b7-9944-c35436f04097', 'http://127.0.0.1:5500/test.html#home', 'TechStore - Analytics Test Site', '/home', '2025-09-13 20:19:39', '2025-09-13 20:19:46', 6, 0, 1),
(26, '72f5f439-5a8f-4bcc-a2a3-fa1c9681fa6f', 'http://127.0.0.1:5500/test.html#home', 'TechStore - Analytics Test Site', '/home', '2025-09-13 20:20:11', NULL, 0, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `scroll_events`
--

DROP TABLE IF EXISTS `scroll_events`;
CREATE TABLE IF NOT EXISTS `scroll_events` (
  `id` int NOT NULL AUTO_INCREMENT,
  `session_id` varchar(36) DEFAULT NULL,
  `page_view_id` int DEFAULT NULL,
  `max_scroll_depth` int DEFAULT NULL,
  `max_scroll_percentage` decimal(5,2) DEFAULT NULL,
  `scroll_count` int DEFAULT '0',
  `timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_session_pageview` (`session_id`,`page_view_id`),
  KEY `idx_session_id` (`session_id`),
  KEY `idx_page_view_id` (`page_view_id`)
) ENGINE=MyISAM AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `scroll_events`
--

INSERT INTO `scroll_events` (`id`, `session_id`, `page_view_id`, `max_scroll_depth`, `max_scroll_percentage`, `scroll_count`, `timestamp`) VALUES
(1, '225e4277-a405-40d5-8caa-34c5b1a31452', 1, 1490, 100.00, 14, '2025-09-12 19:56:30'),
(2, '225e4277-a405-40d5-8caa-34c5b1a31452', 2, 1490, 100.00, 15, '2025-09-12 19:57:16'),
(3, '225e4277-a405-40d5-8caa-34c5b1a31452', 3, 1490, 100.00, 2, '2025-09-12 19:58:47'),
(4, '8129d11d-53fe-4825-909b-2eb1ccc196e6', 5, 1100, 75.00, 7, '2025-09-12 20:00:43'),
(5, '8129d11d-53fe-4825-909b-2eb1ccc196e6', 6, 1100, 75.00, 5, '2025-09-12 20:00:58'),
(6, '150ac7b1-2d32-4647-b03f-db7fa88e1ddd', 8, 0, 0.00, 1, '2025-09-12 20:02:23'),
(7, '150ac7b1-2d32-4647-b03f-db7fa88e1ddd', 9, 600, 68.00, 9, '2025-09-12 20:02:24'),
(8, '52156a74-037f-466c-81a5-11db005fe7d0', 10, 700, 47.00, 5, '2025-09-12 20:10:33'),
(9, '52156a74-037f-466c-81a5-11db005fe7d0', 11, 2229, 100.00, 3, '2025-09-12 20:10:40'),
(10, '52156a74-037f-466c-81a5-11db005fe7d0', 12, 2229, 100.00, 1, '2025-09-12 20:10:52'),
(11, '52156a74-037f-466c-81a5-11db005fe7d0', 13, 2229, 100.00, 1, '2025-09-12 20:10:57'),
(12, '7143fd2d-f820-4baf-9d09-0e28a5714c26', 14, 900, 60.00, 2, '2025-09-12 20:12:09'),
(13, '7143fd2d-f820-4baf-9d09-0e28a5714c26', 15, 900, 60.00, 2, '2025-09-12 20:12:28'),
(14, '7143fd2d-f820-4baf-9d09-0e28a5714c26', 16, 1490, 100.00, 8, '2025-09-12 20:12:42'),
(15, '30c7ca06-f33a-46c0-9904-6983539d06fe', 17, 0, 0.00, 1, '2025-09-12 20:22:16'),
(16, '30c7ca06-f33a-46c0-9904-6983539d06fe', 18, 200, 23.00, 2, '2025-09-12 20:22:17'),
(17, '135db118-7538-40b7-9944-c35436f04097', 19, 0, 0.00, 2, '2025-09-13 20:19:27'),
(18, '135db118-7538-40b7-9944-c35436f04097', 22, 0, 0.00, 1, '2025-09-13 20:19:28'),
(19, '135db118-7538-40b7-9944-c35436f04097', 23, 73, 5.00, 2, '2025-09-13 20:19:30'),
(20, '135db118-7538-40b7-9944-c35436f04097', 24, 626, 43.00, 2, '2025-09-13 20:19:32'),
(21, '135db118-7538-40b7-9944-c35436f04097', 25, 1490, 100.00, 3, '2025-09-13 20:19:39');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
CREATE TABLE IF NOT EXISTS `sessions` (
  `id` varchar(36) NOT NULL,
  `user_id` varchar(36) DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text,
  `browser` varchar(50) DEFAULT NULL,
  `os` varchar(50) DEFAULT NULL,
  `device_type` varchar(20) DEFAULT NULL,
  `screen_width` int DEFAULT NULL,
  `screen_height` int DEFAULT NULL,
  `viewport_width` int DEFAULT NULL,
  `viewport_height` int DEFAULT NULL,
  `referrer` text,
  `utm_source` varchar(100) DEFAULT NULL,
  `utm_medium` varchar(100) DEFAULT NULL,
  `utm_campaign` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_created_at` (`created_at`),
  KEY `idx_user_id` (`user_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `browser`, `os`, `device_type`, `screen_width`, `screen_height`, `viewport_width`, `viewport_height`, `referrer`, `utm_source`, `utm_medium`, `utm_campaign`, `created_at`, `updated_at`) VALUES
('225e4277-a405-40d5-8caa-34c5b1a31452', 'b4a0970b-194d-4b94-b9ba-4ac80225f902', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'Chrome 140.0.0', 'Windows 10.0.0', 'desktop', 1536, 864, 1528, 738, NULL, NULL, NULL, NULL, '2025-09-12 19:56:27', '2025-09-12 19:56:27'),
('8129d11d-53fe-4825-909b-2eb1ccc196e6', '6743031b-df23-4837-8787-86ad796cd5f3', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'Chrome 140.0.0', 'Windows 10.0.0', 'desktop', 1536, 864, 1528, 738, NULL, NULL, NULL, NULL, '2025-09-12 20:00:42', '2025-09-12 20:00:42'),
('150ac7b1-2d32-4647-b03f-db7fa88e1ddd', 'e1d3000d-e476-4bff-92fe-6fedc8875a30', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'Chrome 140.0.0', 'Windows 10.0.0', 'desktop', 1536, 864, 1528, 738, NULL, NULL, NULL, NULL, '2025-09-12 20:02:22', '2025-09-12 20:02:22'),
('52156a74-037f-466c-81a5-11db005fe7d0', 'f5dad5cf-c3cc-46ae-a59b-3d5017af87ec', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'Chrome 140.0.0', 'Windows 10.0.0', 'desktop', 1536, 864, 1528, 738, NULL, NULL, NULL, NULL, '2025-09-12 20:10:32', '2025-09-12 20:10:32'),
('7143fd2d-f820-4baf-9d09-0e28a5714c26', '652e3588-c96e-418b-9cdb-12de4e1d1efc', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'Chrome 140.0.0', 'Windows 10.0.0', 'desktop', 1536, 864, 1528, 738, NULL, NULL, NULL, NULL, '2025-09-12 20:12:08', '2025-09-12 20:12:08'),
('30c7ca06-f33a-46c0-9904-6983539d06fe', '0402a8e8-2e85-4c30-b518-9cc692d8e1cd', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'Chrome 140.0.0', 'Windows 10.0.0', 'desktop', 1536, 864, 1528, 738, NULL, NULL, NULL, NULL, '2025-09-12 20:22:16', '2025-09-12 20:22:16'),
('135db118-7538-40b7-9944-c35436f04097', '1c014219-95ee-4109-aaff-06f56c111bd7', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'Chrome 140.0.0', 'Windows 10.0.0', 'desktop', 1536, 864, 1528, 738, NULL, NULL, NULL, NULL, '2025-09-13 20:19:25', '2025-09-13 20:19:25'),
('72f5f439-5a8f-4bcc-a2a3-fa1c9681fa6f', 'c9120d07-4ec7-4ff0-9ad8-9e9daf8a7cab', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'Chrome 140.0.0', 'Windows 10.0.0', 'desktop', 1536, 864, 1528, 738, NULL, NULL, NULL, NULL, '2025-09-13 20:20:10', '2025-09-13 20:20:10');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
