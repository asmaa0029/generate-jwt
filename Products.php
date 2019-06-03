<?php

	include_once 'Connexion.php';
	require 'jwt.php';
	require 'keys.php';

$jwt=$_GET['jwt'];
$generate=generate_key();

	$pay=validate_jwt($jwt, $generate);

	/*$keys = [];
	$req = $conx->query("select cle from cles order by generation limit 0,1");
	while ($key = $req->fetch() ) {
		$keys[] = $key;
}

	$pay=validate_jwt($jwt, $keys[0]['cle']); */
// var_dump($pay);

if(isset ($pay['Role'])){

	if($pay['Role']==='admin'){

		$rep['data'] = $conx-> query("select name As 'Nom', price As 'Prix', created As 'Creation', cost As 'Coût', modified As 'Modification' from products")->fetchall();

	}
	elseif($pay['Role']==='user'){

		$rep['data'] = $conx->query("select name As 'Nom', price As 'Prix', created As 'Creation' from products")->fetchall();

	}
	else{

		$rep['message']="Not Authenticated";
		http_response_code(401); 

	}
}
else {
	$rep['message']="Not Authenticated";
	http_response_code(401); 
}
$myjson = json_encode($rep);
echo $myjson;

	/*if(validate_jwt($_GET['jwt'];$keys[0])){
		//process
	}
	else{
		echo "Not authorized";
		http_response_code(403);
	}*/
	?>