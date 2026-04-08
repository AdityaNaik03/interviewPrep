<?php
require_once '../config.php';
require_once '../auth.php';

header('Content-Type: application/json');

$request_method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

// Read JSON input
$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, TRUE);

if ($request_method === 'POST') {
    if ($action === 'login') {
        $email = $input['email'] ?? '';
        $password = $input['password'] ?? '';
        
        $result = login_user($email, $password);
        
        echo json_encode($result);
        exit();
    }
    
    if ($action === 'register') {
        $name = $input['name'] ?? '';
        $email = $input['email'] ?? '';
        $password = $input['password'] ?? '';
        $confirm_password = $input['confirm_password'] ?? '';
        
        $result = register_user($name, $email, $password, $confirm_password);
        
        echo json_encode($result);
        exit();
    }
    
    if ($action === 'logout') {
        session_destroy();
        echo json_encode(['success' => true, 'message' => 'Logged out']);
        exit();
    }
}

if ($request_method === 'GET') {
    if ($action === 'session') {
        if (isset($_SESSION['user_id'])) {
            echo json_encode([
                'success' => true, 
                'user' => [
                    'id' => $_SESSION['user_id'],
                    'name' => $_SESSION['user_name'],
                    'email' => $_SESSION['user_email']
                ]
            ]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Not authenticated']);
        }
        exit();
    }
}

echo json_encode(['success' => false, 'message' => 'Invalid endpoint']);
?>
