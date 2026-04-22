<?php
// ─────────────────────────────────────────────────────────────────────────────
//  Load environment variables from .env file (project root)
// ─────────────────────────────────────────────────────────────────────────────
function load_env(string $path): void {
    if (!file_exists($path)) return;

    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $line = trim($line);
        // Skip comments and blank lines
        if ($line === '' || str_starts_with($line, '#')) continue;

        if (strpos($line, '=') !== false) {
            [$key, $value] = explode('=', $line, 2);
            $key   = trim($key);
            $value = trim($value);
            // Strip surrounding quotes if present
            $value = trim($value, '"\'');
            // Only set if not already defined in the real environment
            if (!isset($_ENV[$key]) && !getenv($key)) {
                putenv("$key=$value");
                $_ENV[$key] = $value;
            }
        }
    }
}

// ─── Resolve the project root (.env lives two levels up from backend/config.php)
$env_path = dirname(__FILE__, 2) . '/.env';
load_env($env_path);

// ─── Database configuration ───────────────────────────────────────────────────
define('DB_HOST',     getenv('DB_HOST')     ?: 'localhost');
define('DB_USER',     getenv('DB_USER')     ?: 'root');
define('DB_PASSWORD', getenv('DB_PASSWORD') ?: '');
define('DB_NAME',     getenv('DB_NAME')     ?: 'smart_interview_prep');

// ─── AI / Gemini configuration ────────────────────────────────────────────────
define('AI_API_KEY', getenv('AI_API_KEY') ?: '');
define('AI_API_URL', getenv('AI_API_URL') ?: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent');

// ─── CORS headers for React/Vite communication ────────────────────────────────
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit();
}

// ─── Session ──────────────────────────────────────────────────────────────────
session_set_cookie_params(['samesite' => 'Lax']);
session_start();

// ─── Database connection ──────────────────────────────────────────────────────
$conn = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$conn->set_charset("utf8");

// ─── Helper functions ─────────────────────────────────────────────────────────
function sanitize($data): string {
    global $conn;
    return $conn->real_escape_string(trim($data));
}

function check_login(): void {
    if (!isset($_SESSION['user_id'])) {
        header("Location: ../public/login.php");
        exit();
    }
}

function get_user_info($user_id): ?array {
    global $conn;
    $query  = "SELECT * FROM users WHERE id = '$user_id'";
    $result = $conn->query($query);
    return $result ? $result->fetch_assoc() : null;
}
?>