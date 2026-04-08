-- Create database
CREATE DATABASE IF NOT EXISTS smart_interview_prep;
USE smart_interview_prep;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Questions table
CREATE TABLE IF NOT EXISTS questions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  type ENUM('Technical', 'HR', 'Mock') NOT NULL,
  question TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Answers table
CREATE TABLE IF NOT EXISTS answers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  question_id INT NOT NULL,
  answer TEXT NOT NULL,
  score INT,
  feedback TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (question_id) REFERENCES questions(id)
);

-- Subjects table
CREATE TABLE IF NOT EXISTS subjects (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Practice questions table
CREATE TABLE IF NOT EXISTS practice_questions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  subject_id INT NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (subject_id) REFERENCES subjects(id)
);

-- Study planner table
CREATE TABLE IF NOT EXISTS planner (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  task VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Insert sample subjects
INSERT INTO subjects (name) VALUES 
('Machine Learning'),
('DevOps'),
('DBMS'),
('Web Development');

-- Insert sample technical questions
INSERT INTO questions (type, question) VALUES
('Technical', 'What is the difference between supervised and unsupervised learning?'),
('Technical', 'Explain the concept of Docker containers.'),
('Technical', 'What is normalization in databases?'),
('Technical', 'How does REST API work?'),
('Technical', 'What are microservices?'),
('Technical', 'Explain the CI/CD pipeline.'),
('Technical', 'What is machine learning and its types?'),
('Technical', 'How do you implement authentication in web applications?'),
('Technical', 'What is database indexing?'),
('Technical', 'Explain the concept of load balancing.'),
('Technical', 'What is API rate limiting?'),
('Technical', 'How does caching work in web applications?'),
('Technical', 'What is the difference between SQL and NoSQL?'),
('Technical', 'Explain the concept of containerization.'),
('Technical', 'What is vertical and horizontal scaling?'),
('Technical', 'How do you handle database transactions?'),
('Technical', 'What is the difference between GET and POST requests?'),
('Technical', 'Explain the concept of cloud computing.'),
('Technical', 'What is the role of a reverse proxy?'),
('Technical', 'How does data encryption work?');

-- Insert sample HR questions
INSERT INTO questions (type, question) VALUES
('HR', 'Tell me about yourself.'),
('HR', 'What are your strengths and weaknesses?'),
('HR', 'Why do you want to work for our company?'),
('HR', 'How do you handle stress and pressure at work?'),
('HR', 'Describe a challenging situation you faced and how you overcame it.'),
('HR', 'What are your career goals for the next 5 years?'),
('HR', 'How do you work in a team environment?'),
('HR', 'Give an example of when you showed leadership.'),
('HR', 'How do you stay updated with industry trends?'),
('HR', 'What is your expected salary range?'),
('HR', 'How do you prioritize your tasks?'),
('HR', 'Describe your experience with agile methodologies.'),
('HR', 'How do you handle feedback from colleagues?'),
('HR', 'What motivates you in your work?'),
('HR', 'How do you approach learning new technologies?'),
('HR', 'Tell me about a project you are proud of.'),
('HR', 'How do you manage work-life balance?'),
('HR', 'What is your biggest professional achievement?'),
('HR', 'How do you collaborate with cross-functional teams?'),
('HR', 'Why should we hire you for this position?');

-- Insert sample mock questions
INSERT INTO questions (type, question) VALUES
('Mock', 'What is your understanding of artificial intelligence?'),
('Mock', 'How would you design a scalable web application?'),
('Mock', 'Explain the difference between authentication and authorization.'),
('Mock', 'What strategies would you use to optimize database performance?'),
('Mock', 'How do you approach system design problems?'),
('Mock', 'What is your experience with version control systems?'),
('Mock', 'How would you debug a production issue?'),
('Mock', 'Explain the concept of webhooks.'),
('Mock', 'What is your approach to code review?'),
('Mock', 'How do you ensure code quality in your projects?'),
('Mock', 'What is the difference between monolithic and microservices architecture?'),
('Mock', 'How would you handle real-time notifications in an application?'),
('Mock', 'What is your experience with containerization tools?'),
('Mock', 'Explain the concept of eventual consistency.'),
('Mock', 'How do you approach solving complex algorithmic problems?'),
('Mock', 'What is your experience with monitoring and logging?'),
('Mock', 'How would you secure an API endpoint?'),
('Mock', 'Explain the CAP theorem.'),
('Mock', 'What is your approach to performance optimization?'),
('Mock', 'How do you handle cross-browser compatibility issues?');

-- Insert sample practice questions for Machine Learning
INSERT INTO practice_questions (subject_id, question, answer) VALUES
(1, 'What is overfitting in machine learning?', 'Overfitting occurs when a model learns the training data too well, including its noise and peculiarities, resulting in poor performance on new, unseen data.'),
(1, 'Explain the difference between classification and regression.', 'Classification is used to predict discrete categories (e.g., spam/not spam), while regression is used to predict continuous numerical values (e.g., house prices).'),
(1, 'What is cross-validation and why is it important?', 'Cross-validation is a technique to evaluate machine learning models by dividing data into subsets. It helps assess model generalization and reduces the impact of data partitioning.'),
(1, 'What are the main types of machine learning algorithms?', 'Main types are: Supervised Learning (Classification, Regression), Unsupervised Learning (Clustering, Dimensionality Reduction), and Reinforcement Learning.'),
(1, 'Explain the concept of feature scaling.', 'Feature scaling involves normalizing or standardizing features to bring them to a similar scale, which helps improve model training efficiency.');

-- Insert sample practice questions for DevOps
INSERT INTO practice_questions (subject_id, question, answer) VALUES
(2, 'What is Infrastructure as Code (IaC)?', 'IaC is the practice of managing infrastructure through machine-readable configuration files rather than manual processes.'),
(2, 'Explain the difference between Docker and Virtual Machines.', 'Docker containers are lightweight and share the host OS kernel, while VMs include a full OS. Containers are faster to start and more efficient.'),
(2, 'What is Kubernetes and its main features?', 'Kubernetes is an orchestration platform for containerized applications. Key features include auto-scaling, self-healing, load balancing, and rolling updates.'),
(2, 'Describe the CI/CD pipeline.', 'CI/CD pipeline automates code integration, testing, and deployment. CI detects issues early, CD automates release to production.'),
(2, 'What is monitoring and logging in DevOps?', 'Monitoring tracks system performance and health, while logging records events. Both are essential for troubleshooting and optimization.');

-- Insert sample practice questions for DBMS
INSERT INTO practice_questions (subject_id, question, answer) VALUES
(3, 'What is database normalization?', 'Normalization is the process of organizing data to reduce redundancy and improve data integrity through a series of normal forms (1NF, 2NF, 3NF, etc.).'),
(3, 'Explain ACID properties in databases.', 'ACID stands for Atomicity, Consistency, Isolation, and Durability—essential properties ensuring reliable database transactions.'),
(3, 'What is the difference between primary key and foreign key?', 'Primary key uniquely identifies a record in a table, while foreign key links records in one table to another, maintaining referential integrity.'),
(3, 'What are indexes and how do they improve performance?', 'Indexes are data structures that speed up data retrieval. They work like book indexes, allowing queries to find data without scanning entire tables.'),
(3, 'Explain the difference between SQL and NoSQL databases.', 'SQL is relational with structured schema, while NoSQL is non-relational with flexible schema, suitable for unstructured data.');

-- Insert sample practice questions for Web Development
INSERT INTO practice_questions (subject_id, question, answer) VALUES
(4, 'What is responsive web design?', 'Responsive design makes websites work well on all devices by using flexible layouts, media queries, and flexible images.'),
(4, 'Explain the difference between frontend and backend.', 'Frontend is the user interface (HTML, CSS, JavaScript), while backend handles server logic, databases, and APIs.'),
(4, 'What are HTTP status codes?', 'HTTP status codes indicate the result of HTTP requests: 1xx (informational), 2xx (success), 3xx (redirection), 4xx (client error), 5xx (server error).'),
(4, 'Explain the concept of REST API.', 'REST API uses HTTP methods (GET, POST, PUT, DELETE) to perform operations on resources identified by URLs, following REST architectural principles.'),
(4, 'What is CSS Grid and Flexbox?', 'Flexbox is for one-dimensional layouts, while CSS Grid is for two-dimensional layouts. Both provide flexible ways to arrange elements.');