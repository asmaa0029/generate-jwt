<?php

	include_once 'Connexion.php';
	require 'jwt.php';

	if(validate_jwt($_GET['jwt'];$keys[0])){
		//process
	}
	else{
		echo "Not authorized";
		http_response_code(403);
	}
?>