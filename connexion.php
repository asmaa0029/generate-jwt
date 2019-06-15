<?php
try{
            $conx = new PDO("mysql:host=localhost;dbname=salhi", "root", "");
        }catch(PDOException $exception){
            echo "Connection error: " . $exception->getMessage();
        }
        var_dump($conx);
        
?>
