<?php
require_once '../config.php';
require_once '../planner.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Not authenticated']);
    exit();
}

$user_id = $_SESSION['user_id'];
$request_method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

if ($request_method === 'GET' && $action === 'tasks') {
    $tasks = get_user_tasks($user_id);
    echo json_encode(['success' => true, 'tasks' => $tasks]);
    exit();
}

if ($request_method === 'POST') {
    $inputJSON = file_get_contents('php://input');
    $input = json_decode($inputJSON, TRUE);
    
    if ($action === 'add') {
        $task = $input['task'] ?? '';
        $date = $input['date'] ?? '';
        
        if (empty($task) || empty($date)) {
            echo json_encode(['success' => false, 'message' => 'Task and date are required']);
            exit();
        }
        
        $result = add_task($user_id, $task, $date);
        echo json_encode(['success' => $result]);
        exit();
    }
    
    if ($action === 'complete') {
        $task_id = $input['task_id'] ?? '';
        $result = mark_task_completed($task_id);
        echo json_encode(['success' => $result]);
        exit();
    }
    
    if ($action === 'delete') {
        $task_id = $input['task_id'] ?? '';
        $result = delete_task($task_id);
        echo json_encode(['success' => $result]);
        exit();
    }
}

echo json_encode(['success' => false, 'message' => 'Invalid endpoint']);
?>
