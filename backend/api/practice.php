<?php
require_once '../config.php';
require_once '../practice.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Not authenticated']);
    exit();
}

$action = $_GET['action'] ?? '';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if ($action === 'subjects') {
        $subjects = get_all_subjects();
        echo json_encode(['success' => true, 'subjects' => $subjects]);
        exit();
    }
    
    if ($action === 'questions') {
        $subject_id = $_GET['subject_id'] ?? null;
        if ($subject_id) {
            $questions = get_practice_questions($subject_id);
            echo json_encode(['success' => true, 'questions' => $questions]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Subject ID is required']);
        }
        exit();
    }
}

echo json_encode(['success' => false, 'message' => 'Invalid endpoint']);
?>
