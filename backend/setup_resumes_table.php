<?php
require_once 'config.php';

// Check if modern "resumes" table exists, if not create it
$query = "CREATE TABLE IF NOT EXISTS resumes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    resume_text LONGTEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY (user_id)
)";

if ($conn->query($query)) {
    echo json_encode(['success' => true, 'message' => 'Resumes table is ready.']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error creating table: ' . $conn->error]);
}
?>
