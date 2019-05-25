<?php
include './jwt.php';
include './keys.php';
//création de l'objet pour utiliser la classe user


 //$_POST['username'];
 //$_POST['user_id'];
 //$_POST['user_role'];
  //pour appler la méthode create_user()
    //$payload = $user->create_user($_POST);

 $payload = array('user_role' => 'admin','username'=>'halima' );
 $key = generate_key();

 $jwt = JWT($head=array("alg"=>"sha256","typ"=>"JWT"),$payload,$key);
 echo $jwt;
 ?>
