<?php
require_once 'config.php';

// Register user
function register_user($name, $email, $password, $confirm_password) {
    global $conn;
    
    if (empty($name) || empty($email) || empty($password)) {
        return ['success' => false, 'message' => 'All fields are required'];
    }
    
    if ($password !== $confirm_password) {
        return ['success' => false, 'message' => 'Passwords do not match'];
    }
    
    if (strlen($password) < 6) {
        return ['success' => false, 'message' => 'Password must be at least 6 characters'];
    }
    
    $check_query = "SELECT id FROM users WHERE email = '" . sanitize($email) . "'";
    $check_result = $conn->query($check_query);
    
    if ($check_result->num_rows > 0) {
        return ['success' => false, 'message' => 'Email already registered'];
    }
    
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);
    $name = sanitize($name);
    $email = sanitize($email);
    
    $insert_query = "INSERT INTO users (name, email, password) VALUES ('$name', '$email', '$hashed_password')";
    
    if ($conn->query($insert_query)) {
        return ['success' => true, 'message' => 'Registration successful! Please login.'];
    } else {
        return ['success' => false, 'message' => 'Error: ' . $conn->error];
    }
}

// Login user
function login_user($email, $password) {
    global $conn;
    
    if (empty($email) || empty($password)) {
        return ['success' => false, 'message' => 'Email and password are required'];
    }
    
    $email = sanitize($email);
    $query = "SELECT id, name, password FROM users WHERE email = '$email'";
    $result = $conn->query($query);
    
    if ($result->num_rows === 0) {
        return ['success' => false, 'message' => 'Invalid email or password'];
    }
    
    $user = $result->fetch_assoc();
    
    if (!password_verify($password, $user['password'])) {
        return ['success' => false, 'message' => 'Invalid email or password'];
    }
    
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['user_name'] = $user['name'];
    $_SESSION['user_email'] = $email;
    
    return ['success' => true, 'message' => 'Login successful!'];
}

// Logout user
function logout_user() {
    session_destroy();
    header("Location: ../public/login.php");
    exit();
}
?>