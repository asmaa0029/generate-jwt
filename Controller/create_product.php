<?php
include_once './data_base.php';

// Obtenir la connexion à la base de données
$database = new Database();
$db = $database->getConnection();

class User{
  // La connexion à la base de données et le nom de la table
    private $conn;
    private $product_table = "products";
    private $user_table = "users";


    // object properties
    public $id;
    public $product_name;
    public $price;
    public $created;
    public $modified;
    public $user;
    public $role;

    // Constructeur
    public function __construct($db){
        $this->conn = $db;
        }
    public function set_product($produit){
      $this->price = $_POST['price'];
      $this->product_name = $_POST['product_name'];
    }
    // La méthode create()
    // créer un nouvel enregistrement d'utilisateur
    public function create_product($product){
      $this->set_product($product);
        // insérer une requête
        $query = "INSERT INTO " . $this->product_table . "
                SET
                    name = :name,
                    price = :price
                    cost = :cost";

        // préparer la requête
        $stmt = $this->conn->prepare($query);

        // désinfecter
        $this->name=htmlspecialchars(strip_tags($this->product_name));
        $this->price=htmlspecialchars(strip_tags($this->price));
        // lier les valeurs
        $stmt->bindParam(':name', $this->product_name);
        $stmt->bindParam(':price', $this->price);
        $stmt->bindParam(':cost', $this->cost);
        // Exécuter la requête, vérifier également si la requête a réussi
        if($stmt->execute()){
            return true;
        }

        return false;
    }

    function delete_product($id){
      $query ="DELETE FROM `products` WHERE id = $id";
      // $stmt = $this->conn->prepare("DELETE FROM `products` WHERE id = :id");
      // $query->bindValue(':id', $id);
      // var_dump($this->conn->exec($query));
      if($this->conn->exec($query)){
        return true;
      }
      return false;

    }

    function create_user($user_array){
      if(!empty($user_array)){
        $this->user = $user_array['username'];
        $this->id =   $user_array['user_id'];
        $this->role = $user_array['user_role'];
      }else{
        return ;
      }
          // insérer une requête
          $query = "INSERT INTO " . $this->user_table . "
                  SET
                      name = :name,

                      role = :role";

          // préparer la requête
          $stmt = $this->conn->prepare($query);

          // désinfecter
          // $this->user=htmlspecialchars(strip_tags($this->user));
          // $this->id=htmlspecialchars(strip_tags($this->id));
          // $this->role=htmlspecialchars(strip_tags($this->role));

          // lier les valeurs
          $stmt->bindParam(':name', $this->user);
          // $stmt->bindParam(':id', $this->id);
          $stmt->bindParam(':role', $this->role);
          // Exécuter la requête, vérifier également si la requête a réussi
          // var_dump($stmt->execute());
          if($stmt->execute()){

              $id = $this->conn->lastInsertId();

              $payload = array(
                'user_id'=>$id,
                'user_role' => $this->role
              );

              return $payload;
          }

          return false;

    }

}
?>
