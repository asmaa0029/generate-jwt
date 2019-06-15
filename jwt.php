<?php
// include_once './connexion.php'
 function JWT($head=array("alg"=>"sha256","typ"=>"JWT"),$payload=[],$key,$valid){
          $head64 = base64_encode(json_encode($head));
          $payload['expire'] = time() + $valid; //!valid = 3600  i.e. t1=time() = 15hr -> expir = 15 + 1 = 16
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
     
     if($payload['expire'] < time()){ //! time() = 15 pas execution, mais time() = 17 --> executin
       http_response_code(403);
         //  indique à l'utilisateur que la connexion a échoué
       echo json_encode(array("message" => "jwt expired"));
       return false;
     }     
   return $payload;
  
 }

?>
