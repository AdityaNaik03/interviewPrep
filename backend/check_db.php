<?php
require_once 'config.php';
$conn = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
$result = $conn->query("SHOW TABLES LIKE 'resumes'");
if ($result->num_rows > 0) {
    echo "Table 'resumes' exists.\n";
    $desc = $conn->query("DESCRIBE resumes");
    while($row = $desc->fetch_assoc()){
        print_r($row);
    }
} else {
    echo "Table 'resumes' does not exist.\n";
}
$conn->close();
?>
