<?php
require_once 'config.php';
check_login();

// Get all subjects
function get_all_subjects() {
    global $conn;
    $query = "SELECT id, name FROM subjects";
    $result = $conn->query($query);
    return $result->fetch_all(MYSQLI_ASSOC);
}

// Get practice questions by subject
function get_practice_questions($subject_id) {
    global $conn;
    
    $subject_id = sanitize($subject_id);
    $query = "SELECT id, question, answer FROM practice_questions WHERE subject_id = '$subject_id'";
    
    $result = $conn->query($query);
    return $result->fetch_all(MYSQLI_ASSOC);
}

// Get specific practice question
function get_practice_question($question_id) {
    global $conn;
    
    $question_id = sanitize($question_id);
    $query = "SELECT id, question, answer FROM practice_questions WHERE id = '$question_id'";
    
    $result = $conn->query($query);
    return $result->fetch_assoc();
}
?>