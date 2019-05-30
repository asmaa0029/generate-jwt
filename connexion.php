<?php
	try{
    	$conx = new PDO("mysql:host=localhost;dbname=salhi", "root", "", array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
    }
 	catch(PDOException $exception){
    	echo "Connection error: " . $exception->getMessage();
 	}
?>