<?php
require './connexion.php';

$GLOBALS['conx'];

$key = generate_key();
echo "<br> my key is ::: $key<br>";
function generate_key(){
    $conx = $GLOBALS['conx'];
    $key = uniqid();

    $query = $conx->query("SELECT * FROM `cles` ORDER BY `cles`.`generation` ASC");
    $keys=$query->fetchAll(PDO::FETCH_ASSOC);
    $key_time = strtotime(end($keys)["generation"]);
    $cle = $keys[0]["cle"];

    if(count($keys) < 3){ //!vérifier si la table est vide
          // ! inseer dans la base de données                 
           try {
                    $stmt = $conx->prepare("INSERT INTO `cles` (`cle`) VALUES (:cle)");
                    if ($stmt->execute(array(":cle" => $key))) {
                    echo 'welcome';
                    }

                  } catch (\Exception $e) {
                    echo "<br> Error on insertion" . $e->getMessage();
                  }
                }
    elseif (count($keys) >= 3 and (time() - $key_time >= 3600 )) { //! check if table is filled with all the 3 keys
      // $conx->query("delete row from cles where max(generation)");
      try {
        
        $stmt = "DELETE FROM cles WHERE `cle` = '$cle'";
   
        if($conx->exec($stmt)){
          echo "deleted";
          $stmt = $conx->prepare("INSERT INTO `cles` (`cle`) VALUES (:cle)");
          $stmt->execute(array(":cle" => $key));

        }


      } catch (\Throwable $th) {
        //throw $th;
        echo "erreur de suppression".$th;
      }

    }
    
    else{
      $key=$keys[2]["cle"];
    }
          return $key;

}

?>



