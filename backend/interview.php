<?php
require_once 'config.php';
check_login();

// Get interview questions
function get_interview_questions($type, $limit = 1) {
    global $conn;
    $type = sanitize($type);
    $query = "SELECT id, question FROM questions WHERE type = '$type' ORDER BY RAND() LIMIT $limit";
    $result = $conn->query($query);
    return $result->fetch_all(MYSQLI_ASSOC);
}

// Save answer
function save_answer($user_id, $question_id, $answer, $score, $feedback) {
    global $conn;
    
    $user_id = sanitize($user_id);
    $question_id = sanitize($question_id);
    $answer = sanitize($answer);
    $score = sanitize($score);
    $feedback = sanitize($feedback);
    
    $query = "INSERT INTO answers (user_id, question_id, answer, score, feedback) VALUES ('$user_id', '$question_id', '$answer', '$score', '$feedback')";
    
    return $conn->query($query);
}

// Get user's average score
function get_average_score($user_id) {
    global $conn;
    
    $user_id = sanitize($user_id);
    $query = "SELECT AVG(score) as avg_score FROM answers WHERE user_id = '$user_id' AND score IS NOT NULL";
    
    $result = $conn->query($query);
    $data = $result->fetch_assoc();
    
    return round($data['avg_score'] ?? 0, 2);
}
?>