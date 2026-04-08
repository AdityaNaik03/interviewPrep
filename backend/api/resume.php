<?php
require_once '../config.php';
require_once '../ai_integration.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Not authenticated']);
    exit();
}

$user_id = $_SESSION['user_id'];
$request_method = $_SERVER['REQUEST_METHOD'];

if ($request_method === 'POST') {
    $inputJSON = file_get_contents('php://input');
    $input = json_decode($inputJSON, TRUE);
    
    $resume_text = $input['resume_text'] ?? '';
    
    if (empty($resume_text)) {
        echo json_encode(['success' => false, 'message' => 'Resume text is required']);
        exit();
    }
    
    // Analyze resume
    $analysis = analyze_resume($resume_text);
    
    // Save to database
    $safe_resume = sanitize($resume_text);
    $conn->query("INSERT INTO resumes (user_id, resume_text) VALUES ('$user_id', '$safe_resume') ON DUPLICATE KEY UPDATE resume_text = '$safe_resume', created_at = CURRENT_TIMESTAMP");
    
    echo json_encode([
        'success' => true,
        'analysis' => $analysis
    ]);
    exit();
}

echo json_encode(['success' => false, 'message' => 'Invalid endpoint']);
?>
