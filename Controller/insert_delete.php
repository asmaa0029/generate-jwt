<?php
	include_once 'Connexion.php';
	require 'jwt.php';
	require 'keys.php';
	
	$keys = [];
	$req = $conx->query("select cle from cles order by generation limit 0,1");
		while ($key = $req->fetch() ) {
			$keys[] = $key;
	}

	$generate=generate_key();
//$pay=validate_jwt($jwt, $generate);

	$jwt = validate_jwt($_GET['token'],$generate);
	try{
	 if ($jwt['Role'] == 'admin') {
		if($_GET['action'] == "delete"){
			
			$name = $_GET['Nom'];
			$delete =  "DELETE FROM `products` WHERE  `products`.`name` = '$name'";
			if($conx->exec($delete)){
				 echo "Produit bien supprimé !"; }
		}
		elseif ($_GET['action'] == "insert") {
			$req = $conx->prepare("insert into products (name,cost,price) values ('".$_GET['Nom']."',".$_GET['Cout'].",".$_GET['Prix'].")")->execute();
			if($req){ echo "Produit ".$_GET['Nom']." bien ajouté !"; }
		}
	 }
	 else{ http_response_code(401); die("Vous n'avez pas le role admin"); }
	}
	catch (PDOException $e){
		http_response_code(500);
		echo "Erreur ".$e;
	}
	?>