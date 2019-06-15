<?php
require './test_jwt.php';

  if(!empty($_POST)){
      $payload = $user->create_user($_POST);
         if(validate_jwt($jwt,$key)){
           $product = new User($db);

           if($_POST['delete_product'] == 'true'){
             $deleted = $product->delete_product($_POST['product_id']);
             if($deleted){
               die("product successfully deleted");
             }
             else {
               die("product does not exist");
             }

           }

           $prod = $product->create_product($_POST);

           if ($prod) {
             echo "product created";
           }
           else {
             echo "product not registerd";
           }
           echo "wel verified";
         }
          else {
            die("an error has occurred");
            
          }
  }
 ?>
