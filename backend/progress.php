<?php
require_once 'config.php';
check_login();

// Get total interviews taken
function get_total_interviews($user_id) {
    global $conn;
    
    $user_id = sanitize($user_id);
    $query = "SELECT COUNT(*) as total FROM answers WHERE user_id = '$user_id'";
    
    $result = $conn->query($query);
    $data = $result->fetch_assoc();
    
    return $data['total'];
}

// Get interview count by type
function get_interviews_by_type($user_id) {
    global $conn;
    
    $user_id = sanitize($user_id);
    $query = "SELECT q.type, COUNT(*) as count, AVG(a.score) as avg_score FROM answers a JOIN questions q ON a.question_id = q.id WHERE a.user_id = '$user_id' GROUP BY q.type";
    
    $result = $conn->query($query);
    return $result->fetch_all(MYSQLI_ASSOC);
}

// Get performance summary
function get_performance_summary($user_id) {
    global $conn;
    
    $user_id = sanitize($user_id);
    
    $query = "SELECT COUNT(*) as total_answers, AVG(score) as avg_score, MAX(score) as max_score, MIN(score) as min_score FROM answers WHERE user_id = '$user_id' AND score IS NOT NULL";
    
    $result = $conn->query($query);
    return $result->fetch_assoc();
}
?>