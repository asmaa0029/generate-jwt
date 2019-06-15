<?php
// Pour obtenir la connexion à la base de données mysql
class Database{

    // Les informations d'identification de la base de données
    private $host = "localhost";
    private $db_name = "pfe_project";
    private $username = "root";
    private $password = "";
    public $conn;

    // la connexion à la base de données
    public function getConnection(){
    

        $this->conn = null;

        try{
            $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password);
        }catch(PDOException $exception){
            echo "Connection error: " . $exception->getMessage();
        }

        return $this->conn;
    }
}
?>
