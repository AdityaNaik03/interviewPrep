<?php
require_once '../config.php';
require_once '../progress.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Not authenticated']);
    exit();
}

$user_id = $_SESSION['user_id'];
$request_method = $_SERVER['REQUEST_METHOD'];

if ($request_method === 'GET') {
    $interviews_by_type = get_interviews_by_type($user_id);
    $performance = get_performance_summary($user_id);
    
    echo json_encode([
        'success' => true,
        'by_type' => $interviews_by_type,
        'performance' => $performance
    ]);
    exit();
}

echo json_encode(['success' => false, 'message' => 'Invalid endpoint']);
?>
