<?php
require_once '../config.php';
require_once '../interview.php';
require_once '../progress.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Not authenticated']);
    exit();
}

$user_id = $_SESSION['user_id'];
$user_name = $_SESSION['user_name'];

$total_interviews = get_total_interviews($user_id);
$avg_score = get_average_score($user_id);
$performance = get_performance_summary($user_id);

echo json_encode([
    'success' => true,
    'data' => [
        'user_name' => $user_name,
        'total_interviews' => $total_interviews,
        'avg_score' => $avg_score,
        'best_score' => $performance['max_score'] ?? null,
        'total_answers' => $performance['total_answers'] ?? 0
    ]
]);
?>
