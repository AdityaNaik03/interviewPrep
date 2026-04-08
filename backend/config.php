<?php
// Database configuration
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASSWORD', '');
define('DB_NAME', 'smart_interview_prep');

// API Configuration
define('AI_API_KEY', 'AIzaSyD198G4_850BdLTiWtnJDlIcwu98DC1dwo'); // <-- ADD YOUR GOOGLE GEMINI API KEY HERE
define('AI_API_URL', 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent');

// CORS Headers for React/Vite communication
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(); // Handle preflight requests
}

// Session start
session_set_cookie_params([
    'samesite' => 'Lax' // Allow cross-site cookies if same domain or local
]);
session_start();

// Create database connection
$conn = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Set charset
$conn->set_charset("utf8");

// Helper function to sanitize input
function sanitize($data) {
    global $conn;
    return $conn->real_escape_string(trim($data));
}

// Helper function to check if user is logged in
function check_login() {
    if (!isset($_SESSION['user_id'])) {
        header("Location: ../public/login.php");
        exit();
    }
}

// Helper function to get user info
function get_user_info($user_id) {
    global $conn;
    $query = "SELECT * FROM users WHERE id = '$user_id'";
    $result = $conn->query($query);
    return $result->fetch_assoc();
}
?>