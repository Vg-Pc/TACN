-- MySQL dump 10.13  Distrib 8.0.20, for macos10.15 (x86_64)
--
-- Host: 3.1.13.10    Database: tacn
-- ------------------------------------------------------
-- Server version	8.0.22

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `config`
--

DROP TABLE IF EXISTS `config`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `config` (
  `id` int NOT NULL AUTO_INCREMENT,
  `value` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `type` int DEFAULT NULL,
  `created_at` int NOT NULL DEFAULT '1619432870',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `config`
--

LOCK TABLES `config` WRITE;
/*!40000 ALTER TABLE `config` DISABLE KEYS */;
INSERT INTO `config` VALUES (1,'123456',1,1616637550);
/*!40000 ALTER TABLE `config` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customer`
--

DROP TABLE IF EXISTS `customer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `phone_number` varchar(255) NOT NULL,
  `date_of_birth` int DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `tax_code` varchar(255) DEFAULT NULL,
  `representative` varchar(255) DEFAULT NULL,
  `position` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `province_id` int DEFAULT NULL,
  `modified_at` int DEFAULT NULL,
  `created_at` int NOT NULL DEFAULT '1619432870',
  `is_active` int NOT NULL DEFAULT '1',
  `debt` bigint DEFAULT '0',
  `code` varchar(255) NOT NULL,
  `agent_id` int DEFAULT NULL,
  `gender` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `province_id` (`province_id`),
  CONSTRAINT `customer_ibfk_1` FOREIGN KEY (`province_id`) REFERENCES `province` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer`
--

LOCK TABLES `customer` WRITE;
/*!40000 ALTER TABLE `customer` DISABLE KEYS */;
INSERT INTO `customer` VALUES (3,'admin','0957654361',1615350657,'hn','123456','nguyen van a','leader','admin@gmail.com',201,NULL,1616622462,1,13004450,'CUS981714982600',1,NULL),(4,'KH Th??ng','0975545828',1570607973,'H?? N???i','2165132165','anh Nam','Gi??m ?????c','truongthangmt3@gmail.com',201,NULL,1617856348,1,0,'CUS976981978794',8,0),(5,'Winsoft','0987654321',1618456716,'H?? N???i','123456789','Th??ng','Leader','winds@winds.vn',201,NULL,1618299438,1,0,'CUS438835435819',93,0),(6,'Kh??ch h??ng c???a Nam','0962883564',933836762,'H?? N???i','h?? n???i','nam','nh??n vi??n','namtv3@gmail.com',201,NULL,1618909862,1,0,'CUS901779909418',64,0),(7,'KH Nam','0975545829',578301062,'H?? N???i','064441702','anh Nam','Gi??m ?????c','namta@winds.vn',201,NULL,1618909862,1,0,'CUS059912053843',8,0),(8,'admin','0962883555',NULL,NULL,NULL,NULL,NULL,NULL,201,NULL,1618991386,1,0,'CUS895447892939',64,NULL),(9,'Kh??ch h??ng 1','0962883566',1617268288,'H?? N???i','h?? n???i','nam','nh??n vi??n','namta233@gmail.com',201,NULL,1618992073,1,0,'CUS756430758747',95,0),(10,'Nam T???','0975545830',860032053,'H?? T??y','6354621654','anh Nam','Gi??m ?????c','namta@winds.vn',201,NULL,1619012297,1,0,'CUS985008981438',97,0),(11,'Nguy???n Thanh Th???ng','0123456789',944125009,'Thanh Xu??n','123456','123456','None','thangnt@gmail.com',201,NULL,1619071143,1,0,'CUS543186542508',57,0),(12,'KH 1 Th??y ?????i l?? 1','0965520555',1619624846,'H?? N???i','2346576798','Th??y','kh??ng','thuy@gmail.com',201,NULL,1619088180,1,0,'CUS091447092010',102,0),(13,'Kh001','0975545831',1619798190,'Ha noi','4748484','Anh Th??ng','Giam doc','Truongthangmt3@gmail.com',201,NULL,1619088180,1,0,'CUS220501227827',8,0),(14,'Dndmdk','0975545822',1617206365,'Okdjdjdj','E744848','Dndjdnd','74747448','Jejeje@gmail.com',201,NULL,1619088180,1,0,'CUS486020483049',8,0),(15,'Jdfjj','0975545833',1617120069,'Jssjsj','8484848','Jsjej','Jdj??je','Jrrj@gmail.com',201,NULL,1619088180,1,0,'CUS473429478935',8,0),(16,'anh Th??ngKH','0975545835',1270517029,'???dfasdf','3465465','anh nam','Gi??m ?????c','truongthangmt3@gmail.com',201,NULL,1619108187,1,0,'CUS256905251198',8,0),(17,'Tr????ng Qu???c Tu???n','0358812384',1618970462,'Lai Ch??u','1234567890','T??i','Null','tuan@gmail.com',264,NULL,1619142857,1,0,'CUS067654064419',57,1),(18,'Nh??n vi??n 1 t???o KH','0999988888',1617243384,'Li??n linh','12345','12345','Null','kh@gmail.com',207,NULL,1619142857,1,0,'CUS819924814727',104,1),(19,'KH NV1','0999999999',1617589117,'Ph?????ng 2 - D???ch V???ng H???u - C???u Gi???y - H?? N???i','000','000','000','kh@gmail.com',201,NULL,1619142857,1,0,'CUS245537241370',104,1),(20,'anh Th??ng','0975545836',1287887121,'H?? N???i','098098098','anh Nam','Gi??m ?????c','thangnt@winds.vn',201,NULL,1619142857,1,0,'CUS195874198862',102,0),(21,'Nh??n vi??n 1','0987654322',1617243927,'Xa La','987','987','111','nv@gmail.com',201,NULL,1619142857,1,0,'CUS373580373411',105,1),(22,'Kh DL Thu?? ?????i l?? 1','0975545837',1365733747,'H?? N???i','98798798','ThangNT','9873987','thangnt@winds.vn',201,NULL,1619142857,1,0,'CUS411296412380',102,0),(23,'Kh??ch h??ng do nv t???o','0909090909',1283395258,'G?? v???p','99999','ABC','Blank','kh@gmail.com',267,NULL,1619142857,1,0,'CUS808270802228',105,1),(24,'kh Th??ng 01','0975545838',NULL,NULL,'','','',NULL,NULL,NULL,1619142857,1,0,'CUS252385258140',8,NULL),(25,'KH do ADmin t???o','0777777777',949546457,'Tr???n Ph?? - H?? ????ng','987','ooo','ppp','kh@gmail.com',263,NULL,1619146363,1,0,'CUS669449667065',57,0),(26,'Nh??n vi??n 1','0976763812',1619406622,'H?? T??y','987','ABC','ppp','ncc@gmail.com',208,NULL,1619146363,1,0,'CUS314943318144',57,0),(27,'kh??ch h??ng Ad','0765555555',NULL,NULL,'','','',NULL,206,NULL,1619146363,1,0,'CUS610686619880',57,NULL),(28,'KH th???ng NV t???o 1','0666666666',NULL,NULL,'','','',NULL,204,NULL,1619146363,1,0,'CUS433113436427',105,NULL),(29,'KH do b???n AD','0975645864',NULL,NULL,'','','',NULL,204,NULL,1619146363,1,0,'CUS279562271325',105,NULL),(30,'Kh??ch h??ng ?????i l?? t???o','0345678123',NULL,'','','','',NULL,220,NULL,1619146363,1,0,'CUS362675362480',105,NULL),(31,'KH Th??ng','0975545840',NULL,NULL,'','','',NULL,201,NULL,1619174964,1,-47900,'CUS545051541809',3,NULL),(32,'Anh Th??ng 13','0975545889',1619411541,'H?? N???i','987654321','Nga','PM','thang1@winds.vn',203,NULL,1619259226,1,0,'CUS178980178030',3,1),(33,'Anh Th??ng 2','0975545887',1619411499,'H?? N???i','123456789','Nga','PM','thangnt@winds.vn',201,NULL,1619259226,1,0,'CUS965682966315',3,0),(34,'KH Th??y admin 1','0965520566',1619191548,'H?? N???i','','','','thuy@gmail.com',204,NULL,1619259226,1,0,'CUS731535733898',140,0),(35,'KH Th??y admin 2','0965520569',NULL,NULL,'','','',NULL,203,NULL,1619259226,1,0,'CUS438838435610',140,NULL),(36,'H????ng nh??n vi??n','0976763811',NULL,'','','','',NULL,201,NULL,1619259226,1,0,'CUS474439471135',141,NULL),(37,'Kh??ch h??ng c???a ?????i l??','0976763815',NULL,NULL,'','','',NULL,266,NULL,1619400880,1,0,'CUS124867121958',145,NULL),(38,'Kh??ch h??ng c???a NV','0345687621',NULL,NULL,'','','',NULL,204,NULL,1619400880,1,0,'CUS385640386040',144,NULL),(39,'Kh??ch h??ng c???a NV 2','0976763000',NULL,NULL,'','','',NULL,201,NULL,1619400880,1,0,'CUS885193889868',144,NULL),(40,'Kh??ch h??ng c???a NV3','0987345665',1619757010,'        Test space','test','    Gia ????nh','Nh??n vi??n',NULL,203,NULL,1619411379,1,0,'CUS677584671246',144,NULL),(41,'Kh c???a NV 4','0965432230',NULL,NULL,'    ??gnmhgf','','',NULL,201,NULL,1619411379,1,0,'CUS498278496118',144,NULL),(42,'?????c T??m','0974935629',1619419089,'H?? N???i','123456789','Ch??m Anh','Dev','tamnd@winds.vn',202,NULL,1619411379,0,0,'CUS969117968036',3,0),(43,'?????c T??m 2','0973827164',1619419207,'H?? N???i','123456789','Nh?? Ph????ng','R???t dev','tam2@winds.vn',203,NULL,1619411379,0,0,'CUS132628138414',3,0),(44,'hieplocdev1','0343507126',NULL,NULL,'','','','hieplocdev@gmail.com',201,NULL,1619411379,1,0,'CUS098333099176',151,NULL);
/*!40000 ALTER TABLE `customer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `daysofweek`
--

DROP TABLE IF EXISTS `daysofweek`;
/*!50001 DROP VIEW IF EXISTS `daysofweek`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `daysofweek` AS SELECT 
 1 AS `Mon`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `goods_receipt`
--

DROP TABLE IF EXISTS `goods_receipt`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `goods_receipt` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(255) NOT NULL,
  `note` varchar(255) DEFAULT NULL,
  `staff_id` int NOT NULL,
  `supplier_id` int NOT NULL,
  `store_id` int NOT NULL,
  `goods_price` bigint DEFAULT NULL,
  `total_price` bigint DEFAULT NULL,
  `paid_price` bigint DEFAULT NULL,
  `debt` bigint DEFAULT NULL,
  `payment_type` int NOT NULL DEFAULT '1',
  `modified_at` int DEFAULT NULL,
  `created_at` int NOT NULL DEFAULT '1619432870',
  `is_active` int NOT NULL DEFAULT '1',
  `agent_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `staff_id` (`staff_id`),
  KEY `supplier_id` (`supplier_id`),
  KEY `store_id` (`store_id`),
  CONSTRAINT `goods_receipt_ibfk_206` FOREIGN KEY (`staff_id`) REFERENCES `user` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `goods_receipt_ibfk_207` FOREIGN KEY (`supplier_id`) REFERENCES `supplier` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `goods_receipt_ibfk_208` FOREIGN KEY (`store_id`) REFERENCES `store` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=240 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `goods_receipt`
--

LOCK TABLES `goods_receipt` WRITE;
/*!40000 ALTER TABLE `goods_receipt` DISABLE KEYS */;
INSERT INTO `goods_receipt` VALUES (233,'NH000233',NULL,3,30,40,18000000,18000000,15000000,3000000,1,NULL,1619165507,1,3),(234,'NH000234','aa',3,30,40,7500000,7500000,6000000,1500000,1,NULL,1619174964,1,3),(235,'NH000235','A',3,30,40,2400000,2400000,2000000,400000,1,NULL,1619174964,0,3),(236,'NH000236','',3,30,40,1650000,1650000,2000000,-350000,1,NULL,1619231730,0,3),(237,'NH000237','',3,30,40,1200000,1200000,2000000,-800000,1,NULL,1619232168,1,3),(238,'NH000238','a',3,30,40,750000,750000,700000,50000,1,NULL,1619174964,1,3),(239,'NH000239',NULL,151,35,50,8000000,8000000,400000,7600000,1,NULL,1619411379,1,151);
/*!40000 ALTER TABLE `goods_receipt` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `goods_return`
--

DROP TABLE IF EXISTS `goods_return`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `goods_return` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(255) NOT NULL,
  `note` varchar(255) DEFAULT NULL,
  `first_discount` float NOT NULL,
  `second_discount` float NOT NULL,
  `staff_id` int NOT NULL,
  `customer_id` int NOT NULL,
  `store_id` int NOT NULL,
  `goods_price` bigint DEFAULT NULL,
  `return_price` bigint DEFAULT NULL,
  `modified_at` int DEFAULT NULL,
  `created_at` int NOT NULL DEFAULT '1619432870',
  `is_active` int NOT NULL DEFAULT '1',
  `agent_id` int DEFAULT NULL,
  `total_price` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `staff_id` (`staff_id`),
  KEY `customer_id` (`customer_id`),
  KEY `store_id` (`store_id`),
  CONSTRAINT `goods_return_ibfk_193` FOREIGN KEY (`staff_id`) REFERENCES `user` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `goods_return_ibfk_194` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `goods_return_ibfk_195` FOREIGN KEY (`store_id`) REFERENCES `store` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `goods_return`
--

LOCK TABLES `goods_return` WRITE;
/*!40000 ALTER TABLE `goods_return` DISABLE KEYS */;
INSERT INTO `goods_return` VALUES (3,'RETURN035159032250','',10,10,3,31,40,600000,NULL,NULL,1619420583,1,3,NULL),(4,'RETURN041588045636','',10,10,3,31,40,600000,286000,NULL,1619425827,1,3,NULL),(5,'RETURN084814084651','',10,10,3,31,40,600000,286000,NULL,1619426069,1,3,NULL),(6,'RETURN864034866268','',10,10,3,31,40,600000,286000,NULL,1619426342,1,3,NULL),(7,'RETURN211977219563','',10,10,3,31,40,600000,286000,NULL,1619426534,1,3,NULL),(8,'RETURN152048155789','',10,10,3,31,40,600000,200000,NULL,1619427476,1,3,NULL),(9,'RETURN890963898334','',10,10,3,31,40,600000,200000,NULL,1619427553,1,3,NULL),(10,'RETURN243547245532','',10,10,3,31,40,600000,100000,NULL,1619447340,1,3,486000),(11,'RETURN715868713864','',10,10,3,31,40,600000,100000,NULL,1619449497,1,3,486000),(12,'RETURN818083816869','',10,10,3,31,40,600000,100000,NULL,1619449829,1,3,486000),(13,'RETURN582292587745','',10,10,3,31,40,600000,100000,NULL,1619450920,1,3,486000),(14,'RETURN241798242640','',10,10,3,31,40,600000,100000,NULL,1619450976,1,3,486000),(15,'RETURN263362268843','',10,10,3,31,40,600000,100000,NULL,1619451607,0,3,486000),(16,'RETURN336492338004','',10,10,3,31,40,1200000,100000,NULL,1619451917,1,3,972000),(18,'RETURN761855763154','',10,10,3,31,40,1200000,2000000,NULL,1619452520,1,3,972000),(19,'RETURN698262693333','',10,10,3,31,40,1200000,2000000,NULL,1619452619,1,3,972000);
/*!40000 ALTER TABLE `goods_return` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invoice`
--

DROP TABLE IF EXISTS `invoice`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `invoice` (
  `id` int NOT NULL AUTO_INCREMENT,
  `voucher_type` int NOT NULL DEFAULT '1',
  `invoice_type_id` int NOT NULL,
  `code` varchar(255) NOT NULL,
  `reason` varchar(255) NOT NULL,
  `staff_id` int NOT NULL,
  `customer_id` int DEFAULT NULL,
  `supplier_id` int DEFAULT NULL,
  `amount` bigint DEFAULT NULL,
  `modified_at` int DEFAULT NULL,
  `created_at` int NOT NULL DEFAULT '1619432870',
  `is_active` int NOT NULL DEFAULT '1',
  `agent_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `invoice_type_id` (`invoice_type_id`),
  KEY `staff_id` (`staff_id`),
  KEY `customer_id` (`customer_id`),
  KEY `supplier_id` (`supplier_id`),
  CONSTRAINT `invoice_ibfk_257` FOREIGN KEY (`invoice_type_id`) REFERENCES `invoice_type` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `invoice_ibfk_258` FOREIGN KEY (`staff_id`) REFERENCES `user` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `invoice_ibfk_259` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `invoice_ibfk_260` FOREIGN KEY (`supplier_id`) REFERENCES `supplier` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invoice`
--

LOCK TABLES `invoice` WRITE;
/*!40000 ALTER TABLE `invoice` DISABLE KEYS */;
INSERT INTO `invoice` VALUES (1,1,22,'R004003003918','T???o phi???u thu',139,31,NULL,100000,NULL,1619241026,1,3),(2,1,22,'R340820346811','T???o phi???u thu',139,31,NULL,100000,NULL,1619241198,1,3),(3,2,22,'P710952719503','T???o phi???u thu',139,31,NULL,100000,NULL,1619241198,1,3),(4,2,22,'P901658907520','T???o phi???u thu',139,31,NULL,100000,NULL,1619241575,0,3),(5,2,16,'P938931937257','Tr??? ti???n kh??ch',138,31,NULL,80000,NULL,1619259226,1,3);
/*!40000 ALTER TABLE `invoice` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invoice_type`
--

DROP TABLE IF EXISTS `invoice_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `invoice_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `voucher_type` int NOT NULL DEFAULT '1',
  `modified_at` int DEFAULT NULL,
  `created_at` int NOT NULL DEFAULT '1619432870',
  `is_active` int NOT NULL DEFAULT '1',
  `agent_id` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invoice_type`
--

LOCK TABLES `invoice_type` WRITE;
/*!40000 ALTER TABLE `invoice_type` DISABLE KEYS */;
INSERT INTO `invoice_type` VALUES (1,'phi???u thu',1,NULL,1616545492,0,1),(2,'phi???u nop',1,NULL,1616618360,0,1),(3,'phi???u a',1,NULL,1616630504,0,1),(4,'Phi???u n???p ti???n thu???',2,NULL,1616630837,1,1),(5,'Phi???u phu KH',1,NULL,1616689490,1,1),(6,'phi???u ABC',1,NULL,1616804509,0,1),(7,'Phi??u mua h??ng',2,NULL,1617683207,1,1),(8,'Hoa qu??? th???p h????ng',2,NULL,1618641937,1,8),(9,'Tr??? ti???n nh?? cung c???p',2,NULL,1618641937,1,8),(10,'Tr??? ti???n NCC',2,NULL,1618641937,1,64),(11,'Phi???u Thu c???a VN',1,NULL,1618654537,1,64),(12,'Phi???u thu',1,NULL,1619071143,1,96),(13,'Ph???u chi',2,NULL,1619071143,1,96),(14,'Phi???u t???o m???i',1,NULL,1619146363,1,1),(15,'Phi???u thu',1,NULL,1619165244,1,3),(16,'Phi???u chi',2,NULL,1619165244,1,3),(17,'Phi???u thu',1,NULL,1619165244,1,135),(18,'Phi???u chi',2,NULL,1619165244,1,135),(19,'Phi???u thu',1,NULL,1619165358,1,136),(20,'Phi???u chi',2,NULL,1619165358,1,136),(21,'Phi???u thu',1,NULL,1619165507,1,8),(22,'Phi???u chi',2,NULL,1619165507,1,8),(23,'Ti???n hoa qu??? 1',2,NULL,1619259226,1,3),(24,'Thu c???a KH',1,NULL,1619259226,1,140),(25,'Tr??? ti???n c?? b???n',2,NULL,1619259226,1,140),(26,'Phi???u thu',1,NULL,1619259226,1,142),(27,'Phi???u chi',2,NULL,1619259226,1,142),(28,'Phi???u thu',1,NULL,1619259226,1,138),(29,'Phi???u chi',2,NULL,1619259226,1,138),(30,'Thu c???a NCC',1,NULL,1619259226,1,140),(31,'Phi???u thu',1,NULL,1619259226,1,141),(32,'Phi???u chi',2,NULL,1619259226,1,141),(33,'Phi???u thu',1,NULL,1619259226,1,145),(34,'Phi???u chi',2,NULL,1619259226,1,145),(35,'Phi???u thu',1,NULL,1619400880,1,144),(36,'Phi???u chi',2,NULL,1619400880,1,144),(37,'Phi???u thu',1,NULL,1619400880,1,147),(38,'Phi???u chi',2,NULL,1619400880,1,147),(39,'Phi???u thu',1,NULL,1619401129,1,139),(40,'Phi???u chi',2,NULL,1619401129,1,139),(41,'Phi???u thu',1,NULL,1619411379,1,151),(42,'Phi???u chi',2,NULL,1619411379,1,151),(43,'Phi???u thu',1,NULL,1619411379,1,152),(44,'Phi???u chi',2,NULL,1619411379,1,152);
/*!40000 ALTER TABLE `invoice_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order`
--

DROP TABLE IF EXISTS `order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order` (
  `id` int NOT NULL AUTO_INCREMENT,
  `note` varchar(255) DEFAULT NULL,
  `first_discount` float NOT NULL,
  `second_discount` float NOT NULL,
  `staff_id` int NOT NULL,
  `customer_id` int NOT NULL,
  `store_id` int NOT NULL,
  `goods_price` bigint DEFAULT NULL,
  `total_price` bigint DEFAULT NULL,
  `paid_price` bigint DEFAULT NULL,
  `debt` bigint DEFAULT NULL,
  `sale_type` int NOT NULL DEFAULT '2',
  `payment_type` int NOT NULL DEFAULT '1',
  `modified_at` int DEFAULT NULL,
  `created_at` int NOT NULL DEFAULT '1619432870',
  `is_active` int NOT NULL DEFAULT '1',
  `code` varchar(255) NOT NULL,
  `agent_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `staff_id` (`staff_id`),
  KEY `customer_id` (`customer_id`),
  KEY `store_id` (`store_id`),
  CONSTRAINT `order_ibfk_184` FOREIGN KEY (`staff_id`) REFERENCES `user` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `order_ibfk_185` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `order_ibfk_186` FOREIGN KEY (`store_id`) REFERENCES `store` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=145 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order`
--

LOCK TABLES `order` WRITE;
/*!40000 ALTER TABLE `order` DISABLE KEYS */;
INSERT INTO `order` VALUES (110,'',90,30,138,31,40,120000,87600,90000,-2400,2,2,NULL,1619174964,1,'ORDER319060316612',3),(111,'abc',10,10,139,31,40,600000,594000,186000,408000,2,2,NULL,1619174964,1,'ORDER614263613540',3),(112,'',20,10,3,31,40,600000,588000,588000,0,3,1,NULL,1619187282,1,'RETURN840531845958',3),(113,'',20,10,3,31,40,600000,588000,588000,0,3,1,NULL,1619188444,1,'RETURN452655453101',3),(114,'',20,10,3,31,40,480000,470400,470400,0,3,1,NULL,1619188444,1,'RETURN033970038303',3),(115,'',20,10,3,31,40,480000,470400,470400,0,3,1,NULL,1619188718,1,'RETURN146172142949',3),(116,'',20,10,3,31,40,480000,470400,470400,0,3,1,NULL,1619188718,1,'RETURN858275859551',3),(117,'',20,10,3,31,40,480000,470400,470400,0,3,1,NULL,1619188718,1,'RETURN665582669479',3),(118,'',20,10,3,31,40,480000,470400,470400,0,3,1,NULL,1619188996,1,'RETURN775900778534',3),(119,'',10,10,139,31,40,12000000,11880000,9020000,2860000,2,2,NULL,1619174964,1,'ORDER113497116096',3),(120,'',10,5,139,3,40,12000000,11940000,1000000,10940000,1,1,NULL,1619226354,1,'ORDER982491984400',3),(121,'',10,5,139,3,40,120000,119400,20000,99400,1,1,NULL,1619227087,1,'ORDER647711648491',3),(122,'',10,5,139,3,40,120000,119400,20000,99400,1,1,NULL,1619227178,1,'ORDER661118661909',3),(123,'',10,5,139,31,40,120000,119400,20000,99400,1,1,NULL,1619227311,1,'ORDER711432717994',3),(124,'',10,5,139,31,40,120000,119400,20000,99400,1,1,NULL,1619227549,1,'ORDER318455315966',3),(125,'',10,5,139,31,40,120000,119400,20000,99400,1,1,NULL,1619227637,1,'ORDER000269001993',3),(126,'',10,5,139,31,40,120000,119400,20000,99400,1,1,NULL,1619227637,1,'ORDER619887615574',3),(127,'',10,5,139,31,40,120000,119400,20000,99400,1,1,NULL,1619227896,1,'ORDER064991069125',3),(128,'aaaa',10,10,139,31,40,1200000,1188000,669500,518500,2,1,NULL,1619174964,1,'ORDER671591672985',3),(129,'',10,5,139,31,40,120000,119400,20000,99400,1,1,NULL,1619235740,1,'ORDER064340064893',3),(130,'',10,5,139,31,40,120000,119400,20000,99400,1,1,NULL,1619236415,1,'ORDER917975917671',3),(131,'',10,5,139,31,40,120000,119400,20000,99400,1,1,NULL,1619236836,1,'ORDER613685617978',3),(132,'',10,5,139,31,40,120000,119400,20000,99400,1,1,NULL,1619236922,0,'ORDER209494203248',3),(133,'',10,5,139,31,40,240000,238800,20000,218800,1,1,NULL,1619237130,0,'ORDER531713531267',3),(134,'',10,5,139,31,40,240000,238800,20000,218800,1,1,NULL,1619237130,0,'ORDER576823571759',3),(135,'',10,5,139,31,40,240000,238800,20000,218800,1,1,NULL,1619237130,0,'ORDER186941182246',3),(136,'aaa',10,10,139,31,40,1000000,990000,510000,480000,2,2,NULL,1619259226,1,'ORDER965681964700',3),(137,'',10,5,150,31,40,120000,119400,20000,99400,1,1,NULL,1619419638,1,'ORDER149868145113',139),(140,'',10,5,139,31,40,130000,129350,20000,109350,1,1,NULL,1619421029,1,'ORDER414616418554',3),(141,'',10,5,150,31,40,130000,129350,20000,109350,1,1,NULL,1619422047,1,'ORDER195813192209',139),(144,'',10,5,150,31,40,240000,238800,20000,218800,1,1,NULL,1619428518,1,'ORDER073058073684',139);
/*!40000 ALTER TABLE `order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_product`
--

DROP TABLE IF EXISTS `order_product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_product` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product` json NOT NULL,
  `order_id` int NOT NULL,
  `amount` int NOT NULL,
  `price` bigint NOT NULL,
  `modified_at` int DEFAULT NULL,
  `created_at` int NOT NULL DEFAULT '1619432870',
  `is_active` int NOT NULL DEFAULT '1',
  `agent_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  CONSTRAINT `order_product_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `order` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=148 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_product`
--

LOCK TABLES `order_product` WRITE;
/*!40000 ALTER TABLE `order_product` DISABLE KEYS */;
INSERT INTO `order_product` VALUES (114,'{\"code\": \"K506838504094\", \"price\": 120000, \"amount\": 1, \"discount\": 0}',110,1,120000,NULL,1619174964,1,3),(115,'{\"code\": \"K506838504094\", \"price\": 120000, \"amount\": 5, \"discount\": 0}',111,5,120000,NULL,1619174964,1,3),(123,'{\"code\": \"K506838504094\", \"price\": 120000, \"amount\": 100, \"discount\": 0}',119,100,120000,NULL,1619174964,1,3),(124,'{\"code\": \"K506838504094\", \"price\": 120000, \"amount\": 100, \"discount\": 0}',120,100,120000,NULL,1619226354,1,3),(125,'{\"code\": \"K506838504094\", \"price\": 120000, \"amount\": 1, \"discount\": 0}',121,1,120000,NULL,1619227087,1,3),(126,'{\"code\": \"K506838504094\", \"price\": 120000, \"amount\": 1, \"discount\": 0}',122,1,120000,NULL,1619227178,1,3),(127,'{\"code\": \"K506838504094\", \"price\": 120000, \"amount\": 1, \"discount\": 0}',123,1,120000,NULL,1619227311,1,3),(128,'{\"code\": \"K506838504094\", \"price\": 120000, \"amount\": 1, \"discount\": 0}',124,1,120000,NULL,1619227549,1,3),(129,'{\"code\": \"K506838504094\", \"price\": 120000, \"amount\": 1, \"discount\": 0}',125,1,120000,NULL,1619227637,1,3),(130,'{\"code\": \"K506838504094\", \"price\": 120000, \"amount\": 1, \"discount\": 0}',126,1,120000,NULL,1619227637,1,3),(131,'{\"code\": \"K506838504094\", \"price\": 120000, \"amount\": 1, \"discount\": 0}',127,1,120000,NULL,1619227896,1,3),(132,'{\"code\": \"K506838504094\", \"price\": 120000, \"amount\": 10, \"discount\": 0}',128,10,120000,NULL,1619174964,1,3),(133,'{\"code\": \"K506838504094\", \"price\": 120000, \"amount\": 1, \"discount\": 0}',129,1,120000,NULL,1619235740,1,3),(134,'{\"code\": \"K506838504094\", \"price\": 120000, \"amount\": 1, \"discount\": 0}',130,1,120000,NULL,1619236415,1,3),(135,'{\"code\": \"K506838504094\", \"price\": 120000, \"amount\": 1, \"discount\": 0}',131,1,120000,NULL,1619236836,1,3),(136,'{\"code\": \"K506838504094\", \"price\": 120000, \"amount\": 1, \"discount\": 0}',132,1,120000,NULL,1619236922,0,3),(137,'{\"code\": \"K506838504094\", \"price\": 120000, \"amount\": 2, \"discount\": 0}',133,2,120000,NULL,1619237130,0,3),(138,'{\"code\": \"K506838504094\", \"price\": 120000, \"amount\": 2, \"discount\": 0}',134,2,120000,NULL,1619237130,0,3),(139,'{\"code\": \"K506838504094\", \"price\": 120000, \"amount\": 2, \"discount\": 0}',135,2,120000,NULL,1619237130,0,3),(140,'{\"code\": \"K538583535112\", \"price\": 100000, \"amount\": 10, \"discount\": 0}',136,10,100000,NULL,1619259226,1,3),(142,'{\"code\": \"POS627286621618\", \"amount\": 130, \"agent_id\": 3, \"store_id\": 40, \"is_active\": 1, \"created_at\": 1619186866, \"expired_at\": -1, \"last_price\": null, \"modified_at\": 1619186866, \"import_price\": 75000, \"product_code\": \"K538583535112\", \"product_name\": \"V??y\", \"product_unit\": \"Chi???c\", \"product_category\": \"Th??i trang n???\"}',137,1,120000,NULL,1619419638,1,139),(143,'{\"code\": \"POS627286621618\", \"amount\": 129, \"agent_id\": 3, \"store_id\": 40, \"is_active\": 1, \"created_at\": 1619186866, \"expired_at\": -1, \"last_price\": null, \"modified_at\": 1619186866, \"import_price\": 75000, \"product_code\": \"K538583535112\", \"product_name\": \"V??y\", \"product_unit\": \"Chi???c\", \"product_category\": \"Th??i trang n???\"}',140,1,120000,NULL,1619421029,1,3),(144,'{\"code\": \"POS707553705427\", \"amount\": 27, \"agent_id\": 3, \"store_id\": 40, \"is_active\": 1, \"created_at\": 1619174537, \"expired_at\": -1, \"last_price\": null, \"modified_at\": 1619174537, \"import_price\": 90000, \"product_code\": \"K506838504094\", \"product_name\": \"Qu???n ????i nam\", \"product_unit\": \"T??\", \"product_category\": \"Th???i trang nam\"}',140,1,10000,NULL,1619421029,1,3),(145,'{\"code\": \"POS627286621618\", \"amount\": 128, \"agent_id\": 3, \"store_id\": 40, \"is_active\": 1, \"created_at\": 1619186866, \"expired_at\": -1, \"last_price\": null, \"modified_at\": 1619186866, \"import_price\": 75000, \"product_code\": \"K538583535112\", \"product_name\": \"V??y\", \"product_unit\": \"Chi???c\", \"product_category\": \"Th??i trang n???\"}',141,1,120000,NULL,1619422047,1,139),(146,'{\"code\": \"POS707553705427\", \"amount\": 26, \"agent_id\": 3, \"store_id\": 40, \"is_active\": 1, \"created_at\": 1619174537, \"expired_at\": -1, \"last_price\": null, \"modified_at\": 1619174537, \"import_price\": 90000, \"product_code\": \"K506838504094\", \"product_name\": \"Qu???n ????i nam\", \"product_unit\": \"T??\", \"product_category\": \"Th???i trang nam\"}',141,1,10000,NULL,1619422047,1,139),(147,'{\"code\": \"POS707553705427\", \"amount\": 55, \"agent_id\": 3, \"store_id\": 40, \"is_active\": 1, \"created_at\": 1619174537, \"expired_at\": -1, \"last_price\": null, \"modified_at\": 1619174537, \"import_price\": 90000, \"product_code\": \"K506838504094\", \"product_name\": \"Qu???n ????i nam\", \"product_unit\": \"T??\", \"product_category\": \"Th???i trang nam\"}',144,2,120000,NULL,1619428518,1,139);
/*!40000 ALTER TABLE `order_product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `unit_id` int NOT NULL,
  `product_category_id` int NOT NULL,
  `retail_price` bigint DEFAULT NULL,
  `wholesale_price` bigint DEFAULT NULL,
  `import_price` bigint DEFAULT NULL,
  `modified_at` int DEFAULT NULL,
  `created_at` int NOT NULL DEFAULT '1619432870',
  `is_active` int NOT NULL DEFAULT '1',
  `last_price` bigint DEFAULT NULL,
  `agent_id` int DEFAULT NULL,
  `last_import_price` int DEFAULT NULL,
  `last_retail_price` int DEFAULT NULL,
  `last_wholesale_price` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `unit_id` (`unit_id`),
  KEY `product_category_id` (`product_category_id`),
  CONSTRAINT `product_ibfk_129` FOREIGN KEY (`unit_id`) REFERENCES `unit` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `product_ibfk_130` FOREIGN KEY (`product_category_id`) REFERENCES `product_category` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=88 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` VALUES (16,'TSDJSPO','c??m ng??',1,1,60000,40000,100000,NULL,1616231539,0,NULL,1,NULL,NULL,NULL),(17,'TSDJSPL','c??m ng??',1,1,60000,40000,100000,NULL,1616231568,0,NULL,1,NULL,NULL,NULL),(18,'TSDJSPY','c??m ng??',1,1,60000,40000,100000,NULL,1616232332,0,NULL,1,NULL,NULL,NULL),(19,'TACN764653763627','c??m c??',1,1,60000,40000,100000,1618904038,1616233533,1,NULL,1,700,NULL,NULL),(20,'TACN587055589538','c??m heo',1,1,60000,40000,100000,1617840754,1616233533,1,NULL,1,100001,NULL,NULL),(21,'TACN494691498731','c??m l???n',5,2,60000,40000,100000,NULL,1616552811,1,NULL,1,NULL,NULL,NULL),(22,'TACN783949789380','c??m g??',6,2,60000,40000,100000,1618904038,1616644129,1,NULL,1,600,NULL,NULL),(23,'TACN577901571581','C??m l???n',6,4,1000000,1230000,1000000,NULL,1616989860,1,NULL,1,NULL,NULL,NULL),(24,'TACN445816443404','C??m g??',6,4,1500000,130000,100000,NULL,1617070622,1,NULL,1,NULL,NULL,NULL),(25,'TACN675015678757','C??m l???n',6,4,100000,95000,90000,NULL,1617070622,1,NULL,1,NULL,NULL,NULL),(26,'TACN462278469518','V???c xin h5n1',8,9,45000,40000,25000,1618455697,1617450651,1,NULL,8,900,NULL,NULL),(27,'TACN105587107916','Thu???c gin',8,9,10000,9000,5000,1618367332,1617450651,1,NULL,8,900,NULL,NULL),(28,'TACN095067094591','C??m l???n',3,3,10000000,80000,500000,1619165785,1617450651,1,NULL,1,500000,NULL,NULL),(29,'TACN769055763523','?????u t????ng h???t',11,4,10000000,80000,60000,1619065955,1617450651,1,NULL,1,600,NULL,NULL),(30,'TACN996206999440','Rau mu???ng',19,18,7000,5000,3000,1618910216,1617856348,1,NULL,64,3000,NULL,NULL),(31,'TACN557473554692','&^%',16,14,-5,-3,-3,NULL,1618227684,1,NULL,51,NULL,NULL,NULL),(32,'TACN235411239757','123',16,17,0,0,0,NULL,1618227684,1,NULL,51,NULL,NULL,NULL),(33,'TACN021121025239','c??m',16,16,1,1,1,NULL,1618227684,1,NULL,51,NULL,NULL,NULL),(34,'TACN693886695335','th???c ??n cho m??o',16,17,23000,2286,0,NULL,1618227684,1,NULL,51,NULL,NULL,NULL),(35,'TACN989794986322','k???o ng???m',16,17,25600,120000,0,NULL,1618227684,1,NULL,51,NULL,NULL,NULL),(36,'TACN879347871680','k???o',22,20,1,2,0,NULL,1618227684,1,NULL,51,NULL,NULL,NULL),(37,'TACN447334442404','c??m',17,16,2,2,2,NULL,1618227684,1,NULL,51,NULL,NULL,NULL),(38,'TACN126278128248','B??nh m??',10,7,10000,8000,5000,1618847459,1618299438,1,NULL,8,5000,NULL,NULL),(39,'TACN974992972670','S???a milo',8,9,100000,80000,60000,1618542420,1618299438,1,NULL,8,60000,NULL,NULL),(40,'TACN563998567785','K???o d???o',18,15,40000,30000,20000,1618542420,1618299438,1,NULL,8,20000,NULL,NULL),(41,'TACN516105518858','B??nh gi??? nhi???t',15,9,179000,150000,100000,1618542420,1618299438,1,NULL,8,100000,NULL,NULL),(42,'TACN407111405758','G???i ??m',10,8,300000,275000,200000,1618542420,1618299438,1,NULL,8,200000,NULL,NULL),(43,'TACN434320433841','Th???a ??n h???n h???p d???ng vi??n gia c???m',6,8,550000,445000,350000,1618542420,1618299438,1,NULL,8,350000,NULL,NULL),(44,'TACN913427912175','Th???c ??n h???n h???p cho heo con',6,8,270000,234000,200000,1618629803,1618299438,1,NULL,8,200000,NULL,NULL),(45,'TACN331133336205','Th???c ??n d???ng vi??n cho heo 2 th??ng tu???i',6,8,600000,550000,500000,1618542420,1618299438,1,NULL,8,500000,NULL,NULL),(46,'TACN341540346859','Thu???c th?? y VIA - Kh???p',10,9,60000,55000,30000,NULL,1618299438,1,NULL,8,NULL,NULL,NULL),(47,'TACN574955578498','Gluco - Thu???c th?? y',10,9,85000,82000,80000,NULL,1618299438,1,NULL,8,NULL,NULL,NULL),(48,'TACN396361399984','Lipitor - Ch???ng c??m g??',18,15,76000,66000,47000,NULL,1618299438,1,NULL,8,NULL,NULL,NULL),(49,'TACN265066265835','Medivac AI - Thu???c c??m g??',15,15,130000,85000,55000,NULL,1618299438,1,NULL,8,NULL,NULL,NULL),(50,'TACN648476643259','Vaccin c??m gia c???m H5N1',18,15,120000,95000,80000,1618629693,1618299438,1,NULL,8,80000,NULL,NULL),(51,'TACN415382412025','Ph??n b??n h???u c?? vi sinh HUMIC',6,7,80000,65000,50000,NULL,1618299438,1,NULL,8,NULL,NULL,NULL),(52,'TACN570532574873','Ph??n h???u c?? vi sinh S??ng Gianh',6,7,135000,125000,100000,1618563523,1618542887,1,NULL,8,100000,NULL,NULL),(53,'TACN799940797540','Thu???c th?? y - FiveTylan',15,9,50000,37000,25000,1618842347,1618542887,1,NULL,8,25000,NULL,NULL),(54,'TACN221047227509','Thu???c Cytovet',9,9,35000,25000,15000,1618842347,1618542887,1,NULL,8,15000,NULL,NULL),(55,'TACN359855353104','Th???c ??n h???n h???p cho g?? l??ng m??u',6,8,160000,150000,120000,1618987115,1618542887,1,NULL,8,120000,NULL,NULL),(56,'TACN708361703683','?????m ?????c L?? - 45',6,8,230000,200000,185000,NULL,1618542887,1,NULL,8,NULL,NULL,NULL),(57,'TACN482870486197','Th???c ??n ?????m ?????c cho heo th???t',6,8,215000,195000,180000,1618842347,1618542887,1,NULL,8,180000,NULL,NULL),(58,'TACN215577218277','?????m ?????c Hanofeet',6,8,185000,160000,145000,1618557515,1618542887,1,NULL,8,145000,NULL,NULL),(59,'TACN742685745086','Th???c ??n ch??n nu??i Vega Feed',6,8,123000,100000,95000,1619082993,1618542887,1,NULL,8,95000,NULL,NULL),(60,'TACN741595741174','Thu???c c??m g?? - v???t con',18,15,15000,12000,9000,1618629693,1618542887,1,NULL,8,9000,NULL,NULL),(61,'TACN731502734278','V??? b??o gia c???m - t??ng tr???ng',18,8,55000,30000,25000,1619080894,1618542887,1,NULL,8,25000,NULL,NULL),(62,'TACN676539677002','S???a Milo',31,44,32000,28000,25000,NULL,1618890494,1,NULL,93,NULL,NULL,NULL),(63,'TACN039156032707','S???a TH True Milk',32,44,35000,30000,28000,1619079848,1618890494,1,NULL,93,28000,NULL,NULL),(64,'K495916499245','B??nh bao',19,18,4000,3000,2000,1618910216,1618909862,1,NULL,64,2000,NULL,NULL),(65,'K393053394428','Rau mu???ng',33,46,5000,4000,3000,1618996604,1618992073,1,NULL,95,3000,NULL,NULL),(66,'K974855974185','B??nh bao nh??n th???t',34,47,7000,6000,5000,1618996931,1618992073,1,NULL,95,5000,NULL,NULL),(67,'K734163736306','Rau mu???ng',35,48,6000,5000,4000,1619070293,1618992073,1,NULL,96,4000,NULL,NULL),(68,'K301394304016','MacbookPro 16inch',36,49,56000000,55000000,50000000,1619056241,1619012297,1,NULL,97,50000000,NULL,NULL),(69,'K245511248949','C??m g???o',37,50,150000,120000,100000,NULL,1619071143,1,NULL,57,NULL,NULL,NULL),(70,'K314081315724','C??m vi??n cho c??',38,50,20000,18000,15000,NULL,1619071143,1,NULL,57,NULL,NULL,NULL),(71,'K446585448970','C??m v???t',37,50,220000,200000,170000,NULL,1619071143,1,NULL,57,NULL,NULL,NULL),(72,'K351492359155','Rau c???',39,51,10000,9000,7000,NULL,1619071143,1,NULL,57,NULL,NULL,NULL),(73,'K268972262368','NG?? H???T XU???T KH???U S??? L?????NG L???N',41,53,20000,15000,12000,NULL,1619088180,1,NULL,102,NULL,NULL,NULL),(74,'K576288576990','B?? ng?? t??ch c???n',43,52,30000,28000,23000,NULL,1619088180,1,NULL,102,NULL,NULL,NULL),(75,'K278995275436','B???t ?????u n??nh',7,3,100000,90000,95000,NULL,1619146363,1,NULL,1,NULL,NULL,NULL),(76,'K494781496435','Qu???n ??o',26,22,50000,45000,40000,NULL,1619146363,1,NULL,51,NULL,NULL,NULL),(77,'K228281226730','Th???c ??n cho gia c???m',26,24,122,0,0,NULL,1619146363,1,NULL,51,NULL,NULL,NULL),(78,'K467738469548','C??m heo t??ng tr???ng',25,16,10,100000,1000000,NULL,1619146363,1,NULL,51,NULL,NULL,NULL),(79,'K010902013650','Thu???c c??m g??',25,37,21,123456,123456,NULL,1619165507,1,NULL,51,NULL,NULL,NULL),(80,'K506838504094','Qu???n ????i nam',44,54,120000,10000,90000,1619232173,1619165507,1,NULL,3,90000,NULL,NULL),(81,'K538583535112','V??y',45,55,100000,90000,75000,1619234003,1619174964,1,NULL,3,75000,NULL,NULL),(82,'K090131098053','Qu???n ????i nam',44,54,95000,90000,80000,NULL,1619174964,1,NULL,3,NULL,NULL,NULL),(83,'K404323408183','NG?? H???T XU???T KH???U S??? L?????NG L???N',46,56,20000,18000,15000,NULL,1619259226,1,NULL,140,NULL,NULL,NULL),(84,'K971425972158','B?? ng?? t??ch c???n',48,58,25000,22000,18000,NULL,1619259226,1,NULL,140,NULL,NULL,NULL),(85,'K248109244024','C??m con c??',49,60,0,0,0,NULL,1619411379,1,NULL,147,NULL,NULL,NULL),(86,'K775928778698','C??m con c??',49,60,23000,23000,23000,NULL,1619411379,1,NULL,147,NULL,NULL,NULL),(87,'K494624491742','Quan dui',52,62,100000,90000,80000,1619421362,1619411379,1,NULL,151,80000,NULL,NULL);
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_category`
--

DROP TABLE IF EXISTS `product_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_category` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `modified_at` int DEFAULT NULL,
  `created_at` int NOT NULL DEFAULT '1619432870',
  `is_active` int NOT NULL DEFAULT '1',
  `agent_id` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_category`
--

LOCK TABLES `product_category` WRITE;
/*!40000 ALTER TABLE `product_category` DISABLE KEYS */;
INSERT INTO `product_category` VALUES (1,'hang kho',NULL,1615463835,0,1),(2,'H??ng ????ng l???nh',NULL,1615463835,1,1),(3,'B???t kh??',NULL,1616689272,1,1),(4,'B???t C??m',NULL,1616689272,1,1),(5,'Th???c ??n ch??n nu??i',NULL,1616689272,1,1),(6,'C??m c??',NULL,1617070622,1,1),(7,'Ph??n h???u c??',NULL,1617196747,1,8),(8,'C??m',NULL,1617196747,1,8),(9,'Thu???c th?? y',NULL,1617196747,1,8),(10,'????ng l???nh',NULL,1617287244,1,58),(11,'B???t ng??',NULL,1617288548,1,55),(12,'B???t n???',NULL,1617288548,1,55),(13,'L??a m??',NULL,1617594877,1,1),(14,'????? kh??',NULL,1617621381,1,51),(15,'Thu???c c??m g??',NULL,1617621381,1,8),(16,'C??m',NULL,1617682390,1,51),(17,'Thu???c th?? y',NULL,1617682853,1,51),(18,'Rau s???ch',NULL,1617856348,1,64),(19,'Thu???c th?? y',NULL,1618227684,1,87),(20,'B??nh k???o',NULL,1618227684,1,51),(21,'S???a',NULL,1618227684,1,51),(22,'S???a b???t',NULL,1618227684,1,51),(23,'M???',NULL,1618227684,1,51),(24,'G???o',NULL,1618227684,1,51),(25,'Qu???n ??o',NULL,1618227684,1,51),(26,'@#',NULL,1618227684,1,51),(27,'B???m',NULL,1618227684,1,51),(28,'D???u g???i',NULL,1618227684,1,51),(29,'D???u x???',NULL,1618227684,1,51),(30,'K???o',NULL,1618227684,1,87),(31,'V??y',NULL,1618227684,1,87),(32,'????? ch??i',NULL,1618227684,1,87),(33,'https://kenh14.vn/',NULL,1618227684,1,51),(34,'456',NULL,1618227684,1,51),(35,'098',NULL,1618299438,1,51),(36,'12345',NULL,1618299438,1,51),(37,'b??nh',NULL,1618299438,1,51),(38,'k???o',NULL,1618299438,1,51),(39,'s???a t??i',NULL,1618299438,1,51),(40,'s???a c?? ???????ng',NULL,1618299438,1,51),(41,'987',NULL,1618299438,1,51),(42,'s???a kh??ng ???????ng',NULL,1618299438,1,87),(43,'th???c ph???m',NULL,1618890494,1,93),(44,'th???c u???ng',NULL,1618890494,1,93),(45,'th???c ph???m ch???c n??ng',NULL,1618890494,1,93),(46,'Rau',NULL,1618992073,1,95),(47,'b??nh',NULL,1618992073,1,95),(48,'Rau',NULL,1618992073,1,96),(49,'Macbook',NULL,1619012297,1,97),(50,'C??m',NULL,1619071143,1,57),(51,'Rau',NULL,1619071143,1,57),(52,'Ph??n h???u c??',NULL,1619088180,1,102),(53,'C??m g??',NULL,1619088180,1,102),(54,'Th???i trang nam',NULL,1619165507,1,3),(55,'Th??i trang n??? ?????p',NULL,1619174964,1,3),(56,'C??m',NULL,1619259226,1,140),(57,'????? kh??',NULL,1619259226,1,140),(58,'Ph??n h???u c??',NULL,1619259226,1,140),(59,'C??m ch??n nu??i',NULL,1619400880,1,147),(60,'Thu???c th?? y',NULL,1619400880,1,147),(61,'Thu???c c??m',NULL,1619400880,1,147),(62,'Thoi trang vn',NULL,1619411379,1,151),(63,'Th???i trang cho b??',NULL,1619411379,1,3);
/*!40000 ALTER TABLE `product_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_image`
--

DROP TABLE IF EXISTS `product_image`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_image` (
  `id` int NOT NULL AUTO_INCREMENT,
  `url` varchar(2000) NOT NULL,
  `product_id` int NOT NULL,
  `modified_at` int DEFAULT NULL,
  `created_at` int NOT NULL DEFAULT '1619432870',
  `is_active` int NOT NULL DEFAULT '1',
  `agent_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `product_image_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=228 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_image`
--

LOCK TABLES `product_image` WRITE;
/*!40000 ALTER TABLE `product_image` DISABLE KEYS */;
INSERT INTO `product_image` VALUES (1,'https://www.google.com/imgres?imgurl=https%3A%2F%2Fconco-cms-production.s3-ap-southeast-1.amazonaws.com%2Fiblock%2F3ee%2F3ee083f3448818982168dd247b10059d.png&imgrefurl=https%3A%2F%2Fconco.com.vn%2Fsan-pham-chi-tiet%2Fcon-co-c42&tbnid=pNVnYcb0AusGqM&vet=12ahUKEwj9h5eTw77vAhUxQPUHHeHmBnQQMygDegUIARCTAQ..i&docid=NqLrlBvQfg656M&w=500&h=654&q=c%C3%A1m%20c%C3%B2&ved=2ahUKEwj9h5eTw77vAhUxQPUHHeHmBnQQMygDegUIARCTAQ',16,NULL,1616231539,1,1),(2,'https://www.google.com/imgres?imgurl=https%3A%2F%2Fconco-cms-production.s3-ap-southeast-1.amazonaws.com%2Fiblock%2F3ee%2F3ee083f3448818982168dd247b10059d.png&imgrefurl=https%3A%2F%2Fconco.com.vn%2Fsan-pham-chi-tiet%2Fcon-co-c42&tbnid=pNVnYcb0AusGqM&vet=12ahUKEwj9h5eTw77vAhUxQPUHHeHmBnQQMygDegUIARCTAQ..i&docid=NqLrlBvQfg656M&w=500&h=654&q=c%C3%A1m%20c%C3%B2&ved=2ahUKEwj9h5eTw77vAhUxQPUHHeHmBnQQMygDegUIARCTAQ',17,NULL,1616231568,1,1),(3,'https://www.google.com/imgres?imgurl=https%3A%2F%2Fconco-cms-production.s3-ap-southeast-1.amazonaws.com%2Fiblock%2F3ee%2F3ee083f3448818982168dd247b10059d.png&imgrefurl=https%3A%2F%2Fconco.com.vn%2Fsan-pham-chi-tiet%2Fcon-co-c42&tbnid=pNVnYcb0AusGqM&vet=12ahUKEwj9h5eTw77vAhUxQPUHHeHmBnQQMygDegUIARCTAQ..i&docid=NqLrlBvQfg656M&w=500&h=654&q=c%C3%A1m%20c%C3%B2&ved=2ahUKEwj9h5eTw77vAhUxQPUHHeHmBnQQMygDegUIARCTAQ',18,NULL,1616232332,1,1),(4,'https://www.google.com/imgres?imgurl=https%3A%2F%2Fconco-cms-production.s3-ap-southeast-1.amazonaws.com%2Fiblock%2F3ee%2F3ee083f3448818982168dd247b10059d.png&imgrefurl=https%3A%2F%2Fconco.com.vn%2Fsan-pham-chi-tiet%2Fcon-co-c42&tbnid=pNVnYcb0AusGqM&vet=12ahUKEwj9h5eTw77vAhUxQPUHHeHmBnQQMygDegUIARCTAQ..i&docid=NqLrlBvQfg656M&w=500&h=654&q=c%C3%A1m%20c%C3%B2&ved=2ahUKEwj9h5eTw77vAhUxQPUHHeHmBnQQMygDegUIARCTAQ',19,NULL,1616233533,1,1),(5,'https://www.google.com/imgres?imgurl=https%3A%2F%2Fconco-cms-production.s3-ap-southeast-1.amazonaws.com%2Fiblock%2F3ee%2F3ee083f3448818982168dd247b10059d.png&imgrefurl=https%3A%2F%2Fconco.com.vn%2Fsan-pham-chi-tiet%2Fcon-co-c42&tbnid=pNVnYcb0AusGqM&vet=12ahUKEwj9h5eTw77vAhUxQPUHHeHmBnQQMygDegUIARCTAQ..i&docid=NqLrlBvQfg656M&w=500&h=654&q=c%C3%A1m%20c%C3%B2&ved=2ahUKEwj9h5eTw77vAhUxQPUHHeHmBnQQMygDegUIARCTAQ',20,NULL,1616233533,0,1),(6,'https://www.google.com/imgres?imgurl=https%3A%2F%2Fconco-cms-production.s3-ap-southeast-1.amazonaws.com%2Fiblock%2F3ee%2F3ee083f3448818982168dd247b10059d.png&imgrefurl=https%3A%2F%2Fconco.com.vn%2Fsan-pham-chi-tiet%2Fcon-co-c42&tbnid=pNVnYcb0AusGqM&vet=12ahUKEwj9h5eTw77vAhUxQPUHHeHmBnQQMygDegUIARCTAQ..i&docid=NqLrlBvQfg656M&w=500&h=654&q=c%C3%A1m%20c%C3%B2&ved=2ahUKEwj9h5eTw77vAhUxQPUHHeHmBnQQMygDegUIARCTAQ',20,NULL,1616233853,0,1),(7,'https://www.google.com/imgres?imgurl=https%3A%2F%2Fconco-cms-production.s3-ap-southeast-1.amazonaws.com%2Fiblock%2F3ee%2F3ee083f3448818982168dd247b10059d.png&imgrefurl=https%3A%2F%2Fconco.com.vn%2Fsan-pham-chi-tiet%2Fcon-co-c42&tbnid=pNVnYcb0AusGqM&vet=12ahUKEwj9h5eTw77vAhUxQPUHHeHmBnQQMygDegUIARCTAQ..i&docid=NqLrlBvQfg656M&w=500&h=654&q=c%C3%A1m%20c%C3%B2&ved=2ahUKEwj9h5eTw77vAhUxQPUHHeHmBnQQMygDegUIARCTAQ',20,NULL,1616233853,1,1),(8,'https://www.google.com/imgres?imgurl=https%3A%2F%2Fconco-cms-production.s3-ap-southeast-1.amazonaws.com%2Fiblock%2F3ee%2F3ee083f3448818982168dd247b10059d.png&imgrefurl=https%3A%2F%2Fconco.com.vn%2Fsan-pham-chi-tiet%2Fcon-co-c42&tbnid=pNVnYcb0AusGqM&vet=12ahUKEwj9h5eTw77vAhUxQPUHHeHmBnQQMygDegUIARCTAQ..i&docid=NqLrlBvQfg656M&w=500&h=654&q=c%C3%A1m%20c%C3%B2&ved=2ahUKEwj9h5eTw77vAhUxQPUHHeHmBnQQMygDegUIARCTAQ',21,NULL,1616552811,1,1),(9,'https://www.google.com/imgres?imgurl=https%3A%2F%2Fconco-cms-production.s3-ap-southeast-1.amazonaws.com%2Fiblock%2F3ee%2F3ee083f3448818982168dd247b10059d.png&imgrefurl=https%3A%2F%2Fconco.com.vn%2Fsan-pham-chi-tiet%2Fcon-co-c42&tbnid=pNVnYcb0AusGqM&vet=12ahUKEwj9h5eTw77vAhUxQPUHHeHmBnQQMygDegUIARCTAQ..i&docid=NqLrlBvQfg656M&w=500&h=654&q=c%C3%A1m%20c%C3%B2&ved=2ahUKEwj9h5eTw77vAhUxQPUHHeHmBnQQMygDegUIARCTAQ',22,NULL,1616644129,1,1),(10,'http://3.1.13.10:8700/tacn161703901556325.jpeg',23,NULL,1616989860,0,1),(11,'http://3.1.13.10:8700/tacn161703901556325.jpeg',23,NULL,1616989860,0,1),(12,'http://3.1.13.10:8700/tacn161703901556325.jpeg',23,NULL,1616989860,0,1),(13,'http://3.1.13.10:8700/tacn161703901556325.jpeg',23,NULL,1616989860,0,1),(14,'http://3.1.13.10:8700/tacn161707116424625.jpeg',24,NULL,1617070622,0,1),(15,'http://3.1.13.10:8700/tacn161707116424625.jpeg',24,NULL,1617070622,0,1),(16,'http://3.1.13.10:8700/tacn161707116424625.jpeg',24,NULL,1617070622,0,1),(17,'http://3.1.13.10:8700/tacn161707116424625.jpeg',24,NULL,1617070622,0,1),(18,'http://3.1.13.10:8700/tacn161707116424625.jpeg',24,NULL,1617070622,0,1),(19,'http://3.1.13.10:8700/tacn161707116424625.jpeg',24,NULL,1617070622,0,1),(20,'http://3.1.13.10:8700/tacn161707116424625.jpeg',24,NULL,1617070622,0,1),(21,'http://3.1.13.10:8700/tacn161707116424625.jpeg',24,NULL,1617070622,0,1),(22,'http://3.1.13.10:8700/tacn161707116424625.jpeg',24,NULL,1617070622,0,1),(23,'http://3.1.13.10:8700/tacn161707116424625.jpeg',24,NULL,1617070622,0,1),(24,'http://3.1.13.10:8700/tacn161707116424625.jpeg',24,NULL,1617070622,0,1),(25,'http://3.1.13.10:8700/tacn161707116424625.jpeg',24,NULL,1617070622,0,1),(26,'http://3.1.13.10:8700/tacn161707116424625.jpeg',24,NULL,1617070622,0,1),(27,'http://3.1.13.10:8700/tacn161707116424625.jpeg',24,NULL,1617070622,0,1),(28,'http://3.1.13.10:8700/tacn161707116424625.jpeg',24,NULL,1617070622,0,1),(29,'http://3.1.13.10:8700/tacn161707116424625.jpeg',24,NULL,1617070622,0,1),(30,'http://3.1.13.10:8700/tacn161707116424625.jpeg',24,NULL,1617070622,0,1),(31,'http://3.1.13.10:8700/tacn161707116424625.jpeg',24,NULL,1617070622,0,1),(32,'http://3.1.13.10:8700/tacn161707116424625.jpeg',24,NULL,1617070622,0,1),(33,'http://3.1.13.10:8700/tacn161707116424625.jpeg',24,NULL,1617070622,0,1),(34,'http://3.1.13.10:8700/tacn161707116424625.jpeg',24,NULL,1617070622,0,1),(35,'http://3.1.13.10:8700/tacn161707116424625.jpeg',24,NULL,1617070622,0,1),(36,'http://3.1.13.10:8700/tacn161707116424625.jpeg',24,NULL,1617070622,0,1),(37,'http://3.1.13.10:8700/tacn161707116424625.jpeg',24,NULL,1617070622,0,1),(38,'http://3.1.13.10:8700/tacn161707116424625.jpeg',24,NULL,1617070622,0,1),(39,'http://3.1.13.10:8700/tacn161707116424625.jpeg',24,NULL,1617070622,0,1),(40,'http://3.1.13.10:8700/tacn161707116424625.jpeg',24,NULL,1617070622,1,1),(41,'http://3.1.13.10:8700/tacn161707268594282.png',24,NULL,1617070622,1,1),(42,'http://3.1.13.10:8700/tacn161707315607434.png',25,NULL,1617070622,0,1),(43,'http://3.1.13.10:8700/tacn161707315607434.png',25,NULL,1617070622,0,1),(44,'http://3.1.13.10:8700/tacn16170731865797.jpeg',25,NULL,1617070622,0,1),(45,'http://3.1.13.10:8700/tacn161754878431441.jpeg',26,NULL,1617450651,1,NULL),(46,'http://3.1.13.10:8700/tacn161754878435883.jpeg',26,NULL,1617450651,1,NULL),(47,'http://3.1.13.10:8700/tacn161754887062893.jpeg',27,NULL,1617450651,0,NULL),(48,'http://3.1.13.10:8700/tacn1617588670367100.jpeg',28,NULL,1617450651,0,NULL),(49,'http://3.1.13.10:8700/tacn161759455699861.png',29,NULL,1617450651,0,NULL),(50,'http://3.1.13.10:8700/tacn161759455699861.png',29,NULL,1617594877,0,NULL),(51,'http://3.1.13.10:8700/tacn161759547498774.jpeg',29,NULL,1617594877,0,NULL),(52,'http://3.1.13.10:8700/tacn1617588670367100.jpeg',28,NULL,1617594877,1,NULL),(53,'http://3.1.13.10:8700/tacn161759549803635.png',28,NULL,1617594877,1,NULL),(54,'http://3.1.13.10:8700/tacn161754887062893.jpeg',27,NULL,1617683207,1,NULL),(55,'http://3.1.13.10:8700/tacn161770496456067.jpeg',27,NULL,1617683207,1,NULL),(56,'http://3.1.13.10:8700/tacn161785706922166.jpeg',30,NULL,1617856348,1,NULL),(57,'http://3.1.13.10:8700/tacn161823873344692.jpeg',31,NULL,1618227684,1,NULL),(58,'http://3.1.13.10:8700/tacn161823911185825.jpeg',32,NULL,1618227684,1,NULL),(59,'http://3.1.13.10:8700/tacn161823920850215.jpeg',33,NULL,1618227684,1,NULL),(60,'http://3.1.13.10:8700/tacn16182408628052.jpeg',34,NULL,1618227684,1,NULL),(61,'http://3.1.13.10:8700/tacn161824086408877.jpeg',34,NULL,1618227684,1,NULL),(62,'http://3.1.13.10:8700/tacn161824086484924.jpeg',34,NULL,1618227684,1,NULL),(63,'http://3.1.13.10:8700/tacn161824086552270.jpeg',34,NULL,1618227684,1,NULL),(64,'http://3.1.13.10:8700/tacn161824086609318.jpeg',34,NULL,1618227684,1,NULL),(65,'http://3.1.13.10:8700/tacn161824086649513.jpeg',34,NULL,1618227684,1,NULL),(66,'http://3.1.13.10:8700/tacn161824094943688.jpeg',35,NULL,1618227684,0,NULL),(67,'http://3.1.13.10:8700/tacn161824094943688.jpeg',35,NULL,1618227684,1,NULL),(68,'http://3.1.13.10:8700/tacn161824116512985.jpeg',35,NULL,1618227684,1,NULL),(69,'http://3.1.13.10:8700/tacn161828147817715.jpeg',36,NULL,1618227684,1,NULL),(70,'http://3.1.13.10:8700/tacn161828234386014.jpeg',37,NULL,1618227684,1,NULL),(71,'http://3.1.13.10:8700/tacn161759455699861.png',29,NULL,1618299438,1,NULL),(72,'http://3.1.13.10:8700/tacn161759547498774.jpeg',29,NULL,1618299438,1,NULL),(73,'http://3.1.13.10:8700/tacn161854178081937.jpeg',38,NULL,1618299438,1,NULL),(74,'http://3.1.13.10:8700/tacn161854192932274.jpeg',39,NULL,1618299438,1,NULL),(75,'http://3.1.13.10:8700/tacn161854198499026.jpeg',40,NULL,1618299438,1,NULL),(76,'http://3.1.13.10:8700/tacn16185420544775.jpeg',41,NULL,1618299438,1,NULL),(77,'http://3.1.13.10:8700/tacn161854211359851.jpeg',42,NULL,1618299438,1,NULL),(78,'http://3.1.13.10:8700/tacn161854220355962.png',43,NULL,1618299438,1,NULL),(79,'http://3.1.13.10:8700/tacn161854227768128.png',44,NULL,1618299438,1,NULL),(80,'http://3.1.13.10:8700/tacn161854233266181.jpeg',45,NULL,1618299438,1,NULL),(81,'http://3.1.13.10:8700/tacn161854240279232.jpeg',46,NULL,1618299438,1,NULL),(82,'http://3.1.13.10:8700/tacn161854255476537.png',47,NULL,1618299438,1,NULL),(83,'http://3.1.13.10:8700/tacn161854261356264.jpeg',48,NULL,1618299438,1,NULL),(84,'http://3.1.13.10:8700/tacn16185426620242.png',49,NULL,1618299438,1,NULL),(85,'http://3.1.13.10:8700/tacn161854276613722.jpeg',50,NULL,1618299438,1,NULL),(86,'http://3.1.13.10:8700/tacn161854282318398.jpeg',51,NULL,1618299438,1,NULL),(87,'http://3.1.13.10:8700/tacn161854332524211.jpeg',52,NULL,1618542887,1,NULL),(88,'http://3.1.13.10:8700/tacn16185434074717.jpeg',53,NULL,1618542887,1,NULL),(89,'http://3.1.13.10:8700/tacn161854347164224.jpeg',54,NULL,1618542887,1,NULL),(90,'http://3.1.13.10:8700/tacn161854355305452.png',55,NULL,1618542887,1,NULL),(91,'http://3.1.13.10:8700/tacn161854361650087.jpeg',56,NULL,1618542887,1,NULL),(92,'http://3.1.13.10:8700/tacn161854370425121.png',57,NULL,1618542887,1,NULL),(93,'http://3.1.13.10:8700/tacn161854377157743.png',58,NULL,1618542887,1,NULL),(94,'http://3.1.13.10:8700/tacn161854385683056.jpeg',59,NULL,1618542887,1,NULL),(95,'http://3.1.13.10:8700/tacn16185439569929.jpeg',60,NULL,1618542887,1,NULL),(96,'http://3.1.13.10:8700/tacn161854402678230.jpeg',61,NULL,1618542887,0,NULL),(97,'http://3.1.13.10:8700/tacn161889239565487.jpeg',62,NULL,1618890494,0,NULL),(98,'http://3.1.13.10:8700/tacn161889239605459.jpeg',62,NULL,1618890494,0,NULL),(99,'http://3.1.13.10:8700/tacn161889239605459.jpeg',62,NULL,1618890494,0,NULL),(100,'http://3.1.13.10:8700/tacn161889239605459.jpeg',62,NULL,1618890494,0,NULL),(101,'http://3.1.13.10:8700/tacn161889251057556.jpeg',62,NULL,1618890494,0,NULL),(102,'http://3.1.13.10:8700/tacn161889239605459.jpeg',62,NULL,1618890494,1,NULL),(103,'http://3.1.13.10:8700/tacn161889251057556.jpeg',62,NULL,1618890494,1,NULL),(104,'http://3.1.13.10:8700/tacn161889355961074.jpeg',63,NULL,1618890494,1,NULL),(105,'http://3.1.13.10:8700/tacn161889355995225.jpeg',63,NULL,1618890494,1,NULL),(106,'http://3.1.13.10:8700/tacn16189101640866.jpeg',64,NULL,1618909862,1,NULL),(107,'http://3.1.13.10:8700/tacn161899653325234.jpeg',65,NULL,1618992073,1,NULL),(108,'http://3.1.13.10:8700/tacn161899655894986.jpeg',66,NULL,1618992073,1,NULL),(109,'http://3.1.13.10:8700/tacn16189976366674.jpeg',67,NULL,1618992073,1,NULL),(110,'http://3.1.13.10:8700/tacn161905594261278.jpeg',68,NULL,1619012297,1,NULL),(111,'http://3.1.13.10:8700/tacn16190851121555.jpeg',69,NULL,1619071143,1,NULL),(112,'http://3.1.13.10:8700/tacn161908581288413.jpeg',70,NULL,1619071143,1,NULL),(113,'http://3.1.13.10:8700/tacn161908585416313.jpeg',71,NULL,1619071143,1,NULL),(114,'http://3.1.13.10:8700/tacn161908592323487.jpeg',72,NULL,1619071143,1,NULL),(115,'http://3.1.13.10:8700/tacn161910572214282.jpeg',73,NULL,1619088180,1,NULL),(116,'http://3.1.13.10:8700/tacn161910588519476.jpeg',74,NULL,1619088180,0,NULL),(117,'http://3.1.13.10:8700/tacn161910588519476.jpeg',74,NULL,1619088180,0,NULL),(118,'http://3.1.13.10:8700/tacn16191060584459.jpeg',74,NULL,1619088180,1,NULL),(119,'http://3.1.13.10:8700/tacn161854402678230.jpeg',61,NULL,1619146363,0,NULL),(120,'http://3.1.13.10:8700/tacn161914678504248.jpeg',61,NULL,1619146363,0,NULL),(121,'http://3.1.13.10:8700/tacn161854402678230.jpeg',61,NULL,1619146363,1,NULL),(122,'http://3.1.13.10:8700/tacn161703901556325.jpeg',23,NULL,1619146363,0,NULL),(123,'http://3.1.13.10:8700/tacn161915036726087.jpeg',23,NULL,1619146363,0,NULL),(124,'http://3.1.13.10:8700/tacn161915036726087.jpeg',23,NULL,1619146363,0,NULL),(125,'http://3.1.13.10:8700/tacn161915036726087.jpeg',23,NULL,1619146363,1,NULL),(126,'http://3.1.13.10:8700/tacn161915047915015.jpeg',23,NULL,1619146363,1,NULL),(127,'http://3.1.13.10:8700/tacn16191509519523.jpeg',75,NULL,1619146363,0,NULL),(128,'http://3.1.13.10:8700/tacn16191509519523.jpeg',75,NULL,1619146363,0,NULL),(129,'http://3.1.13.10:8700/tacn161915096140398.jpeg',75,NULL,1619146363,0,NULL),(130,'http://3.1.13.10:8700/tacn16191509519523.jpeg',75,NULL,1619146363,0,NULL),(131,'http://3.1.13.10:8700/tacn161915096140398.jpeg',75,NULL,1619146363,0,NULL),(132,'http://3.1.13.10:8700/tacn16191509519523.jpeg',75,NULL,1619146363,0,NULL),(133,'http://3.1.13.10:8700/tacn161915096140398.jpeg',75,NULL,1619146363,0,NULL),(134,'http://3.1.13.10:8700/tacn16191535576982.jpeg',75,NULL,1619146363,0,NULL),(135,'http://3.1.13.10:8700/tacn16191509519523.jpeg',75,NULL,1619146363,0,NULL),(136,'http://3.1.13.10:8700/tacn161915096140398.jpeg',75,NULL,1619146363,0,NULL),(137,'http://3.1.13.10:8700/tacn161707315607434.png',25,NULL,1619146363,0,NULL),(138,'http://3.1.13.10:8700/tacn16170731865797.jpeg',25,NULL,1619146363,0,NULL),(139,'http://3.1.13.10:8700/tacn161916107015655.jpeg',25,NULL,1619146363,0,NULL),(140,'http://3.1.13.10:8700/tacn161707315607434.png',25,NULL,1619146363,1,NULL),(141,'http://3.1.13.10:8700/tacn16170731865797.jpeg',25,NULL,1619146363,1,NULL),(142,'http://3.1.13.10:8700/tacn161916181430755.jpeg',76,NULL,1619146363,1,NULL),(143,'http://3.1.13.10:8700/tacn16191618144849.jpeg',76,NULL,1619146363,1,NULL),(144,'http://3.1.13.10:8700/tacn16191509519523.jpeg',75,NULL,1619146363,1,NULL),(145,'http://3.1.13.10:8700/tacn161915096140398.jpeg',75,NULL,1619146363,1,NULL),(146,'http://3.1.13.10:8700/tacn161916199031152.jpeg',75,NULL,1619146363,1,NULL),(147,'http://3.1.13.10:8700/tacn161916281159268.jpeg',77,NULL,1619146363,0,NULL),(148,'http://3.1.13.10:8700/tacn161916281159268.jpeg',77,NULL,1619146363,0,NULL),(149,'http://3.1.13.10:8700/tacn161916281159268.jpeg',77,NULL,1619146363,0,NULL),(150,'http://3.1.13.10:8700/tacn161916281159268.jpeg',77,NULL,1619146363,0,NULL),(151,'http://3.1.13.10:8700/tacn161916281159268.jpeg',77,NULL,1619146363,0,NULL),(152,'http://3.1.13.10:8700/tacn161916415792379.jpeg',77,NULL,1619146363,0,NULL),(153,'http://3.1.13.10:8700/tacn161916415808985.jpeg',77,NULL,1619146363,0,NULL),(154,'http://3.1.13.10:8700/tacn161916415815044.jpeg',77,NULL,1619146363,0,NULL),(155,'http://3.1.13.10:8700/tacn161916415815737.jpeg',77,NULL,1619146363,0,NULL),(156,'http://3.1.13.10:8700/tacn161916415821251.jpeg',77,NULL,1619146363,0,NULL),(157,'http://3.1.13.10:8700/tacn161916281159268.jpeg',77,NULL,1619146363,0,NULL),(158,'http://3.1.13.10:8700/tacn161916415792379.jpeg',77,NULL,1619146363,0,NULL),(159,'http://3.1.13.10:8700/tacn161916415808985.jpeg',77,NULL,1619146363,0,NULL),(160,'http://3.1.13.10:8700/tacn161916415815044.jpeg',77,NULL,1619146363,0,NULL),(161,'http://3.1.13.10:8700/tacn161916415815737.jpeg',77,NULL,1619146363,0,NULL),(162,'http://3.1.13.10:8700/tacn161916415821251.jpeg',77,NULL,1619146363,0,NULL),(163,'http://3.1.13.10:8700/tacn161916281159268.jpeg',77,NULL,1619146363,0,NULL),(164,'http://3.1.13.10:8700/tacn161916415792379.jpeg',77,NULL,1619146363,0,NULL),(165,'http://3.1.13.10:8700/tacn161916415808985.jpeg',77,NULL,1619146363,0,NULL),(166,'http://3.1.13.10:8700/tacn161916415815044.jpeg',77,NULL,1619146363,0,NULL),(167,'http://3.1.13.10:8700/tacn161916415815737.jpeg',77,NULL,1619146363,0,NULL),(168,'http://3.1.13.10:8700/tacn161916415821251.jpeg',77,NULL,1619146363,0,NULL),(169,'http://3.1.13.10:8700/tacn161916415792379.jpeg',77,NULL,1619146363,0,NULL),(170,'http://3.1.13.10:8700/tacn161916415808985.jpeg',77,NULL,1619146363,0,NULL),(171,'http://3.1.13.10:8700/tacn161916415815044.jpeg',77,NULL,1619146363,0,NULL),(172,'http://3.1.13.10:8700/tacn161916415815737.jpeg',77,NULL,1619146363,0,NULL),(173,'http://3.1.13.10:8700/tacn161916415821251.jpeg',77,NULL,1619146363,0,NULL),(174,'http://3.1.13.10:8700/tacn161916415792379.jpeg',77,NULL,1619146363,0,NULL),(175,'http://3.1.13.10:8700/tacn161916415808985.jpeg',77,NULL,1619146363,0,NULL),(176,'http://3.1.13.10:8700/tacn161916415815044.jpeg',77,NULL,1619146363,0,NULL),(177,'http://3.1.13.10:8700/tacn161916415815737.jpeg',77,NULL,1619146363,0,NULL),(178,'http://3.1.13.10:8700/tacn161916415821251.jpeg',77,NULL,1619146363,0,NULL),(179,'http://3.1.13.10:8700/tacn161916538403839.jpeg',78,NULL,1619146363,0,NULL),(180,'http://3.1.13.10:8700/tacn161916538419163.jpeg',78,NULL,1619146363,0,NULL),(181,'http://3.1.13.10:8700/tacn161916538424375.jpeg',78,NULL,1619146363,0,NULL),(182,'http://3.1.13.10:8700/tacn161916538425024.jpeg',78,NULL,1619146363,0,NULL),(183,'http://3.1.13.10:8700/tacn161916538430210.jpeg',78,NULL,1619146363,0,NULL),(184,'http://3.1.13.10:8700/tacn161916538431762.jpeg',78,NULL,1619146363,0,NULL),(185,'http://3.1.13.10:8700/tacn161916538403839.jpeg',78,NULL,1619165507,0,NULL),(186,'http://3.1.13.10:8700/tacn161916538419163.jpeg',78,NULL,1619165507,0,NULL),(187,'http://3.1.13.10:8700/tacn161916538424375.jpeg',78,NULL,1619165507,0,NULL),(188,'http://3.1.13.10:8700/tacn161916538425024.jpeg',78,NULL,1619165507,0,NULL),(189,'http://3.1.13.10:8700/tacn161916538430210.jpeg',78,NULL,1619165507,0,NULL),(190,'http://3.1.13.10:8700/tacn161916538431762.jpeg',78,NULL,1619165507,0,NULL),(191,'http://3.1.13.10:8700/tacn161916538403839.jpeg',78,NULL,1619165507,0,NULL),(192,'http://3.1.13.10:8700/tacn161916538419163.jpeg',78,NULL,1619165507,0,NULL),(193,'http://3.1.13.10:8700/tacn161916538424375.jpeg',78,NULL,1619165507,0,NULL),(194,'http://3.1.13.10:8700/tacn161916538425024.jpeg',78,NULL,1619165507,0,NULL),(195,'http://3.1.13.10:8700/tacn161916538430210.jpeg',78,NULL,1619165507,0,NULL),(196,'http://3.1.13.10:8700/tacn161916538431762.jpeg',78,NULL,1619165507,0,NULL),(197,'http://3.1.13.10:8700/tacn161916538403839.jpeg',78,NULL,1619165507,1,NULL),(198,'http://3.1.13.10:8700/tacn161916538419163.jpeg',78,NULL,1619165507,1,NULL),(199,'http://3.1.13.10:8700/tacn161916538424375.jpeg',78,NULL,1619165507,1,NULL),(200,'http://3.1.13.10:8700/tacn161916538425024.jpeg',78,NULL,1619165507,1,NULL),(201,'http://3.1.13.10:8700/tacn161916538430210.jpeg',78,NULL,1619165507,1,NULL),(202,'http://3.1.13.10:8700/tacn161916538431762.jpeg',78,NULL,1619165507,1,NULL),(203,'http://3.1.13.10:8700/tacn161916901967659.jpeg',79,NULL,1619165507,0,NULL),(204,'http://3.1.13.10:8700/tacn161916901967659.jpeg',79,NULL,1619165507,0,NULL),(205,'http://3.1.13.10:8700/tacn161916415792379.jpeg',77,NULL,1619165507,1,NULL),(206,'http://3.1.13.10:8700/tacn161916415808985.jpeg',77,NULL,1619165507,1,NULL),(207,'http://3.1.13.10:8700/tacn161916415815044.jpeg',77,NULL,1619165507,1,NULL),(208,'http://3.1.13.10:8700/tacn161916415815737.jpeg',77,NULL,1619165507,1,NULL),(209,'http://3.1.13.10:8700/tacn161916415821251.jpeg',77,NULL,1619165507,1,NULL),(210,'http://3.1.13.10:8700/tacn161916901967659.jpeg',79,NULL,1619165507,0,NULL),(211,'http://3.1.13.10:8700/tacn161916901967659.jpeg',79,NULL,1619165507,0,NULL),(212,'http://3.1.13.10:8700/tacn161916901967659.jpeg',79,NULL,1619165507,0,NULL),(213,'http://3.1.13.10:8700/tacn161916901967659.jpeg',79,NULL,1619165507,1,NULL),(214,'http://3.1.13.10:8700/tacn161917438428892.jpeg',80,NULL,1619165507,1,NULL),(215,'http://3.1.13.10:8700/tacn161918683506065.jpeg',81,NULL,1619174964,1,NULL),(216,'http://3.1.13.10:8700/tacn161923131055448.jpeg',82,NULL,1619174964,0,NULL),(217,'http://3.1.13.10:8700/tacn161936423375343.jpeg',83,NULL,1619259226,1,NULL),(218,'http://3.1.13.10:8700/tacn161936425922383.jpeg',84,NULL,1619259226,1,NULL),(219,'http://3.1.13.10:8700/tacn161941209216475.png',85,NULL,1619411379,0,NULL),(220,'http://3.1.13.10:8700/tacn161923131055448.jpeg',82,NULL,1619411379,0,NULL),(221,'http://3.1.13.10:8700/tacn161941236097931.jpeg',82,NULL,1619411379,0,NULL),(222,'http://3.1.13.10:8700/tacn161923131055448.jpeg',82,NULL,1619411379,1,NULL),(223,'http://3.1.13.10:8700/tacn161941209216475.png',85,NULL,1619411379,0,NULL),(224,'http://3.1.13.10:8700/tacn161941209216475.png',85,NULL,1619411379,1,NULL),(225,'http://3.1.13.10:8700/tacn161942028731851.png',86,NULL,1619411379,0,NULL),(226,'http://3.1.13.10:8700/tacn161942028731851.png',86,NULL,1619411379,1,NULL),(227,'http://3.1.13.10:8700/tacn161942124424394.jpeg',87,NULL,1619411379,1,NULL);
/*!40000 ALTER TABLE `product_image` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_of_store`
--

DROP TABLE IF EXISTS `product_of_store`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_of_store` (
  `store_id` int NOT NULL,
  `amount` int NOT NULL,
  `modified_at` int DEFAULT NULL,
  `created_at` int NOT NULL DEFAULT '1619432870',
  `is_active` int NOT NULL DEFAULT '1',
  `product_code` varchar(100) NOT NULL,
  `product_name` varchar(100) NOT NULL,
  `product_unit` varchar(100) NOT NULL,
  `product_category` varchar(100) NOT NULL,
  `import_price` bigint NOT NULL,
  `code` varchar(100) NOT NULL,
  `last_price` bigint DEFAULT NULL,
  `agent_id` int DEFAULT NULL,
  `expired_at` int NOT NULL,
  PRIMARY KEY (`store_id`,`product_code`,`product_unit`,`product_category`,`import_price`,`expired_at`),
  CONSTRAINT `product_of_store_ibfk_1` FOREIGN KEY (`store_id`) REFERENCES `store` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_of_store`
--

LOCK TABLES `product_of_store` WRITE;
/*!40000 ALTER TABLE `product_of_store` DISABLE KEYS */;
INSERT INTO `product_of_store` VALUES (2,25,NULL,1616666184,1,'TACN494691498731','c??m l???n','c??n','hang kho',100000,'POS371518373939',90000,1,1616552598),(2,14,NULL,1616666184,1,'TACN783949789380','c??m g??','b??','hang kho',100000,'POS371518374373',100000,1,1616552598),(9,8,1619065018,1619065018,1,'TACN095067094591','C??m l???n','Bao','B???t kh??',500000,'POS799901793665',NULL,1,1618804971),(9,6,NULL,1617836259,1,'TACN587055589538','c??m heo','hop','hang kho',100000,'POS929025924586',NULL,41,1616552598),(9,46,1618298087,1618298087,1,'TACN764653763627','c??m c??','hop','hang kho',100000,'POS746008749964',NULL,1,-1),(9,46,NULL,1617836259,1,'TACN764653763627','c??m c??','hop','hang kho',100000,'POS929025921451',NULL,41,1616552596),(9,46,1617919753,1617919753,1,'TACN764653763627','c??m c??','hop','hang kho',100000,'POS279675278314',NULL,41,1616552597),(9,46,1617939663,1617939663,1,'TACN764653763627','c??m c??','hop','hang kho',100000,'POS333766333135',NULL,41,1617552598),(9,46,1618120647,1618120647,1,'TACN764653763627','c??m c??','hop','hang kho',100000,'POS716664713360',NULL,41,1618119374),(9,46,1618536980,1618536980,1,'TACN764653763627','c??m c??','hop','hang kho',100000,'POS998997993459',NULL,1,1618119433),(9,46,1618805066,1618805066,1,'TACN764653763627','c??m c??','hop','hang kho',100000,'POS591806591952',NULL,1,1618804971),(9,46,1618820787,1618820787,1,'TACN764653763627','c??m c??','hop','hang kho',100000,'POS734778735115',NULL,1,1618804980),(9,6,1619065018,1619065018,1,'TACN769055763523','?????u t????ng h???t','T??i','B???t C??m',60000,'POS800001806575',NULL,1,1618804971),(9,26,1618536980,1618536980,1,'TACN783949789380','c??m g??','B??','H??ng ????ng l???nh',100000,'POS998997999761',NULL,1,-1),(9,26,1617840927,1617840927,1,'TACN783949789380','c??m g??','B??','H??ng ????ng l???nh',100000,'POS710292712612',NULL,41,1616552598),(9,26,1618120647,1618120647,1,'TACN783949789380','c??m g??','B??','H??ng ????ng l???nh',100000,'POS716764715012',NULL,41,1618119433),(9,26,1618805066,1618805066,1,'TACN783949789380','c??m g??','B??','H??ng ????ng l???nh',100000,'POS591806592277',NULL,1,1618804971),(9,9,1618558311,1618558311,1,'TACN996206999440','Rau mu???ng','B??','Rau s???ch',3000,'POS129731125856',NULL,64,-1),(13,100,1619165785,1619165785,1,'TACN095067094591','C??m l???n','Bao','B???t kh??',500000,'POS452378451373',NULL,1,-1),(13,12,1618367332,1618367332,1,'TACN105587107916','Thu???c gin','T??','Thu???c th?? y',5000,'POS188633188012',NULL,64,1616552598),(13,10200,1618369875,1618369875,1,'TACN462278469518','V???c xin h5n1','T??','Thu???c th?? y',25000,'POS498887493110',NULL,64,-1),(13,70,1618369911,1618369911,1,'TACN462278469518','V???c xin h5n1','T??','Thu???c th?? y',25000,'POS146491145526',NULL,64,1617450651),(13,40,1618369921,1618369921,1,'TACN462278469518','V???c xin h5n1','T??','Thu???c th?? y',25000,'POS131892137890',NULL,64,1617450999),(13,0,1618367332,1618367332,1,'TACN462278469518','V???c xin h5n1','T??','Thu???c th?? y',25000,'POS188633185361',NULL,64,1618552598),(13,48,NULL,1617177346,1,'TACN675015678757','C??m l???n','b??','B???t C??m',90000,'POS572634573272',NULL,1,1616552598),(13,0,1617940009,1617940009,1,'TACN764653763627','c??m c??','hop','hang kho',100000,'POS916900912701',NULL,41,1617552598),(13,100,1617940040,1617940040,1,'TACN764653763627','c??m c??','hop','hang kho',100000,'POS961903966431',NULL,41,1618552598),(13,28,NULL,1617177346,1,'TACN783949789380','c??m g??','B??','H??ng ????ng l???nh',100000,'POS572634573280',NULL,1,1616552598),(14,60,1618370920,1618370920,1,'TACN462278469518','V???c xin h5n1','T??','Thu???c th?? y',25000,'POS037192031691',NULL,64,-1),(14,30,1618456227,1618456227,1,'TACN996206999440','Rau mu???ng','B??','Rau s???ch',3000,'POS727822723175',NULL,64,-1),(16,33,1618300865,1618300865,1,'TACN105587107916','Thu???c gin','T??','Thu???c th?? y',5000,'POS543686548771',NULL,8,-1),(16,100,1618302781,1618302781,1,'TACN462278469518','V???c xin h5n1','T??','Thu???c th?? y',25000,'POS140878147971',NULL,8,-1),(17,180,1618301353,1618301353,1,'TACN105587107916','Thu???c gin','T??','Thu???c th?? y',5000,'POS251635255198',NULL,8,-1),(17,0,1618542420,1618542420,1,'TACN126278128248','B??nh m??','G??i','Ph??n h???u c??',5000,'POS968241966260',NULL,8,-1),(17,1,1618557515,1618557515,1,'TACN215577218277','?????m ?????c Hanofeet','B??','C??m',145000,'POS492251496997',NULL,8,-1),(17,0,1618842347,1618842347,1,'TACN221047227509','Thu???c Cytovet','Li???u','Thu???c th?? y',15000,'POS687334688406',NULL,8,-1),(17,1,1618542420,1618542420,1,'TACN331133336205','Th???c ??n d???ng vi??n cho heo 2 th??ng tu???i','B??','C??m',500000,'POS968241968005',NULL,8,-1),(17,25,1618560410,1618560410,1,'TACN359855353104','Th???c ??n h???n h???p cho g?? l??ng m??u','B??','C??m',120000,'POS012641013794',NULL,8,-1),(17,1,1618542420,1618542420,1,'TACN407111405758','G???i ??m','G??i','C??m',200000,'POS968241964420',NULL,8,-1),(17,1,1618542420,1618542420,1,'TACN434320433841','Th???a ??n h???n h???p d???ng vi??n gia c???m','B??','C??m',350000,'POS968241963610',NULL,8,-1),(17,20,1618302914,1618302914,1,'TACN462278469518','V???c xin h5n1','T??','Thu???c th?? y',25000,'POS400291407200',NULL,8,-1),(17,4,1618649494,1618649494,1,'TACN482870486197','Th???c ??n ?????m ?????c cho heo th???t','B??','C??m',180000,'POS414349415020',NULL,8,-1),(17,2,1618542420,1618542420,1,'TACN516105518858','B??nh gi??? nhi???t','B??nh','Thu???c th?? y',100000,'POS968241964307',NULL,8,-1),(17,2,1618542420,1618542420,1,'TACN563998567785','K???o d???o','T??i','Thu???c c??m g??',20000,'POS968241963101',NULL,8,-1),(17,1,1618563523,1618563523,1,'TACN570532574873','Ph??n h???u c?? vi sinh S??ng Gianh','B??','Ph??n h???u c??',100000,'POS333852337541',NULL,8,-1),(17,300,1618629693,1618629693,1,'TACN648476643259','Vaccin c??m gia c???m H5N1','T??i','Thu???c c??m g??',80000,'POS325969326990',NULL,8,-1),(17,0,1618560410,1618560410,1,'TACN731502734278','V??? b??o gia c???m - t??ng tr???ng','T??i','C??m',25000,'POS012641011000',NULL,8,-1),(17,74,1618560569,1618560569,1,'TACN741595741174','Thu???c c??m g?? - v???t con','T??i','Thu???c c??m g??',9000,'POS933856933188',NULL,8,-1),(17,5,1618560410,1618560410,1,'TACN742685745086','Th???c ??n ch??n nu??i Vega Feed','B??','C??m',95000,'POS012641011031',NULL,8,-1),(17,1,1618649494,1618649494,1,'TACN799940797540','Thu???c th?? y - FiveTylan','B??nh','Thu???c th?? y',25000,'POS414349414552',NULL,8,-1),(17,2,1618542420,1618542420,1,'TACN913427912175','Th???c ??n h???n h???p cho heo con','B??','C??m',200000,'POS968241964157',NULL,8,-1),(17,2,1618542420,1618542420,1,'TACN974992972670','S???a milo','T??','Thu???c th?? y',60000,'POS968241968848',NULL,8,-1),(18,0,1618910216,1618910216,1,'K495916499245','B??nh bao','B??','Rau s???ch',2000,'POS608821605320',NULL,64,-1),(18,420,1618384182,1618384182,1,'TACN996206999440','Rau mu???ng','B??','Rau s???ch',3000,'POS200518205557',NULL,64,-1),(19,0,1618996604,1618996604,1,'K393053394428','Rau mu???ng','b??','Rau',3000,'POS361860366244',NULL,95,-1),(20,50,1618996931,1618996931,1,'K974855974185','B??nh bao nh??n th???t','chi???c','b??nh',5000,'POS135493131194',NULL,95,-1),(21,-1630,1618998239,1618998239,1,'K734163736306','Rau mu???ng','B??','Rau',4000,'POS906423902844',NULL,96,-1),(21,-1505,1619061443,1619061443,1,'K734163736306','Rau mu???ng','B??','Rau',4000,'POS339544334827',NULL,96,1618804971),(21,-1430,1619007281,1619007281,1,'K734163736306','Rau mu???ng','B??','Rau',4000,'POS147728146853',NULL,96,1618804980),(22,15,1619056241,1619056241,1,'K301394304016','MacbookPro 16inch','Chi???c','Macbook',50000000,'POS115624115475',NULL,97,-1),(24,12987,1619063847,1619063847,1,'TACN731502734278','V??? b??o gia c???m - t??ng tr???ng','T??i','C??m',25000,'POS704884705254',NULL,8,-1),(24,8,1619082993,1619082993,1,'TACN742685745086','Th???c ??n ch??n nu??i Vega Feed','B??','C??m',95000,'POS288599287600',NULL,8,-1),(25,99,1619079848,1619079848,1,'TACN039156032707','S???a TH True Milk','v???','th???c u???ng',28000,'POS819984813327',NULL,93,-1),(40,30,1619174537,1619174537,1,'K506838504094','Qu???n ????i nam','T??','Th???i trang nam',90000,'POS707553705427',NULL,3,-1),(40,127,1619186866,1619186866,1,'K538583535112','V??y','Chi???c','Th??i trang n???',75000,'POS627286621618',NULL,3,-1),(50,100,1619421362,1619421362,1,'K494624491742','Quan dui','chiec','Thoi trang vn',80000,'POS229736221495',NULL,151,-1);
/*!40000 ALTER TABLE `product_of_store` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_receipt`
--

DROP TABLE IF EXISTS `product_receipt`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_receipt` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product` json NOT NULL,
  `goods_receipt_id` int NOT NULL,
  `amount` int NOT NULL,
  `price` bigint NOT NULL,
  `modified_at` int DEFAULT NULL,
  `created_at` int NOT NULL DEFAULT '1619432870',
  `is_active` int NOT NULL DEFAULT '1',
  `agent_id` int DEFAULT NULL,
  `expired_at` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `goods_receipt_id` (`goods_receipt_id`),
  CONSTRAINT `product_receipt_ibfk_1` FOREIGN KEY (`goods_receipt_id`) REFERENCES `goods_receipt` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=317 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_receipt`
--

LOCK TABLES `product_receipt` WRITE;
/*!40000 ALTER TABLE `product_receipt` DISABLE KEYS */;
INSERT INTO `product_receipt` VALUES (307,'{\"id\": 80, \"code\": \"K506838504094\", \"name\": \"Qu???n ????i nam\", \"unit_id\": 44, \"agent_id\": 3, \"is_active\": 1, \"unit_name\": \"T??\", \"created_at\": 1619165507, \"last_price\": null, \"modified_at\": null, \"import_price\": 90000, \"retail_price\": 120000, \"wholesale_price\": 10000, \"last_import_price\": null, \"last_retail_price\": null, \"product_category_id\": 54, \"last_wholesale_price\": null, \"product_category_name\": \"Th???i trang nam\"}',233,200,90000,1619174537,1619165507,1,3,NULL),(308,'{\"id\": 81, \"code\": \"K538583535112\", \"name\": \"V??y\", \"unit_id\": 45, \"agent_id\": 3, \"is_active\": 1, \"unit_name\": \"Chi???c\", \"created_at\": 1619174964, \"last_price\": null, \"modified_at\": null, \"import_price\": 75000, \"retail_price\": 100000, \"wholesale_price\": 90000, \"last_import_price\": null, \"last_retail_price\": null, \"product_category_id\": 55, \"last_wholesale_price\": null, \"product_category_name\": \"Th??i trang n???\"}',234,100,75000,1619186866,1619174964,1,3,NULL),(309,'{\"id\": 80, \"code\": \"K506838504094\", \"name\": \"Qu???n ????i nam\", \"unit_id\": 44, \"agent_id\": 3, \"is_active\": 1, \"unit_name\": \"T??\", \"created_at\": 1619165507, \"last_price\": null, \"modified_at\": 1619174537, \"import_price\": 90000, \"retail_price\": 120000, \"wholesale_price\": 10000, \"last_import_price\": 90000, \"last_retail_price\": null, \"product_category_id\": 54, \"last_wholesale_price\": null, \"product_category_name\": \"Th???i trang nam\"}',235,20,75000,1619230362,1619174964,0,3,NULL),(310,'{\"id\": 81, \"code\": \"K538583535112\", \"name\": \"V??y\", \"unit_id\": 45, \"agent_id\": 3, \"is_active\": 1, \"unit_name\": \"Chi???c\", \"created_at\": 1619174964, \"last_price\": null, \"modified_at\": 1619186866, \"import_price\": 75000, \"retail_price\": 100000, \"wholesale_price\": 90000, \"last_import_price\": 75000, \"last_retail_price\": null, \"product_category_id\": 55, \"last_wholesale_price\": null, \"product_category_name\": \"Th??i trang n???\"}',235,10,90000,1619230362,1619174964,0,3,NULL),(311,'{\"id\": 80, \"code\": \"K506838504094\", \"name\": \"Qu???n ????i nam\", \"unit_id\": 44, \"agent_id\": 3, \"is_active\": 1, \"unit_name\": \"T??\", \"created_at\": 1619165507, \"last_price\": null, \"modified_at\": 1619230362, \"import_price\": 90000, \"retail_price\": 120000, \"wholesale_price\": 10000, \"last_import_price\": 90000, \"last_retail_price\": null, \"product_category_id\": 54, \"last_wholesale_price\": null, \"product_category_name\": \"Th???i trang nam\"}',236,10,90000,1619231737,1619231731,0,3,-1),(312,'{\"id\": 81, \"code\": \"K538583535112\", \"name\": \"V??y\", \"unit_id\": 45, \"agent_id\": 3, \"is_active\": 1, \"unit_name\": \"Chi???c\", \"created_at\": 1619174964, \"last_price\": null, \"modified_at\": 1619230362, \"import_price\": 75000, \"retail_price\": 100000, \"wholesale_price\": 90000, \"last_import_price\": 75000, \"last_retail_price\": null, \"product_category_id\": 55, \"last_wholesale_price\": null, \"product_category_name\": \"Th??i trang n???\"}',236,10,75000,1619231737,1619231731,0,3,-1),(313,'{\"id\": 80, \"code\": \"K506838504094\", \"name\": \"Qu???n ????i nam\", \"unit_id\": 44, \"agent_id\": 3, \"is_active\": 1, \"unit_name\": \"T??\", \"created_at\": 1619165507, \"last_price\": null, \"modified_at\": 1619231737, \"import_price\": 90000, \"retail_price\": 120000, \"wholesale_price\": 10000, \"last_import_price\": 90000, \"last_retail_price\": null, \"product_category_id\": 54, \"last_wholesale_price\": null, \"product_category_name\": \"Th???i trang nam\"}',237,5,90000,1619232173,1619232169,1,3,-1),(314,'{\"id\": 81, \"code\": \"K538583535112\", \"name\": \"V??y\", \"unit_id\": 45, \"agent_id\": 3, \"is_active\": 1, \"unit_name\": \"Chi???c\", \"created_at\": 1619174964, \"last_price\": null, \"modified_at\": 1619231737, \"import_price\": 75000, \"retail_price\": 100000, \"wholesale_price\": 90000, \"last_import_price\": 75000, \"last_retail_price\": null, \"product_category_id\": 55, \"last_wholesale_price\": null, \"product_category_name\": \"Th??i trang n???\"}',237,10,75000,1619232173,1619232169,1,3,-1),(315,'{\"id\": 81, \"code\": \"K538583535112\", \"name\": \"V??y\", \"unit_id\": 45, \"agent_id\": 3, \"is_active\": 1, \"unit_name\": \"Chi???c\", \"created_at\": 1619174964, \"last_price\": null, \"modified_at\": 1619232173, \"import_price\": 75000, \"retail_price\": 100000, \"wholesale_price\": 90000, \"last_import_price\": 75000, \"last_retail_price\": null, \"product_category_id\": 55, \"last_wholesale_price\": null, \"product_category_name\": \"Th??i trang n???\"}',238,10,75000,1619234003,1619174964,1,3,NULL),(316,'{\"id\": 87, \"code\": \"K494624491742\", \"name\": \"Quan dui\", \"unit_id\": 52, \"agent_id\": 151, \"is_active\": 1, \"unit_name\": \"chiec\", \"created_at\": 1619411379, \"last_price\": null, \"modified_at\": null, \"import_price\": 80000, \"retail_price\": 100000, \"wholesale_price\": 90000, \"last_import_price\": null, \"last_retail_price\": null, \"product_category_id\": 62, \"last_wholesale_price\": null, \"product_category_name\": \"Thoi trang vn\"}',239,100,80000,1619421362,1619411379,1,151,NULL);
/*!40000 ALTER TABLE `product_receipt` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_return`
--

DROP TABLE IF EXISTS `product_return`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_return` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product` json NOT NULL,
  `goods_return_id` int NOT NULL,
  `amount` int NOT NULL,
  `price` bigint NOT NULL,
  `discount` bigint NOT NULL,
  `modified_at` int DEFAULT NULL,
  `created_at` int NOT NULL DEFAULT '1619432870',
  `is_active` int NOT NULL DEFAULT '1',
  `agent_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `goods_return_id` (`goods_return_id`),
  CONSTRAINT `product_return_ibfk_1` FOREIGN KEY (`goods_return_id`) REFERENCES `goods_return` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_return`
--

LOCK TABLES `product_return` WRITE;
/*!40000 ALTER TABLE `product_return` DISABLE KEYS */;
INSERT INTO `product_return` VALUES (3,'{\"code\": \"POS707553705427\", \"amount\": 27, \"agent_id\": 3, \"store_id\": 40, \"is_active\": 1, \"created_at\": 1619174537, \"expired_at\": -1, \"last_price\": null, \"modified_at\": 1619420591.718, \"import_price\": 90000, \"product_code\": \"K506838504094\", \"product_name\": \"Qu???n ????i nam\", \"product_unit\": \"T??\", \"product_category\": \"Th???i trang nam\"}',3,5,120000,0,NULL,1619420583,1,3),(4,'{\"code\": \"POS707553705427\", \"amount\": 30, \"agent_id\": 3, \"store_id\": 40, \"is_active\": 1, \"created_at\": 1619174537, \"expired_at\": -1, \"last_price\": null, \"modified_at\": 1619425881.783, \"import_price\": 90000, \"product_code\": \"K506838504094\", \"product_name\": \"Qu???n ????i nam\", \"product_unit\": \"T??\", \"product_category\": \"Th???i trang nam\"}',4,5,120000,0,NULL,1619425828,1,3),(5,'{\"code\": \"POS707553705427\", \"amount\": 35, \"agent_id\": 3, \"store_id\": 40, \"is_active\": 1, \"created_at\": 1619174537, \"expired_at\": -1, \"last_price\": null, \"modified_at\": 1619426142.206, \"import_price\": 90000, \"product_code\": \"K506838504094\", \"product_name\": \"Qu???n ????i nam\", \"product_unit\": \"T??\", \"product_category\": \"Th???i trang nam\"}',5,5,120000,0,NULL,1619426069,1,3),(6,'{\"code\": \"POS707553705427\", \"amount\": 40, \"agent_id\": 3, \"store_id\": 40, \"is_active\": 1, \"created_at\": 1619174537, \"expired_at\": -1, \"last_price\": null, \"modified_at\": 1619426349.993, \"import_price\": 90000, \"product_code\": \"K506838504094\", \"product_name\": \"Qu???n ????i nam\", \"product_unit\": \"T??\", \"product_category\": \"Th???i trang nam\"}',6,5,120000,0,NULL,1619426343,1,3),(7,'{\"code\": \"POS707553705427\", \"amount\": 45, \"agent_id\": 3, \"store_id\": 40, \"is_active\": 1, \"created_at\": 1619174537, \"expired_at\": -1, \"last_price\": null, \"modified_at\": 1619426773.471, \"import_price\": 90000, \"product_code\": \"K506838504094\", \"product_name\": \"Qu???n ????i nam\", \"product_unit\": \"T??\", \"product_category\": \"Th???i trang nam\"}',7,5,120000,0,NULL,1619426534,1,3),(8,'{\"code\": \"POS707553705427\", \"amount\": 50, \"agent_id\": 3, \"store_id\": 40, \"is_active\": 1, \"created_at\": 1619174537, \"expired_at\": -1, \"last_price\": null, \"modified_at\": 1619427482.879, \"import_price\": 90000, \"product_code\": \"K506838504094\", \"product_name\": \"Qu???n ????i nam\", \"product_unit\": \"T??\", \"product_category\": \"Th???i trang nam\"}',8,5,120000,0,NULL,1619427476,1,3),(9,'{\"code\": \"POS707553705427\", \"amount\": 55, \"agent_id\": 3, \"store_id\": 40, \"is_active\": 1, \"created_at\": 1619174537, \"expired_at\": -1, \"last_price\": null, \"modified_at\": 1619427640.278, \"import_price\": 90000, \"product_code\": \"K506838504094\", \"product_name\": \"Qu???n ????i nam\", \"product_unit\": \"T??\", \"product_category\": \"Th???i trang nam\"}',9,5,120000,0,NULL,1619427554,1,3),(10,'{\"code\": \"POS707553705427\", \"amount\": 58, \"agent_id\": 3, \"store_id\": 40, \"is_active\": 1, \"created_at\": 1619174537, \"expired_at\": -1, \"last_price\": null, \"modified_at\": 1619447472.968, \"import_price\": 90000, \"product_code\": \"K506838504094\", \"product_name\": \"Qu???n ????i nam\", \"product_unit\": \"T??\", \"product_category\": \"Th???i trang nam\"}',10,5,120000,0,NULL,1619447342,1,3),(11,'{\"code\": \"POS707553705427\", \"amount\": 63, \"agent_id\": 3, \"store_id\": 40, \"is_active\": 1, \"created_at\": 1619174537, \"expired_at\": -1, \"last_price\": null, \"modified_at\": 1619449687.679, \"import_price\": 90000, \"product_code\": \"K506838504094\", \"product_name\": \"Qu???n ????i nam\", \"product_unit\": \"T??\", \"product_category\": \"Th???i trang nam\"}',11,5,120000,0,NULL,1619449498,1,3),(12,'{\"code\": \"POS707553705427\", \"amount\": 68, \"agent_id\": 3, \"store_id\": 40, \"is_active\": 1, \"created_at\": 1619174537, \"expired_at\": -1, \"last_price\": null, \"modified_at\": 1619449838.609, \"import_price\": 90000, \"product_code\": \"K506838504094\", \"product_name\": \"Qu???n ????i nam\", \"product_unit\": \"T??\", \"product_category\": \"Th???i trang nam\"}',12,5,120000,0,NULL,1619449830,1,3),(13,'{\"code\": \"POS707553705427\", \"amount\": 73, \"agent_id\": 3, \"store_id\": 40, \"is_active\": 1, \"created_at\": 1619174537, \"expired_at\": -1, \"last_price\": null, \"modified_at\": 1619450926.303, \"import_price\": 90000, \"product_code\": \"K506838504094\", \"product_name\": \"Qu???n ????i nam\", \"product_unit\": \"T??\", \"product_category\": \"Th???i trang nam\"}',13,5,120000,0,NULL,1619450921,1,3),(14,'{\"code\": \"POS707553705427\", \"amount\": 78, \"agent_id\": 3, \"store_id\": 40, \"is_active\": 1, \"created_at\": 1619174537, \"expired_at\": -1, \"last_price\": null, \"modified_at\": 1619450982.75, \"import_price\": 90000, \"product_code\": \"K506838504094\", \"product_name\": \"Qu???n ????i nam\", \"product_unit\": \"T??\", \"product_category\": \"Th???i trang nam\"}',14,5,120000,0,NULL,1619450978,1,3),(15,'{\"code\": \"POS707553705427\", \"amount\": 5, \"agent_id\": 3, \"store_id\": 40, \"is_active\": 1, \"created_at\": 1619174537, \"expired_at\": -1, \"last_price\": null, \"modified_at\": 1619451623.127, \"import_price\": 90000, \"product_code\": \"K506838504094\", \"product_name\": \"Qu???n ????i nam\", \"product_unit\": \"T??\", \"product_category\": \"Th???i trang nam\"}',15,5,120000,0,NULL,1619451609,0,3),(16,'{\"code\": \"POS707553705427\", \"amount\": 10, \"agent_id\": 3, \"store_id\": 40, \"is_active\": 1, \"created_at\": 1619174537, \"expired_at\": -1, \"last_price\": null, \"modified_at\": 1619451923.613, \"import_price\": 90000, \"product_code\": \"K506838504094\", \"product_name\": \"Qu???n ????i nam\", \"product_unit\": \"T??\", \"product_category\": \"Th???i trang nam\"}',16,10,120000,0,NULL,1619451918,1,3),(17,'{\"code\": \"POS707553705427\", \"amount\": 20, \"agent_id\": 3, \"store_id\": 40, \"is_active\": 1, \"created_at\": 1619174537, \"expired_at\": -1, \"last_price\": null, \"modified_at\": 1619452558.053, \"import_price\": 90000, \"product_code\": \"K506838504094\", \"product_name\": \"Qu???n ????i nam\", \"product_unit\": \"T??\", \"product_category\": \"Th???i trang nam\"}',18,10,120000,0,NULL,1619452522,1,3),(18,'{\"code\": \"POS707553705427\", \"amount\": 10, \"agent_id\": 3, \"store_id\": 40, \"is_active\": 1, \"created_at\": 1619174537, \"expired_at\": -1, \"last_price\": null, \"modified_at\": 1619452627.282, \"import_price\": 90000, \"product_code\": \"K506838504094\", \"product_name\": \"Qu???n ????i nam\", \"product_unit\": \"T??\", \"product_category\": \"Th???i trang nam\"}',19,10,120000,0,NULL,1619452621,1,3);
/*!40000 ALTER TABLE `product_return` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `province`
--

DROP TABLE IF EXISTS `province`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `province` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `is_active` int NOT NULL DEFAULT '1',
  `created_at` int NOT NULL DEFAULT '1619432870',
  `code` varchar(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=270 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `province`
--

LOCK TABLES `province` WRITE;
/*!40000 ALTER TABLE `province` DISABLE KEYS */;
INSERT INTO `province` VALUES (201,'H?? N???i',1,1615350657,'4'),(202,'H??? Ch?? Minh',1,1615350657,'8'),(203,'???? N???ng',1,1615350657,'511'),(204,'?????ng Nai',1,1615350657,'61'),(205,'B??nh D????ng',1,1615350657,'065'),(206,'B?? R???a - V??ng T??u',1,1615350657,'64'),(207,'Gia Lai',1,1615350657,'59'),(208,'Kh??nh H??a',1,1615350657,'58'),(209,'L??m ?????ng',1,1615350657,'63'),(210,'?????k L???k',1,1615350657,'500'),(211,'Long An',1,1615350657,'72'),(212,'Ti???n Giang',1,1615350657,'73'),(213,'B???n Tre',1,1615350657,'75'),(214,'Tr?? Vinh',1,1615350657,'74'),(215,'V??nh Long',1,1615350657,'70'),(216,'?????ng Th??p',1,1615350657,'67'),(217,'An Giang',1,1615350657,'76'),(218,'S??c Tr??ng',1,1615350657,'79'),(219,'Ki??n Giang',1,1615350657,'77'),(220,'C???n Th??',1,1615350657,'710'),(221,'V??nh Ph??c',1,1615350657,'211'),(223,'Th???a Thi??n - Hu???',1,1615350657,'54'),(224,'H???i Ph??ng',1,1615350657,'31'),(225,'H???i D????ng',1,1615350657,'320'),(226,'Th??i B??nh',1,1615350657,'36'),(227,'H?? Giang',1,1615350657,'219'),(228,'Tuy??n Quang',1,1615350657,'27'),(229,'Ph?? Th???',1,1615350657,'210'),(230,'Qu???ng Ninh',1,1615350657,'33'),(231,'Nam ?????nh',1,1615350657,'350'),(232,'H?? Nam',1,1615350657,'351'),(233,'Ninh B??nh',1,1615350657,'30'),(234,'Thanh H??a',1,1615350657,'37'),(235,'Ngh??? An',1,1615350657,'38'),(236,'H?? T??nh',1,1615350657,'39'),(237,'Qu???ng B??nh',1,1615350657,'52'),(238,'Qu???ng Tr???',1,1615350657,'53'),(239,'B??nh Ph?????c',1,1615350657,'651'),(240,'T??y Ninh',1,1615350657,'66'),(241,'?????k N??ng',1,1615350657,'501'),(242,'Qu???ng Ng??i',1,1615350657,'55'),(243,'Qu???ng Nam',1,1615350657,'510'),(244,'Th??i Nguy??n',1,1615350657,'280'),(245,'B???c K???n',1,1615350657,'281'),(246,'Cao B???ng',1,1615350657,'26'),(247,'L???ng S??n',1,1615350657,'25'),(248,'B???c Giang',1,1615350657,'240'),(249,'B???c Ninh',1,1615350657,'241'),(250,'H???u Giang',1,1615350657,'711'),(252,'C?? Mau',1,1615350657,'780'),(253,'B???c Li??u',1,1615350657,'781'),(258,'B??nh Thu???n',1,1615350657,'62'),(259,'Kon Tum',1,1615350657,'60'),(260,'Ph?? Y??n',1,1615350657,'57'),(261,'Ninh Thu???n',1,1615350657,'68'),(262,'B??nh ?????nh',1,1615350657,'56'),(263,'Y??n B??i',1,1615350657,'29'),(264,'Lai Ch??u',1,1615350657,'231'),(265,'??i???n Bi??n',1,1615350657,'230'),(266,'S??n La',1,1615350657,'22'),(267,'H??a B??nh',1,1615350657,'218'),(268,'H??ng Y??n',1,1615350657,'321'),(269,'L??o Cai',1,1615350657,'20');
/*!40000 ALTER TABLE `province` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `revenue`
--

DROP TABLE IF EXISTS `revenue`;
/*!50001 DROP VIEW IF EXISTS `revenue`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `revenue` AS SELECT 
 1 AS `revenue`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role` (
  `id` int NOT NULL AUTO_INCREMENT,
  `role` varchar(255) NOT NULL,
  `modified_at` int DEFAULT NULL,
  `created_at` int NOT NULL DEFAULT '1619432870',
  `is_active` int NOT NULL DEFAULT '1',
  `agent_id` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role`
--

LOCK TABLES `role` WRITE;
/*!40000 ALTER TABLE `role` DISABLE KEYS */;
INSERT INTO `role` VALUES (1,'Qu???n tr???',NULL,1615350573,1,NULL),(2,'Nh??n vi??n',NULL,1615350573,1,NULL),(3,'?????i l??',NULL,1615350573,1,NULL);
/*!40000 ALTER TABLE `role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `store`
--

DROP TABLE IF EXISTS `store`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `store` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `modified_at` int DEFAULT NULL,
  `created_at` int NOT NULL DEFAULT '1619432870',
  `is_active` int NOT NULL DEFAULT '1',
  `agent_id` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `store`
--

LOCK TABLES `store` WRITE;
/*!40000 ALTER TABLE `store` DISABLE KEYS */;
INSERT INTO `store` VALUES (1,'admin',NULL,1615463563,0,1),(2,'kho HN1',NULL,1615463563,0,1),(3,'kho ???? n???ng123',NULL,1616573362,0,1),(4,'kho ???? n???ng1',NULL,1616573362,0,1),(5,'kho ???? n???ng1',NULL,1616655990,0,1),(6,'kho ???? n???ng12',NULL,1616689272,0,1),(7,'kho ???? n???ng123',NULL,1616689272,0,1),(8,'kho h?? n???i',NULL,1616689272,0,1),(9,'Kho ??N',NULL,1616989860,1,1),(10,'kho h?? n???i',NULL,1616989860,0,1),(11,'kho ???? n???ng123',NULL,1616989860,0,1),(12,'kho h?? n???i',NULL,1616989860,0,1),(13,'Kho H?? N???i',NULL,1616989860,1,1),(14,'Kho H??? Ch?? Minh',NULL,1617594877,1,1),(15,'????ng l???nh',NULL,1617594877,0,8),(16,'Kho t???ng HCM',NULL,1617594877,0,8),(17,'Kho H?? N???i',NULL,1617594877,1,8),(18,'Th???c ph???m t????i',NULL,1617856348,1,64),(19,'Kho 1',NULL,1618992073,1,95),(20,'Kho 2',NULL,1618992073,1,95),(21,'Kho trung t??m',NULL,1618992073,1,96),(22,'H?? N???i',NULL,1619012297,1,97),(23,'Trung T??m',NULL,1619012297,1,97),(24,'Trung T??m 1',NULL,1619012297,1,8),(25,'kho t??m',NULL,1619071143,1,93),(26,'Kho 1 Th??y ?????i l?? 1',NULL,1619088180,0,102),(27,'Kho 2Th??y ?????i l?? 1',NULL,1619088180,1,102),(28,'Kho 3 Th??y ?????i l?? 1',NULL,1619088180,1,102),(29,'Kho 4 Th??y ?????i l?? 1',NULL,1619088180,1,102),(30,'Kho 5Th??y ?????i l?? 1',NULL,1619088180,0,102),(35,'Kho trung t??m',NULL,1619165358,1,136),(36,'Kho trung t??m',NULL,1619165507,1,8),(37,'Kho Qu???ng',NULL,1619165507,0,51),(38,'Kho Qu???ng Ninh',NULL,1619165507,1,51),(39,'11111111111',NULL,1619165507,1,51),(40,'Kho trung t??m',NULL,1619165507,1,3),(41,'Kho trung t??m',NULL,1619259226,1,140),(42,'Kho trung t??m',NULL,1619259226,1,142),(43,'Kho trung t??m',NULL,1619259226,1,138),(44,'Kho 1 Th??y admin',NULL,1619259226,1,140),(45,'Kho trung t??m',NULL,1619259226,1,141),(46,'Kho trung t??m',NULL,1619259226,1,145),(47,'Kho trung t??m',NULL,1619400880,1,144),(48,'Kho trung t??m',NULL,1619400880,1,147),(49,'Kho trung t??m',NULL,1619401129,1,139),(50,'Kho trung t??m',NULL,1619411379,1,151),(51,'Kho trung t??m',NULL,1619411379,1,152);
/*!40000 ALTER TABLE `store` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `supplier`
--

DROP TABLE IF EXISTS `supplier`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `supplier` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `phone_number` varchar(255) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `tax_code` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `province_id` int NOT NULL,
  `modified_at` int DEFAULT NULL,
  `created_at` int NOT NULL DEFAULT '1619432870',
  `is_active` int NOT NULL DEFAULT '1',
  `debt` bigint DEFAULT '0',
  `code` varchar(255) NOT NULL,
  `agent_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `province_id` (`province_id`),
  CONSTRAINT `supplier_ibfk_1` FOREIGN KEY (`province_id`) REFERENCES `province` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `supplier`
--

LOCK TABLES `supplier` WRITE;
/*!40000 ALTER TABLE `supplier` DISABLE KEYS */;
INSERT INTO `supplier` VALUES (30,'Nh?? cung c???p 1','0975545830','H?? N???i','1234567891','ncc1@winds.vn',201,NULL,1619165507,1,-250000,'SUP570073573877',3),(31,'NCC 1 Th??y admin 1','0965520566',NULL,'',NULL,206,NULL,1619259226,1,0,'SUP000031',140),(32,'NCC 2 Th??y admin 1','0965520567',NULL,'',NULL,203,NULL,1619259226,1,0,'SUP000032',140),(33,'Nh?? cung c???p H????ng','0987654322',NULL,'',NULL,206,NULL,1619400880,1,0,'SUP000033',145),(34,'NCC c???a nh??n vi??n','0987652345','','',NULL,207,NULL,1619400880,1,0,'SUP000034',144),(35,'hieplocdev','0343507125',NULL,'','hieplocdev@gmail.com',201,NULL,1619411379,1,7600000,'SUP000035',151),(36,'Nh?? cung c???p 2','0982736196','H?? N???i','123456789','ncc2@winds.vn',201,NULL,1619411379,1,0,'SUP000036',3),(37,'Nh?? cung c???p 4','0982746573','H?? N???i','123456789','ncc4@winds.vn',202,NULL,1619411379,0,0,'SUP000037',3),(38,'Nh?? cung c???p 3','0982716231','H?? N???i','123456789','ncc3@winds.vn',203,NULL,1619411379,1,0,'SUP000038',3),(39,'t','0987345679',NULL,'',NULL,206,NULL,1619411379,1,0,'SUP000039',144);
/*!40000 ALTER TABLE `supplier` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transaction`
--

DROP TABLE IF EXISTS `transaction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transaction` (
  `id` int NOT NULL AUTO_INCREMENT,
  `supplier_id` int DEFAULT NULL,
  `customer_id` int DEFAULT NULL,
  `amount` bigint DEFAULT '0',
  `type` int NOT NULL,
  `note` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `modified_at` int DEFAULT NULL,
  `created_at` int NOT NULL DEFAULT '1619432870',
  `is_active` int NOT NULL DEFAULT '1',
  `agent_id` int DEFAULT NULL,
  `debt` bigint DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `supplier_id` (`supplier_id`),
  KEY `customer_id` (`customer_id`),
  CONSTRAINT `transaction_ibfk_55` FOREIGN KEY (`supplier_id`) REFERENCES `supplier` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `transaction_ibfk_56` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=608 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transaction`
--

LOCK TABLES `transaction` WRITE;
/*!40000 ALTER TABLE `transaction` DISABLE KEYS */;
INSERT INTO `transaction` VALUES (257,NULL,NULL,750000000,1,'Nh???p h??ngNH113724115482',NULL,1619012297,1,NULL,750000000),(258,NULL,NULL,-700000000,7,'Thanh to??nNH113724115482',NULL,1619012297,1,NULL,50000000),(271,NULL,4,300000,3,'ORDER956276953381',NULL,1619012297,1,NULL,0),(274,NULL,NULL,325000000,1,'Nh???p h??ngNH704084708417',NULL,1619012297,1,NULL,316237766),(275,NULL,NULL,0,7,'Thanh to??nNH704084708417',NULL,1619012297,1,NULL,316237766),(278,NULL,7,0,3,'ORDER789786788475',NULL,1619012297,1,NULL,0),(290,NULL,NULL,2600,1,'Nh???p h??ngNH746001742431',NULL,1619060388,1,NULL,-2300),(291,NULL,NULL,-1000,7,'Thanh to??nNH746001742431',NULL,1619060388,1,NULL,-3300),(295,NULL,NULL,2600,1,'Nh???p h??ngNH078038073926',NULL,1619060388,1,NULL,-1700),(296,NULL,NULL,-1000,7,'Thanh to??nNH078038073926',NULL,1619060388,1,NULL,-2700),(300,NULL,NULL,2600,1,'Nh???p h??ngNH596677597012',NULL,1619060388,1,NULL,-200100),(301,NULL,NULL,-1000,7,'Thanh to??nNH596677597012',NULL,1619060388,1,NULL,-201100),(302,NULL,NULL,2600,1,'Nh???p h??ngNH502195508574',NULL,1619060388,1,NULL,-298500),(303,NULL,NULL,-1000,7,'Thanh to??nNH502195508574',NULL,1619060388,1,NULL,-299500),(314,NULL,7,0,3,'ORDER721460721181',NULL,1619012297,1,NULL,0),(333,NULL,NULL,-10000,5,'R000725006534',NULL,1619076238,1,NULL,49990000),(342,NULL,NULL,2800000,1,'Nh???p h??ng NH818584814203',NULL,1619071143,1,NULL,2740000),(343,NULL,NULL,-2500000,7,'Thanh to??n NH818584814203',NULL,1619071143,1,NULL,240000),(344,NULL,NULL,25000,1,'Nh???p h??ng NH415289417521',NULL,1619071143,1,NULL,316262766),(345,NULL,NULL,0,7,'Thanh to??n NH415289417521',NULL,1619071143,1,NULL,316262766),(346,NULL,3,100000,2,'ORDER397992392056',NULL,1619077559,1,NULL,0),(349,NULL,3,100000,2,'ORDER039355039100',NULL,1619082531,1,NULL,0),(353,NULL,NULL,760000,1,'Nh???p h??ng NH287399283997',NULL,1619071143,1,NULL,317022766),(354,NULL,NULL,-500000,7,'Thanh to??n NH287399283997',NULL,1619071143,1,NULL,316522766),(382,NULL,5,30000,3,'ORDER444975445232',NULL,1619071143,1,NULL,0),(400,NULL,7,0,2,'ORDER152738152662',NULL,1619088180,1,NULL,0),(401,NULL,7,0,2,'ORDER162338168204',NULL,1619088180,1,NULL,0),(458,NULL,NULL,200000,6,'T???o phi???u chi P649763648877',NULL,1619105580,1,NULL,200000),(459,NULL,NULL,-200000,5,'T???o phi???u thu R539564539428',NULL,1619105580,1,NULL,0),(460,NULL,NULL,-500000,5,'T???o phi???u thu R039665034276',NULL,1619105580,1,NULL,-500000),(461,NULL,NULL,-300000,5,'T???o phi???u thu R498965496926',NULL,1619105580,1,NULL,-800000),(462,NULL,NULL,200000,6,'T???o phi???u chi P310766315014',NULL,1619105580,1,NULL,-600000),(463,NULL,NULL,100000,6,'T???o phi???u chi P623066624020',NULL,1619105580,1,NULL,-500000),(464,NULL,NULL,-100000,6,'Xo?? phi???u chi P077373074240',NULL,1619105580,1,NULL,-600000),(465,NULL,NULL,200000,6,'T???o phi???u chi P113673119462',NULL,1619105580,1,NULL,-400000),(466,NULL,NULL,-200000,6,'Xo?? phi???u chi P188784189835',NULL,1619105580,1,NULL,-600000),(467,NULL,NULL,300000,6,'T???o phi???u chi P221684224035',NULL,1619105580,1,NULL,-300000),(468,NULL,NULL,-300000,6,'Xo?? phi???u chi P851787852765',NULL,1619105861,1,NULL,-600000),(469,NULL,NULL,400000,6,'T???o phi???u chi P886787884029',NULL,1619105861,1,NULL,-200000),(470,NULL,NULL,300000,5,'Xo?? phi???u thu R824893826382',NULL,1619105861,1,NULL,100000),(471,NULL,NULL,-300000,5,'T???o phi???u thu R860893862521',NULL,1619105861,1,NULL,-200000),(472,NULL,NULL,-200000,5,'Xo?? phi???u chi P802696801563',NULL,1619105861,1,NULL,-400000),(473,NULL,NULL,-500000,5,'T???o phi???u thu R835796839026',NULL,1619105861,1,NULL,-900000),(474,NULL,NULL,500000,5,'Xo?? phi???u thu R522006523370',NULL,1619105861,1,NULL,-400000),(475,NULL,NULL,-500000,5,'T???o phi???u thu R557906555659',NULL,1619105861,1,NULL,-900000),(476,NULL,NULL,500000,6,'Xo?? phi???u thu R746808747493',NULL,1619105861,1,NULL,-400000),(477,NULL,NULL,500000,6,'T???o phi???u chi P778408775926',NULL,1619105861,1,NULL,100000),(478,NULL,NULL,-400000,5,'Xo?? phi???u chi P516613511445',NULL,1619105861,1,NULL,-300000),(479,NULL,NULL,-500000,5,'T???o phi???u thu R548013548362',NULL,1619105861,1,NULL,-800000),(480,NULL,NULL,500000,5,'Xo?? phi???u thu R918160917779',NULL,1619106571,1,NULL,-300000),(481,NULL,NULL,-500000,6,'Xo?? phi???u chi P811263819482',NULL,1619106571,1,NULL,-800000),(482,NULL,NULL,-100000,5,'T???o phi???u thu R059258054737',NULL,1619142857,1,NULL,-650000),(483,NULL,NULL,200000,6,'T???o phi???u chi P069777066260',NULL,1619142857,1,NULL,-450000),(484,NULL,NULL,300000,5,'Xo?? phi???u thu R356325351353',NULL,1619142857,1,NULL,-500000),(485,NULL,NULL,-350000,5,'T???o phi???u thu R357625357326',NULL,1619142857,1,NULL,-850000),(486,NULL,NULL,50000000,1,'Nh???p h??ng NH449778445784',NULL,1619165507,1,NULL,50000000),(487,NULL,NULL,-45000000,7,'Thanh to??n NH449778445784',NULL,1619165507,1,NULL,5000000),(488,NULL,3,15200000,3,'ORDER355734358403',NULL,1619165507,1,NULL,0),(489,30,NULL,18000000,1,'Nh???p h??ng NH706553703962',NULL,1619165507,1,NULL,18000000),(490,30,NULL,-15000000,7,'Thanh to??n NH706553703962',NULL,1619165507,1,NULL,3000000),(493,30,NULL,7500000,1,'Nh???p h??ng NH625986629378',NULL,1619174964,1,NULL,10500000),(494,30,NULL,-6000000,7,'Thanh to??n NH625986629378',NULL,1619174964,1,NULL,4500000),(503,NULL,3,11940000,2,'B??n s???  ORDER982491984400',NULL,1619226355,1,NULL,14805650),(504,NULL,3,-1000000,7,'Thanh to??n ORDER982491984400',NULL,1619226355,1,NULL,13805650),(505,NULL,3,119400,2,'B??n s???  ORDER647711648491',NULL,1619227087,1,NULL,12945050),(506,NULL,3,-20000,7,'Thanh to??n ORDER647711648491',NULL,1619227087,1,NULL,12925050),(507,NULL,3,119400,2,'B??n s???  ORDER661118661909',NULL,1619227179,1,NULL,13044450),(508,NULL,3,-20000,7,'Thanh to??n ORDER661118661909',NULL,1619227179,1,NULL,13024450),(519,30,NULL,2400000,1,'Nh???p h??ng NH162936163666',NULL,1619174964,1,NULL,6900000),(520,30,NULL,-2000000,7,'Thanh to??n NH162936163666',NULL,1619174964,1,NULL,4900000),(521,30,NULL,-2400000,8,'Xo?? phi???u nh???p NH663773661101',NULL,1619231731,1,NULL,2500000),(522,30,NULL,1650000,1,'Nh???p h??ng NH703473706488',NULL,1619231731,1,NULL,4150000),(523,30,NULL,-2000000,7,'Thanh to??n NH703473706488',NULL,1619231731,1,NULL,2150000),(524,30,NULL,-1650000,8,'Xo?? phi???u nh???p NH247517247433',NULL,1619232169,1,NULL,500000),(525,30,NULL,1200000,1,'Nh???p h??ng NH284617289393',NULL,1619232169,1,NULL,1700000),(526,30,NULL,-2000000,7,'Thanh to??n NH284617289393',NULL,1619232169,1,NULL,-300000),(528,30,NULL,750000,1,'Nh???p h??ng NH334600338416',NULL,1619174964,1,NULL,450000),(529,30,NULL,-700000,7,'Thanh to??n NH334600338416',NULL,1619174964,1,NULL,-250000),(536,NULL,31,119400,2,'B??n s???  ORDER209494203248',NULL,1619236923,1,NULL,119400),(537,NULL,31,-20000,7,'Thanh to??n ORDER209494203248',NULL,1619236923,1,NULL,99400),(538,NULL,31,-119400,2,'Xo?? phi???u b??n h??ng ORDER491713497125',NULL,1619237131,1,NULL,-20000),(539,NULL,31,238800,2,'B??n s???  ORDER531713531267',NULL,1619237131,1,NULL,218800),(540,NULL,31,-20000,7,'Thanh to??n ORDER531713531267',NULL,1619237131,1,NULL,198800),(541,NULL,31,-238800,2,'Xo?? phi???u b??n h??ng ORDER537223532900',NULL,1619237131,1,NULL,-40000),(542,NULL,31,238800,2,'B??n s???  ORDER576823571759',NULL,1619237131,1,NULL,198800),(543,NULL,31,-20000,7,'Thanh to??n ORDER576823571759',NULL,1619237131,1,NULL,178800),(544,NULL,31,-238800,2,'Xo?? phi???u b??n h??ng ORDER146741148394',NULL,1619237131,1,NULL,-60000),(545,NULL,31,238800,2,'B??n s???  ORDER186941182246',NULL,1619237131,1,NULL,178800),(546,NULL,31,-20000,7,'Thanh to??n ORDER186941182246',NULL,1619237131,1,NULL,158800),(547,NULL,31,100000,6,'T???o phi???u chi P901658907520',NULL,1619241576,1,NULL,258800),(548,NULL,NULL,-100000,6,'Xo?? phi???u chi P501365503836',NULL,1619241576,1,NULL,158800),(549,NULL,NULL,-100000,6,'Xo?? phi???u chi P539074539808',NULL,1619241576,1,NULL,158800),(550,NULL,31,-100000,6,'Xo?? phi???u chi P798510799850',NULL,1619242105,1,NULL,158800),(551,NULL,31,-238800,3,'Xo?? phi???u b??n h??ng ORDER551766551288',NULL,1619260661,1,NULL,-80000),(552,NULL,31,80000,6,'T???o phi???u chi P938931937257',NULL,1619259226,1,NULL,0),(553,NULL,31,990000,3,'B??n l???  ORDER965681964700',NULL,1619259226,1,NULL,990000),(554,NULL,31,-510000,7,'Thanh to??n ORDER965681964700',NULL,1619259226,1,NULL,480000),(555,NULL,31,119400,2,'B??n s???  ORDER149868145113',NULL,1619419641,1,NULL,599400),(556,NULL,31,-20000,7,'Thanh to??n ORDER149868145113',NULL,1619419641,1,NULL,579400),(563,NULL,31,129350,2,'B??n s???  ORDER414616418554',NULL,1619421031,1,NULL,708750),(564,NULL,31,-20000,7,'Thanh to??n ORDER414616418554',NULL,1619421031,1,NULL,688750),(565,35,NULL,8000000,1,'Nh???p h??ng NH228436228923',NULL,1619411379,1,NULL,8000000),(566,35,NULL,-400000,7,'Thanh to??n NH228436228923',NULL,1619411379,1,NULL,7600000),(567,NULL,31,129350,2,'B??n s???  ORDER195813192209',NULL,1619422049,1,NULL,818100),(568,NULL,31,-20000,7,'Thanh to??n ORDER195813192209',NULL,1619422049,1,NULL,798100),(580,NULL,NULL,200000,7,'Thanh to??n RETURN890963898334',NULL,1619427554,1,NULL,512100),(588,NULL,NULL,100000,7,'Thanh to??n RETURN243547245532',NULL,1619447342,1,NULL,344900),(590,NULL,NULL,100000,7,'Thanh to??n RETURN715868713864',NULL,1619449498,1,NULL,412100),(591,NULL,31,-486000,4,'Kh??ch tr??? h??ng RETURN818083816869',NULL,1619449831,1,NULL,312100),(592,NULL,31,100000,7,'Thanh to??n RETURN818083816869',NULL,1619449831,1,NULL,412100),(593,NULL,31,-486000,4,'Kh??ch tr??? h??ng RETURN582292587745',NULL,1619450921,1,NULL,-73900),(594,NULL,31,100000,7,'Thanh to??n RETURN582292587745',NULL,1619450921,1,NULL,26100),(595,NULL,31,-486000,4,'Kh??ch tr??? h??ng RETURN241798242640',NULL,1619450978,1,NULL,-459900),(596,NULL,31,100000,7,'Thanh to??n RETURN241798242640',NULL,1619450978,1,NULL,-359900),(597,NULL,31,-486000,4,'Kh??ch tr??? h??ng RETURN263362268843',NULL,1619451609,1,NULL,-845900),(598,NULL,31,100000,7,'Thanh to??n RETURN263362268843',NULL,1619451609,1,NULL,-745900),(599,NULL,31,-486000,9,'Xo?? phi???u tr??? h??ng RETURN296892299741',NULL,1619451918,1,NULL,-1231900),(600,NULL,31,-972000,4,'Kh??ch tr??? h??ng RETURN336492338004',NULL,1619451918,1,NULL,-2203900),(601,NULL,31,100000,7,'Thanh to??n RETURN336492338004',NULL,1619451918,1,NULL,-2103900),(604,NULL,31,-972000,4,'Kh??ch tr??? h??ng RETURN761855763154',NULL,1619452523,1,NULL,-3075900),(605,NULL,31,2000000,7,'Thanh to??n RETURN761855763154',NULL,1619452523,1,NULL,-1075900),(606,NULL,31,-972000,4,'Kh??ch tr??? h??ng RETURN698262693333',NULL,1619452622,1,NULL,-2047900),(607,NULL,31,2000000,7,'Thanh to??n RETURN698262693333',NULL,1619452622,1,NULL,-47900);
/*!40000 ALTER TABLE `transaction` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `unit`
--

DROP TABLE IF EXISTS `unit`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `unit` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `modified_at` int DEFAULT NULL,
  `created_at` int NOT NULL DEFAULT '1619432870',
  `is_active` int NOT NULL DEFAULT '1',
  `agent_id` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `unit`
--

LOCK TABLES `unit` WRITE;
/*!40000 ALTER TABLE `unit` DISABLE KEYS */;
INSERT INTO `unit` VALUES (1,'hop',NULL,1615351483,0,1),(2,'H???p',NULL,1616433156,1,1),(3,'Bao',NULL,1616434971,1,1),(4,'bao',NULL,1616434971,0,1),(5,'c??n',NULL,1616434971,0,1),(6,'B??',NULL,1616435660,1,8),(7,'Kg',NULL,1616804511,1,1),(8,'T??',NULL,1617450651,1,8),(9,'Li???u',NULL,1617450651,1,8),(10,'G??i',NULL,1617450651,1,8),(11,'T??i',NULL,1617450651,1,1),(12,'N??ng',NULL,1617594877,1,8),(13,'H??ng kh??',NULL,1617594877,1,1),(14,'Han',NULL,1617594877,1,1),(15,'B??nh',NULL,1617621381,1,8),(16,'t??i',NULL,1617682853,1,51),(17,'T??',NULL,1617682853,1,51),(18,'T??i',NULL,1617683207,1,8),(19,'B??',NULL,1617856348,1,64),(20,'T??i',NULL,1618227684,1,87),(21,'Kg',NULL,1618227684,1,87),(22,'Kg',NULL,1618227684,1,51),(23,'K??',NULL,1618227684,1,87),(24,'456',NULL,1618227684,1,51),(25,'T???n',NULL,1618299438,1,51),(26,'Y???n',NULL,1618299438,1,51),(27,'6789',NULL,1618299438,1,51),(28,'T???',NULL,1618299438,1,87),(29,'cm',NULL,1618890494,1,93),(30,'chi???c',NULL,1618890494,1,93),(31,'l???c',NULL,1618890494,1,93),(32,'v???',NULL,1618890494,1,93),(33,'b??',NULL,1618992073,1,95),(34,'chi???c',NULL,1618992073,1,95),(35,'B??',NULL,1618992073,1,96),(36,'Chi???c',NULL,1619012297,1,97),(37,'Bao',NULL,1619071143,1,57),(38,'c??n',NULL,1619071143,1,57),(39,'c??y',NULL,1619071143,1,57),(40,'G??iiii',NULL,1619088180,1,57),(41,'Bao',NULL,1619088180,1,102),(42,'G??i',NULL,1619088180,1,102),(43,'L???',NULL,1619088180,1,102),(44,'T??',NULL,1619165507,1,3),(45,'Chi???c',NULL,1619174964,1,3),(46,'Bao',NULL,1619259226,1,140),(47,'G??i',NULL,1619259226,1,140),(48,'Th??ng',NULL,1619259226,1,140),(49,'Bao',NULL,1619400880,1,147),(50,'Kg',NULL,1619400880,1,147),(51,'T??i',NULL,1619400880,1,147),(52,'chiec',NULL,1619411379,1,151);
/*!40000 ALTER TABLE `unit` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `phone_number` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `date_of_birth` int DEFAULT NULL,
  `gender` int NOT NULL,
  `token` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `status` int NOT NULL DEFAULT '1',
  `role_id` int NOT NULL,
  `province_id` int NOT NULL,
  `modified_at` int DEFAULT NULL,
  `expired_at` int NOT NULL,
  `created_at` int NOT NULL DEFAULT '1619432871',
  `is_active` int NOT NULL DEFAULT '1',
  `agent_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `role_id` (`role_id`),
  KEY `province_id` (`province_id`),
  CONSTRAINT `user_ibfk_154` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_ibfk_155` FOREIGN KEY (`province_id`) REFERENCES `province` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=153 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (3,'root','0987654331','hn','$2a$10$5SOakphvlTgsrDAVKFtLuOo9G/AM0V.qa5rklOQarA9DhVyl1I5vS',1615350657,1,NULL,'admin@gmail.com',1,1,201,NULL,1615350657,1615351147,1,NULL),(138,'thangnt','0975545828','H?? N???i','$2a$10$7tginAPYLW0/RoIrI09ef.QX9cUn6p7qxoR5BqlOpD0e2sqUqbcaW',657824400,0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InBob25lX251bWJlciI6IjA5NzU1NDU4MjgiLCJpZCI6MTM4fSwiaWF0IjoxNjE5NDMxODY3LCJleHAiOjExNjE5NDMxODY3fQ.mDHGw0IifV412uMEExKDUH3jWLTVIVJB8d-Wz1J8gnc','truongthangmt3@gmail.com',1,1,201,NULL,1667667600,1619174266,1,3),(139,'Nam Admin','0962883560','H?? N???i','$2a$10$eaBDCZaF16XT8JlnKvo4Behp72nDyeui2vNA2rb.zME.H992EHQTG',919258180,0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InBob25lX251bWJlciI6IjA5NjI4ODM1NjAiLCJpZCI6MTM5fSwiaWF0IjoxNjE5NDAwOTU5LCJleHAiOjExNjE5NDAwOTU5fQ.mKSZahczZ2k-VaJEMY75ihRzp4zoIMroADkAs-x12Ow','namta3@gmail.com',1,1,201,NULL,1809091803,1619184620,1,3),(140,'tamnd','0974935629','?????ng ??a, H?? N???i','$2a$10$xp3.CKM2W5Yq7UXoR51jOuAG6cV8rWT4ZQXPO3xo7HhnX.1r0iWDi',896942746,0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InBob25lX251bWJlciI6IjA5NzQ5MzU2MjkiLCJpZCI6MTQwfSwiaWF0IjoxNjE5NDMyMzk5LCJleHAiOjExNjE5NDMyMzk5fQ.XpsFOn61tCpt7zBXmudpiv8XMxffQ7zNX10ftAdOKq0','tamnd@winds.vn',1,1,201,NULL,1760165181,1619246868,1,3),(141,'Th??y Admin','0965520566','H?? N???i','$2a$10$wdy2IXmW/K2rcFMjGHvWUem5R.UYOSPa5jPBP9A.aM4GChNGYra/G',1619104180,0,NULL,'thuy@gmail.com',1,1,201,NULL,1618931389,1619363400,1,140),(142,'Th??y ?????i l??','0965520555','H?? N???i','$2a$10$fTUUs5Bs31XvwpEKQ9odm.y88aBrKujgB/JQL2dqGmaVUiy8CZqJy',1617808265,0,NULL,'thuy@gmail.com',1,3,207,NULL,1619881876,1619363492,1,NULL),(143,'admin001','0975545886','ha noi','$2a$10$TRcPfyji6s.726/2IrLJqO9s.VKcNjtGXgJSTZbV18wB6/w4Tv0ae',657824400,0,NULL,'truongthangmt3@gmail.com',1,1,201,NULL,1617981514,1619363932,1,138),(144,'H????ng Admin','0976763812','Th?????ng T??n','$2a$10$KKoba15td6dVmnj6tInb2.bo5XtBHLqz00yuY4wLlb.trwe1iaToe',941246268,1,NULL,'huong@gmail.com',1,1,201,NULL,1680311901,1619399920,1,141),(145,'H????ng ?????i l??','0976763811','Tr???n Ph?? - H?? ????ng','$2a$10$EwWFkST5yk2LJoKk/V2/mOMgXMvUYswV0vH7OTpSlniIE2vBV6/n2',1238635699,1,NULL,'nv@gmail.com',1,3,202,NULL,1619573332,1619400554,1,NULL),(146,'Nh??n vi??n H????ng btt','0976763813','Thanh Xu??n','$2a$10$uN.ITaOfPmuKyZQm/y3UyOqwG/YgXWhsQC9XqM/oZqh1nu4yRHBsK',1265852104,0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InBob25lX251bWJlciI6IjA5NzY3NjM4MTMiLCJpZCI6MTQ2fSwiaWF0IjoxNjE5NDAyMzA3LCJleHAiOjExNjE5NDAyMzA3fQ.Ezngx-YAKbXi3vX5l7Ba0tNs-2hUVLiXEpHwaGR5hls','huongbtt@gmail.com',1,2,201,NULL,1619573741,1619400970,1,144),(147,'Huong','0346924750','H?? N???i','$2a$10$QgsXk2nBAWp0Q45uXx63su8s/ajilVvpfoQts7TCuxJR337j94oQC',1616620499,1,NULL,'huong@gmail.com',1,1,201,NULL,1615350657,1619400953,1,3),(148,'Nguy???n Thanh H?????ng','0346924758','Xu??n Th???y','$2a$10$1aLTxdqJCNJoL3B/74PZ0Od/.8V1.bkaqjXhZ9QATjTaF3G/FA2Vy',1618451056,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InBob25lX251bWJlciI6IjAzNDY5MjQ3NTgiLCJpZCI6MTQ4fSwiaWF0IjoxNjE5NDAyMzc5LCJleHAiOjExNjE5NDAyMzc5fQ.gKwx3gxlRWWSE5WfAJbjGmpJ-lGmITpFKZDPAR4LNMs','huong1235@gmail.com',1,2,267,NULL,1630028677,1619401504,1,147),(149,'Nh??n vi??n ?????i l?? 1','0976763814','Ph??? C??','$2a$10$22lxIGco3prlQY5TG09Wlu7BQh/MAZCwsFJ7Uvv5THrbVY4NnGAY.',754105393,0,NULL,'nvdl1@gmail.com',1,2,265,NULL,1680745496,1619401551,1,145),(150,'cuongdm','0962583782','hn','$2a$10$RrJnPNCs2VAGCfo0GNrj4OwVaVWZVAv32QLQhn.ZgGL3QsV97wRJm',1615350657,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InBob25lX251bWJlciI6IjA5NjI1ODM3ODIiLCJpZCI6MTUwfSwiaWF0IjoxNjE5NDA1NDAwLCJleHAiOjExNjE5NDA1NDAwfQ.-ymD26VNg3epI-8QZpr9ulJrvhGPQUwaYwVcG7V84HE','admin@gmail.com',1,1,201,NULL,1615350657,1619401130,1,139),(151,'hieplocdev','0343507124','TBVN','$2a$10$j1jcgvlfpIi/FG1scHvc0upxWeHRi5Z2cCMtbvVGqi.HaED9eTtdS',949475483,0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InBob25lX251bWJlciI6IjAzNDM1MDcxMjQiLCJpZCI6MTUxfSwiaWF0IjoxNjE5NDIxMTQyLCJleHAiOjExNjE5NDIxMTQyfQ.0xA9nW1_mzIDNutIbYguRqPcKgYXRIm2tUTMb5h8n1k','hieplocdev@gmail.com',1,3,201,NULL,1682147510,1619421124,1,NULL),(152,'tam2','0987654321','H?? N???i','$2a$10$0Us7fKMWwOgxHZxIiKj2l.xZs1RK9jAHX4v9sd1rMa2VSk3e0XM06',1619428776,0,NULL,'tam2@winds.vn',1,3,201,NULL,1775726397,1619428832,1,NULL);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Final view structure for view `daysofweek`
--

/*!50001 DROP VIEW IF EXISTS `daysofweek`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`tacn`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `daysofweek` AS select 'Mon' AS `Mon` union select 'Tue' AS `Tue` union select 'Web' AS `Web` union select 'Thu' AS `Thu` union select 'Fri' AS `Fri` union select 'Sat' AS `Sat` union select 'Sun' AS `Sun` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `revenue`
--

/*!50001 DROP VIEW IF EXISTS `revenue`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`tacn`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `revenue` (`revenue`) AS select (select sum(`product`.`retail_price`) AS `revenue` from `product`) AS `(SELECT SUM(product.retail_price) AS revenue FROM product)` union select sum(`product`.`wholesale_price`) AS `SUM(product.wholesale_price)` from `product` union select sum(`invoice`.`voucher_type`) AS `SUM(invoice.voucher_type)` from `invoice` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-04-27  8:52:16
