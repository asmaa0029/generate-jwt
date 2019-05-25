<?php
	include_once 'Connexion.php';
	require 'jwt.php';
	require 'keys.php';
	
	//$payload = array('user_role' => 'admin','username'=>'asma' );
	$key = generate_key();
   
	$valid = time();
	$jwt = JWT($head=array("alg"=>"sha256","typ"=>"JWT"),$payload,$key, $valid);
	echo $jwt;

	
	$userData = $conx->query("select name AS 'Nom', role AS 'Role', created AS 'Création' from users where name=".$_POST['user'])->fetch();

	if(sizeof($userData) > 0 and md5($userData['password']) === md5($_POST['password'])){
		$payload = $userData;
		$keys = [];
		$req = $conx->query("select key from cles order by generation limit 3");
		while ($key = $req->fetch() ) {
			$keys[] = $key;
		}
	}
	else{
		http_response_code(403);
		die("Login invalide !");
	}

	$jwt = jwt(array("alg"=>"sha256","typ"=>"JWT"),$payload,$keys[0]);
	echo $jwt;
?>
