<?php
include './jwt.php';
//création de l'objet pour utiliser la classe user
$user = new User($db);

 //$_POST['username'];
 //$_POST['user_id'];
 //$_POST['user_role'];
  //pour appler la méthode create_user()
    //$payload = $user->create_user($_POST);

 $payload = array('user_role' => 'admin','username'=>'halima' );


 if (!isset($_SESSION['key'])) {

   echo "no session";
   list($key, $time) = generate_key(0,uniqid());
   $_SESSION['time'] = $time;
   $_SESSION['key'] = $key;
   session_start();
 }

$key = $_SESSION['key'];
 echo "first key : $key<br>";
 $jwt = JWT($head=array("alg"=>"sha256","typ"=>"JWT"),$payload,$key);
 ?>

$key = generate_key();
		if(verify){
			echo"jwt exist<br>$key<br>";
			$jwt = jwt(array("alg"=>"sha256","typ"=>"JWT"),$payload,$key);
		}
		elseif(!isset($jwt)){
      verify = TRUE
			echo"jwt not exist<br>$key<br>";
			
			$jwt = jwt(array("alg"=>"sha256","typ"=>"JWT"),$payload,$key);
		}