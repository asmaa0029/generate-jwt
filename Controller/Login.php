<?php
	include_once 'Connexion.php';
	require 'jwt.php';
	require 'keys.php';

	$userData = $conx->query("select name AS 'Nom', role AS 'Role', created AS 'Création', password from users where name='".$_POST['user']."'")->fetch(PDO::FETCH_ASSOC);
	if(sizeof($userData) > 0 and $userData['password'] === $_POST['password']){
		unset($userData['password']);
		$payload = $userData;
		$keys = [];
		$req = $conx->query("select cle from cles order by generation limit 0,1");
		while ($key = $req->fetch() ) {
			$keys[] = $key;
		}

		$generate=generate_key();
		
	}
	else{
		http_response_code(401);
		die("Login invalide !");
	}

		$jwt = jwt(array("alg"=>"sha256","typ"=>"JWT"),$payload,$generate);
		setcookie('jwt', $jwt, time() + 3600, "/", "*", false, true);
	
		
	echo $jwt;
?>


