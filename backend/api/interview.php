<?php
require_once '../config.php';
require_once '../interview.php';
require_once '../ai_integration.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Not authenticated']);
    exit();
}

$user_id = $_SESSION['user_id'];
$action = $_GET['action'] ?? '';
$request_method = $_SERVER['REQUEST_METHOD'];

if ($request_method === 'GET' && $action === 'questions') {
    $interview_type = $_GET['type'] ?? 'Technical';
    $valid_types = ['Technical', 'HR', 'Mock'];
    
    if (!in_array($interview_type, $valid_types)) {
        $interview_type = 'Technical';
    }
    
    // Try to get user's resume for better personalization
    $resume_text = null;
    $resume_res = $conn->query("SELECT resume_text FROM resumes WHERE user_id = '$user_id' LIMIT 1");
    if ($resume_res && $resume_res->num_rows > 0) {
        $resume_data = $resume_res->fetch_assoc();
        $resume_text = $resume_data['resume_text'];
    }

    // Generate AI questions
    $questions = generate_ai_questions($interview_type, $resume_text);
    
    // Fallback to database questions if AI fails
    if (!$questions || empty($questions)) {
        $questions = get_interview_questions($interview_type, 20);
    }
    
    if (empty($questions)) {
        echo json_encode(['success' => false, 'message' => 'No questions available']);
    } else {
        echo json_encode(['success' => true, 'questions' => $questions, 'personalized' => !empty($resume_text)]);
    }
    exit();
}

if ($request_method === 'POST' && $action === 'evaluate') {
    $inputJSON = file_get_contents('php://input');
    $input = json_decode($inputJSON, TRUE);
    
    $question_id = $input['question_id'] ?? '';
    $question_text = $input['question_text'] ?? '';
    $answer = $input['answer'] ?? '';
    
    if (empty($answer) || empty($question_text)) {
        echo json_encode(['success' => false, 'message' => 'Missing question or answer data']);
        exit();
    }
    
    // Evaluate via live AI endpoint
    $evaluation = evaluate_answer($question_text, $answer);
    
    // Save to database
    $save_result = save_answer($user_id, $question_id, $answer, $evaluation['score'], $evaluation['feedback']);
    
    echo json_encode([
        'success' => true,
        'score' => $evaluation['score'],
        'feedback' => $evaluation['feedback'],
        'saved' => $save_result
    ]);
    exit();
}

echo json_encode(['success' => false, 'message' => 'Invalid endpoint']);
?>
