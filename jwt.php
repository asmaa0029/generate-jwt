<?php
include_once './data_base.php';
include './create_product.php';

// Obtenir la connexion à la base de données
$database = new Database();
$db = $database->getConnection();
// $key = uniqid();
function JWT($head=array("alg"=>"sha256","typ"=>"JWT"),$payload=[],$key){
        $head64 = base64_encode(json_encode($head));
        $payload64 = base64_encode(json_encode($payload));
        $hash64 = base64_encode(hash_hmac('sha256', $head64.".".$payload64, $key));

        // Create JWT
        $jwt = $head64 . "." . $payload64 . "." . $hash64;
        // echo $jwt;
        return $jwt;
    }

function validate_jwt($jwt, $key) {

     $decoded = explode(".", $jwt);
     // $head64 = $decoded[0];
     // $payload64 = $decoded[1];
     list($head64, $payload64, $hash64) = $decoded;
     //echo"<pre>";
     $crpt =  base64_encode(hash_hmac('sha256', $head64.".".$payload64, $key));

      if($crpt!=$hash64) {
          http_response_code(401);
          //  indique à l'utilisateur que la connexion a échoué
          echo json_encode(array("message" => "jwt verification failed."));
          return false;
        }
      // on a besoin de payload pour avoir si l'utilisateur a le deroit d'un admin ou non
     $payload = json_decode(base64_decode($payload64), true);

     if ($payload['user_role'] != 'admin') {
          //  définir le code de réponse
         http_response_code(401);
         //  indique à l'utilisateur que la connexion a échoué
         echo json_encode(array("message" => "you are not an admin."));
         return false;
       }
     return true;

 }


 $t=time();
 echo($t . "<br>");
 echo $t - 1557237868;

 // echo(date("H",$t));
 // var_dump(generate_key(time(),uniqid()));
 // $time_key = generate_key(0,uniqid());
 //var_dump($time_key);
 function generate_key($time, $key){

   if($time == 0){
     $key = uniqid();
     $time = time();
   }else {

    $time = time() - $time;

     if ($time >= 300) {
       $key = uniqid();
       $time = time();
   }
 }
   return array($key,$time);

}
?>
