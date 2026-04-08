<?php
require_once 'config.php';
check_login();

// Add task
function add_task($user_id, $task, $date) {
    global $conn;
    
    $user_id = sanitize($user_id);
    $task = sanitize($task);
    $date = sanitize($date);
    
    $query = "INSERT INTO planner (user_id, task, date) VALUES ('$user_id', '$task', '$date')";
    return $conn->query($query);
}

// Get user tasks
function get_user_tasks($user_id) {
    global $conn;
    
    $user_id = sanitize($user_id);
    $query = "SELECT id, task, date, completed FROM planner WHERE user_id = '$user_id' ORDER BY date ASC";
    
    $result = $conn->query($query);
    return $result->fetch_all(MYSQLI_ASSOC);
}

// Mark task as completed
function mark_task_completed($task_id) {
    global $conn;
    
    $task_id = sanitize($task_id);
    $query = "UPDATE planner SET completed = TRUE WHERE id = '$task_id'";
    
    return $conn->query($query);
}

// Delete task
function delete_task($task_id) {
    global $conn;
    
    $task_id = sanitize($task_id);
    $query = "DELETE FROM planner WHERE id = '$task_id'";
    
    return $conn->query($query);
}
?>