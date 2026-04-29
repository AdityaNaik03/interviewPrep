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

-- Additional 45 questions for Machine Learning (subject_id 1)
INSERT INTO practice_questions (subject_id, question, answer) VALUES
(1, 'What is the Bias-Variance tradeoff?', 'It is the conflict in trying to simultaneously minimize two sources of error that prevent supervised learning algorithms from generalizing beyond their training set: bias (error from erroneous assumptions) and variance (error from sensitivity to small fluctuations).'),
(1, 'Explain Gradient Descent.', 'An iterative optimization algorithm used to minimize a function by moving in the direction of steepest descent as defined by the negative of the gradient.'),
(1, 'What is a Random Forest?', 'An ensemble learning method that operates by constructing a multitude of decision trees at training time and outputting the class that is the mode of the classes or mean prediction of the individual trees.'),
(1, 'What is Regularization in ML?', 'A technique used to prevent overfitting by adding a penalty term to the cost function, discouraging complex models.'),
(1, 'What is a Confusion Matrix?', 'A table used to describe the performance of a classification model on a set of test data for which the true values are known.'),
(1, 'Explain Precision and Recall.', 'Precision is the ratio of correctly predicted positive observations to the total predicted positives. Recall is the ratio of correctly predicted positive observations to all actual positives.'),
(1, 'What is an F1 Score?', 'The weighted average of Precision and Recall, useful when you have an uneven class distribution.'),
(1, 'What is Principal Component Analysis (PCA)?', 'A dimensionality-reduction method that is often used to reduce the dimensionality of large data sets, by transforming a large set of variables into a smaller one that still contains most of the information.'),
(1, 'What is K-Nearest Neighbors (KNN)?', 'A simple, instance-based learning algorithm that classifies a data point based on how its neighbors are classified.'),
(1, 'What is K-Means Clustering?', 'An unsupervised learning algorithm that groups similar data points into K clusters based on their features.'),
(1, 'Explain Support Vector Machines (SVM).', 'A supervised learning model that finds the hyperplane that best divides a dataset into classes.'),
(1, 'What is a Neural Network?', 'A series of algorithms that endeavors to recognize underlying relationships in a set of data through a process that mimics the way the human brain operates.'),
(1, 'What is Deep Learning?', 'A subfield of machine learning based on artificial neural networks with multiple layers (deep networks).'),
(1, 'What is Natural Language Processing (NLP)?', 'A branch of AI that deals with the interaction between computers and humans using natural language.'),
(1, 'What is Reinforcement Learning?', 'A type of machine learning where an agent learns to behave in an environment by performing actions and seeing the results.'),
(1, 'What is a Decision Tree?', 'A flowchart-like structure in which each internal node represents a "test" on an attribute, each branch represents the outcome of the test, and each leaf node represents a class label.'),
(1, 'What is Naive Bayes?', 'A family of simple probabilistic classifiers based on applying Bayes'' theorem with strong independence assumptions between the features.'),
(1, 'Explain Cross-Entropy Loss.', 'A loss function used to measure the performance of a classification model whose output is a probability value between 0 and 1.'),
(1, 'What is Data Augmentation?', 'A technique used to increase the amount of data by adding slightly modified copies of already existing data or newly created synthetic data from existing data.'),
(1, 'What is Transfer Learning?', 'A machine learning method where a model developed for a task is reused as the starting point for a model on a second task.'),
(1, 'What is the difference between L1 and L2 regularization?', 'L1 regularization adds the absolute value of magnitude of coefficient as penalty term (can lead to sparse features), while L2 adds squared magnitude (tends to spread error among all terms).'),
(1, 'What is an Optimizer in Deep Learning?', 'Algorithms used to change the attributes of the neural network such as weights and learning rate to reduce the losses.'),
(1, 'Explain the concept of Batch Normalization.', 'A technique for improving the speed, performance, and stability of artificial neural networks by normalizing the inputs of each layer.'),
(1, 'What is Dropout in Neural Networks?', 'A regularization technique where randomly selected neurons are ignored during training, helping prevent overfitting.'),
(1, 'What is an Activation Function?', 'A mathematical gate in a neural network that determines whether a neuron should be activated or not.'),
(1, 'Explain the ReLU activation function.', 'Rectified Linear Unit (ReLU) is an activation function that outputs the input directly if it is positive, otherwise, it outputs zero.'),
(1, 'What is a Convolutional Neural Network (CNN)?', 'A class of deep neural networks, most commonly applied to analyzing visual imagery.'),
(1, 'What is a Recurrent Neural Network (RNN)?', 'A type of artificial neural network which uses sequential data or time series data.'),
(1, 'What is Long Short-Term Memory (LSTM)?', 'An artificial recurrent neural network architecture used in deep learning that can learn long-term dependencies.'),
(1, 'What is a Generative Adversarial Network (GAN)?', 'A class of machine learning frameworks where two neural networks contest with each other in a game.'),
(1, 'Explain the concept of Word Embeddings.', 'A type of word representation that allows words with similar meaning to have a similar representation in a vector space.'),
(1, 'What is the difference between a parameter and a hyperparameter?', 'Parameters are learned from the data during training, while hyperparameters are set manually before training starts.'),
(1, 'What is Hyperparameter Tuning?', 'The process of choosing a set of optimal hyperparameters for a learning algorithm.'),
(1, 'Explain Gradient Vanishing problem.', 'A problem in training deep neural networks where the gradients of the loss function approach zero, making the network hard to train.'),
(1, 'Explain Gradient Exploding problem.', 'A problem where large error gradients accumulate and result in very large updates to neural network model weights during training.'),
(1, 'What is an Autoencoder?', 'A type of artificial neural network used to learn efficient data codings in an unsupervised manner.'),
(1, 'What is the purpose of a Validation Set?', 'To provide an unbiased evaluation of a model fit on the training dataset while tuning model hyperparameters.'),
(1, 'Explain the term "Ensemble Learning".', 'The process by which multiple models, such as classifiers or experts, are strategically generated and combined to solve a particular computational intelligence problem.'),
(1, 'What is Bagging?', 'Bootstrap Aggregating, an ensemble meta-algorithm designed to improve the stability and accuracy of machine learning algorithms.'),
(1, 'What is Boosting?', 'An ensemble meta-algorithm for primarily reducing bias and variance in supervised learning, and a family of machine learning algorithms that convert weak learners to strong ones.'),
(1, 'What is XGBoost?', 'An optimized distributed gradient boosting library designed to be highly efficient, flexible and portable.'),
(1, 'What is the ROC Curve?', 'Receiver Operating Characteristic curve, a graph showing the performance of a classification model at all classification thresholds.'),
(1, 'What is AUC?', 'Area Under the ROC Curve, provides an aggregate measure of performance across all possible classification thresholds.'),
(1, 'Explain the concept of Cold Start problem in Recommender Systems.', 'A problem that occurs when the system cannot draw any inferences for users or items about which it has not yet gathered sufficient information.'),
(1, 'What is Collaborative Filtering?', 'A method of making automatic predictions about the interests of a user by collecting preferences from many users.');

-- Additional 45 questions for DevOps (subject_id 2)
INSERT INTO practice_questions (subject_id, question, answer) VALUES
(2, 'What is the main goal of DevOps?', 'To shorten the systems development life cycle and provide continuous delivery with high software quality.'),
(2, 'What is "Shift Left" in DevOps?', 'The practice of moving testing, security, and performance evaluation to earlier stages in the development process.'),
(2, 'Explain the difference between Continuous Integration and Continuous Deployment.', 'CI is the practice of merging all developer working copies to a shared mainline several times a day. CD is the practice of automatically deploying every change that passes the automated tests to production.'),
(2, 'What is a Blue-Green Deployment?', 'A deployment strategy that utilizes two identical production environments, only one of which serves live traffic at any time.'),
(2, 'What is Canary Deployment?', 'A pattern for rolling out releases to a subset of users or servers to test the stability before full rollout.'),
(2, 'What is GitOps?', 'An operational framework that takes DevOps best practices used for application development and applies them to infrastructure automation.'),
(2, 'Explain the concept of "Infrastructure as Code" (IaC) tools.', 'Tools like Terraform or CloudFormation that allow you to define and manage infrastructure using configuration files.'),
(2, 'What is Configuration Management?', 'The process of maintaining software and systems in a known, consistent state.'),
(2, 'What is Ansible?', 'An open-source automation tool used for configuration management, application deployment, and task automation.'),
(2, 'What is Terraform?', 'An open-source infrastructure as code software tool that provides a consistent CLI workflow to manage hundreds of cloud services.'),
(2, 'What is Docker Compose?', 'A tool for defining and running multi-container Docker applications.'),
(2, 'What is a Dockerfile?', 'A text document that contains all the commands a user could call on the command line to assemble an image.'),
(2, 'Explain the concept of Microservices.', 'An architectural style that structures an application as a collection of services that are highly maintainable and testable, loosely coupled, and independently deployable.'),
(2, 'What is Serverless Computing?', 'A cloud computing execution model in which the cloud provider allocates machine resources on demand, taking care of the servers on behalf of their customers.'),
(2, 'What is Jenkins?', 'An open-source automation server that helps automate the parts of software development related to building, testing, and deploying.'),
(2, 'What is a CI/CD Pipeline?', 'A series of automated steps that take code from a version control system to a production environment.'),
(2, 'Explain the concept of "Immutable Infrastructure".', 'An approach where infrastructure components are replaced rather than modified.'),
(2, 'What is Prometheus?', 'An open-source systems monitoring and alerting toolkit.'),
(2, 'What is Grafana?', 'A multi-platform open-source analytics and interactive visualization web application.'),
(2, 'What is ELK Stack?', 'A collection of three open-source products—Elasticsearch, Logstash, and Kibana—used for log management and analytics.'),
(2, 'What is SRE (Site Reliability Engineering)?', 'A discipline that incorporates aspects of software engineering and applies them to infrastructure and operations problems.'),
(2, 'Explain the role of a Load Balancer.', 'A device that acts as a reverse proxy and distributes network or application traffic across a number of servers.'),
(2, 'What is a Reverse Proxy?', 'A type of proxy server that retrieves resources on behalf of a client from one or more servers.'),
(2, 'What is a Container Registry?', 'A repository for storing and managing container images.'),
(2, 'What is Helm in Kubernetes?', 'A package manager for Kubernetes that helps you manage Kubernetes applications.'),
(2, 'Explain "Self-Healing" in Kubernetes.', 'The ability of Kubernetes to automatically restart containers that fail, replace and reschedule containers when nodes die, and kill containers that don''t respond to user-defined health checks.'),
(2, 'What is a Service Mesh?', 'A dedicated infrastructure layer for facilitating service-to-service communications between services or microservices, often using a sidecar proxy.'),
(2, 'What is Istio?', 'An open-source service mesh that provides a uniform way to connect, secure, and monitor microservices.'),
(2, 'What is Chaos Engineering?', 'The discipline of experimenting on a software system in production in order to build confidence in the system''s capability to withstand turbulent and unexpected conditions.'),
(2, 'What is a Webhook?', 'A way for an app to provide other applications with real-time information.'),
(2, 'Explain the concept of "Dark Launches".', 'The process of releasing features to a subset of users before a full release, often without those users knowing.'),
(2, 'What is "Everything as Code" (EaC)?', 'The concept of treating all parts of the system as code, including infrastructure, security, and documentation.'),
(2, 'What is the purpose of a Bastion Host?', 'A special-purpose computer on a network specifically designed and configured to withstand attacks, used as a secure entry point to a private network.'),
(2, 'What is Zero Downtime Deployment?', 'A deployment process where the application is updated without any interruption to the service.'),
(2, 'Explain the "Twelve-Factor App" methodology.', 'A methodology for building software-as-a-service applications that are robust and scalable.'),
(2, 'What is an Artifact in DevOps?', 'A file that is produced during the software development process, such as a compiled binary or a container image.'),
(2, 'What is "Configuration Drift"?', 'The phenomenon where servers in an infrastructure environment become different over time due to manual changes or updates.'),
(2, 'What is "Blameless Post-Mortem"?', 'A practice in SRE where a team investigates an incident without focusing on who made a mistake, but rather on what system failures allowed the mistake to happen.'),
(2, 'What is a Health Check?', 'A mechanism used by monitoring systems to determine if a service is running correctly.'),
(2, 'Explain "Infrastructure as Code" vs "Configuration as Code".', 'IaC focuses on the provisioning of infrastructure resources, while CaC focuses on the configuration of those resources.'),
(2, 'What is a "Pipeline as Code"?', 'The practice of defining your CI/CD pipelines using code, often in a YAML or Groovy file.'),
(2, 'What is "Continuous Security" (DevSecOps)?', 'The practice of integrating security early and throughout the entire DevOps lifecycle.'),
(2, 'Explain the role of "Version Control" in DevOps.', 'It allows teams to track changes to code and configuration, collaborate effectively, and revert to previous states if needed.'),
(2, 'What is "Trunk-Based Development"?', 'A version control strategy where developers merge small, frequent updates to a single branch called "trunk" or "main".'),
(2, 'What is a "Build Server"?', 'A centralized server used to compile code and run automated tests.');

-- Additional 45 questions for DBMS (subject_id 3)
INSERT INTO practice_questions (subject_id, question, answer) VALUES
(3, 'What is a Database Management System (DBMS)?', 'A software system that enables users to define, create, maintain, and control access to the database.'),
(3, 'Explain the difference between a database and a DBMS.', 'A database is an organized collection of data, while a DBMS is the software used to manage that data.'),
(3, 'What is a Relational Database Management System (RDBMS)?', 'A DBMS based on the relational model, where data is organized into tables.'),
(3, 'What is a SQL Schema?', 'A collection of logical structures of data, such as tables, views, and indexes, owned by a database user.'),
(3, 'Explain the concept of "Data Integrity".', 'The accuracy, completeness, and consistency of data over its entire life cycle.'),
(3, 'What is a Primary Key?', 'A column or group of columns that uniquely identifies each row in a table.'),
(3, 'What is a Foreign Key?', 'A column or group of columns that provides a link between data in two tables.'),
(3, 'What is a Unique Key?', 'A constraint that ensures all values in a column are unique, but unlike a primary key, it can allow for a NULL value.'),
(3, 'Explain the difference between DELETE and TRUNCATE.', 'DELETE is a DML command used to remove specific rows, while TRUNCATE is a DDL command used to remove all rows from a table and cannot be rolled back in some systems.'),
(3, 'What is a Database Index?', 'A data structure that improves the speed of data retrieval operations on a database table.'),
(3, 'Explain the difference between a Clustered and a Non-Clustered Index.', 'A clustered index determines the physical order of data in a table, while a non-clustered index is a separate structure from the data.'),
(3, 'What is a Database View?', 'A virtual table based on the result-set of an SQL statement.'),
(3, 'What is a Stored Procedure?', 'A prepared SQL code that you can save and reuse over and over again.'),
(3, 'What is a Database Trigger?', 'A special type of stored procedure that automatically runs when an event occurs in the database server.'),
(3, 'Explain the concept of "Database Normalization".', 'The process of structuring a relational database to reduce data redundancy and improve data integrity.'),
(3, 'What is 1NF (First Normal Form)?', 'A property of a relation in a relational database where the domain of each attribute contains only atomic values.'),
(3, 'What is 2NF (Second Normal Form)?', 'A relation is in 2NF if it is in 1NF and every non-prime attribute is fully functionally dependent on the primary key.'),
(3, 'What is 3NF (Third Normal Form)?', 'A relation is in 3NF if it is in 2NF and there are no transitive functional dependencies.'),
(3, 'What is BCNF (Boyce-Codd Normal Form)?', 'A stronger version of 3NF used to address anomalies that 3NF cannot handle.'),
(3, 'Explain the concept of "Database Denormalization".', 'The process of adding redundant data to a database to improve read performance.'),
(3, 'What is a Database Transaction?', 'A logical unit of work that contains one or more SQL statements.'),
(3, 'Explain the ACID properties.', 'Atomicity, Consistency, Isolation, and Durability—properties that guarantee database transactions are processed reliably.'),
(3, 'What is "Data Redundancy"?', 'The existence of data that is additional to the actual data and permits correction of errors in stored or transmitted data.'),
(3, 'What is a Join in SQL?', 'An operation used to combine rows from two or more tables based on a related column between them.'),
(3, 'Explain INNER JOIN.', 'Returns records that have matching values in both tables.'),
(3, 'Explain LEFT JOIN.', 'Returns all records from the left table, and the matched records from the right table.'),
(3, 'Explain RIGHT JOIN.', 'Returns all records from the right table, and the matched records from the left table.'),
(3, 'Explain FULL JOIN.', 'Returns all records when there is a match in either left or right table.'),
(3, 'What is a Self Join?', 'A regular join, but the table is joined with itself.'),
(3, 'What is a Cross Join?', 'Returns the Cartesian product of the two tables.'),
(3, 'Explain the "Group By" clause.', 'Used to arrange identical data into groups.'),
(3, 'Explain the "Having" clause.', 'Used to filter groups based on a condition, often used with aggregate functions.'),
(3, 'What are Aggregate Functions in SQL?', 'Functions that perform a calculation on a set of values and return a single value, such as SUM, AVG, COUNT, MIN, and MAX.'),
(3, 'What is "Database Concurrency Control"?', 'A mechanism used to manage simultaneous access to a database by multiple users.'),
(3, 'Explain the concept of "Locking" in databases.', 'A mechanism used to prevent multiple users from modifying the same data at the same time.'),
(3, 'What is a "Deadlock"?', 'A situation where two or more transactions are waiting for each other to release locks, resulting in a stalemate.'),
(3, 'What is "Database Sharding"?', 'A type of horizontal partitioning that splits a large database into smaller, faster, more easily managed parts called shards.'),
(3, 'What is "Database Replication"?', 'The process of copying data from one database to another.'),
(3, 'Explain the difference between SQL and NoSQL databases.', 'SQL databases are relational and use a structured schema, while NoSQL databases are non-relational and can use a flexible schema.'),
(3, 'What is a Document-Oriented Database?', 'A type of NoSQL database that stores data in document formats like JSON or XML.'),
(3, 'What is a Key-Value Store?', 'A simple type of NoSQL database that uses a key to uniquely identify a value.'),
(3, 'What is a Graph Database?', 'A type of NoSQL database that uses graph structures for semantic queries with nodes, edges, and properties.'),
(3, 'What is a Column-Family Store?', 'A type of NoSQL database that stores data in columns rather than rows.'),
(3, 'Explain the concept of "Database Backups".', 'The process of creating a copy of the data in a database to protect against data loss.'),
(3, 'What is "Data Warehousing"?', 'The process of collecting and managing data from varied sources to provide meaningful business insights.');

-- Additional 45 questions for Web Development (subject_id 4)
INSERT INTO practice_questions (subject_id, question, answer) VALUES
(4, 'What is HTML5?', 'The latest version of the Hypertext Markup Language, used for structuring and presenting content on the World Wide Web.'),
(4, 'What is CSS3?', 'The latest evolution of the Cascading Style Sheets language used for styling web pages.'),
(4, 'Explain the difference between HTML and CSS.', 'HTML is used for structuring content, while CSS is used for styling and layout.'),
(4, 'What is JavaScript?', 'A high-level, interpreted programming language that is a core technology of the World Wide Web, used for creating interactive web pages.'),
(4, 'What is DOM (Document Object Model)?', 'A programming interface for web documents that represents the page so that programs can change the document structure, style, and content.'),
(4, 'What is AJAX?', 'Asynchronous JavaScript and XML, a set of web development techniques used to create asynchronous web applications.'),
(4, 'What is JSON?', 'JavaScript Object Notation, a lightweight data-interchange format that is easy for humans to read and write and easy for machines to parse and generate.'),
(4, 'What is a Responsive Web Design?', 'An approach to web design that makes web pages render well on a variety of devices and window or screen sizes.'),
(4, 'Explain the concept of "Mobile-First Design".', 'An approach to web design where you start designing for the smallest screen first and then work your way up to larger screens.'),
(4, 'What is a CSS Framework?', 'A pre-prepared library that is meant to allow for easier, more standards-compliant web design using the Cascading Style Sheets language.'),
(4, 'What is Bootstrap?', 'A free and open-source CSS framework directed at responsive, mobile-first front-end web development.'),
(4, 'What is a JavaScript Framework?', 'An application framework written in JavaScript where the programmers can manipulate the functions and use them for their convenience.'),
(4, 'What is React.js?', 'A free and open-source front-end JavaScript library for building user interfaces based on UI components.'),
(4, 'What is Angular?', 'A TypeScript-based open-source web application framework led by the Angular Team at Google.'),
(4, 'What is Vue.js?', 'An open-source model–view–viewmodel front-end JavaScript framework for building user interfaces and single-page applications.'),
(4, 'What is a Single Page Application (SPA)?', 'A web application or website that interacts with the user by dynamically rewriting the current web page with new data from the web server, instead of the default method of a browser loading entire new pages.'),
(4, 'What is a Progressive Web App (PWA)?', 'A type of application software delivered through the web, built using common web technologies including HTML, CSS, and JavaScript.'),
(4, 'What is the difference between Frontend and Backend development?', 'Frontend development focuses on the user-facing part of a website, while backend development focuses on the server-side logic and database.'),
(4, 'What is Node.js?', 'An open-source, cross-platform, JavaScript runtime environment that executes JavaScript code outside a web browser.'),
(4, 'What is an API (Application Programming Interface)?', 'A set of rules and protocols that allows different software applications to communicate with each other.'),
(4, 'What is a REST API?', 'An architectural style for an application program interface (API) that uses HTTP requests to access and use data.'),
(4, 'What is GraphQL?', 'A query language for APIs and a runtime for fulfilling those queries with your existing data.'),
(4, 'What is the difference between HTTP and HTTPS?', 'HTTPS is a secure version of HTTP, using SSL/TLS encryption to protect data in transit.'),
(4, 'What is a Web Server?', 'A computer system that processes requests via HTTP, the basic network protocol used to distribute information on the World Wide Web.'),
(4, 'What is a Domain Name?', 'A string of text that maps to a numeric IP address, used to access a website from client software.'),
(4, 'What is Web Hosting?', 'A service that allows organizations and individuals to post a website or web page onto the Internet.'),
(4, 'What is a CMS (Content Management System)?', 'A software application used to create and manage digital content.'),
(4, 'What is SEO (Search Engine Optimization)?', 'The process of improving the quality and quantity of website traffic to a website or a web page from search engines.'),
(4, 'What is a "Full Stack Developer"?', 'A developer who can work on both the frontend and backend of an application.'),
(4, 'What is "Cross-Browser Compatibility"?', 'The ability of a website, web application, HTML construct or client-side script to support various web browsers.'),
(4, 'What is a "Web Socket"?', 'A computer communications protocol, providing full-duplex communication channels over a single TCP connection.'),
(4, 'Explain the concept of "Web Accessibility" (a11y).', 'The practice of making your websites usable by as many people as possible, including those with disabilities.'),
(4, 'What is a "Service Worker"?', 'A script that your browser runs in the background, separate from a web page, opening the door to features that don''t need a web page or user interaction.'),
(4, 'What is "Web Performance Optimization"?', 'The process of making a website faster and more responsive.'),
(4, 'What is a "Content Delivery Network" (CDN)?', 'A geographically distributed group of servers which work together to provide fast delivery of Internet content.'),
(4, 'What is "Version Control" (e.g., Git)?', 'A system that records changes to a file or set of files over time so that you can recall specific versions later.'),
(4, 'What is GitHub?', 'A provider of Internet hosting for software development and version control using Git.'),
(4, 'What is a "Pull Request"?', 'A method of submitting contributions to an open-source project or a shared repository.'),
(4, 'What is "CI/CD" in web development?', 'Continuous Integration and Continuous Deployment, a set of practices that automate the process of building, testing, and deploying web applications.'),
(4, 'What is "Server-Side Rendering" (SSR)?', 'The process of rendering a web page on the server and sending the completed HTML to the browser.'),
(4, 'What is "Client-Side Rendering" (CSR)?', 'The process of rendering a web page in the browser using JavaScript.'),
(4, 'What is "Static Site Generation" (SSG)?', 'The process of generating all the HTML pages of a website at build time.'),
(4, 'What is "Web Security" (e.g., XSS, CSRF)?', 'The practice of protecting websites and web applications from cyber attacks.'),
(4, 'What is "CORS" (Cross-Origin Resource Sharing)?', 'A mechanism that allows restricted resources on a web page to be requested from another domain outside the domain from which the first resource was served.'),
(4, 'What is a "JWT" (JSON Web Token)?', 'A compact, URL-safe means of representing claims to be transferred between two parties.');