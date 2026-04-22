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

if ($request_method === 'GET') {
    // Fetch user's performance breakdown by interview type
    $user_id_safe = $conn->real_escape_string($user_id);
    $query = "SELECT q.type, COUNT(*) as count, AVG(a.score) as avg_score, MAX(a.score) as max_score, MIN(a.score) as min_score
              FROM answers a
              JOIN questions q ON a.question_id = q.id
              WHERE a.user_id = '$user_id_safe' AND a.score IS NOT NULL
              GROUP BY q.type";

    $result = $conn->query($query);
    $score_summary = $result ? $result->fetch_all(MYSQLI_ASSOC) : [];

    if (empty($score_summary)) {
        // No interview data yet — return a prompt to complete an interview first
        echo json_encode([
            'success' => false,
            'no_data' => true,
            'message' => 'No interview data found. Please complete at least one interview to generate a personalized study plan.'
        ]);
        exit();
    }

    // Generate study plan using AI (with fallback)
    $study_plan = generate_study_plan($score_summary);

    echo json_encode([
        'success' => true,
        'score_summary' => $score_summary,
        'study_plan' => $study_plan
    ]);
    exit();
}

echo json_encode(['success' => false, 'message' => 'Invalid endpoint']);
?>
