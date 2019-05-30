<?php
include './jwt.php';
include './keys.php';
$valid = 3600;
//création de l'objet pour utiliser la classe user


 //$_POST['username'];
 //$_POST['user_id'];
 //$_POST['user_role'];
  //pour appler la méthode create_user()
    //$payload = $user->create_user($_POST);

 $payload = array('Role' => 'user','Nom'=>'basma');
 $key = generate_key();

 $jwt = JWT($head=array("alg"=>"sha256","typ"=>"JWT"),$payload,$key, $valid);
 $result = validate_jwt($jwt,$key);
 print_r($result);
 echo $jwt;
 ?>
