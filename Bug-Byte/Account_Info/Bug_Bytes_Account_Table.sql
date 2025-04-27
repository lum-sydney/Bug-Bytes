CREATE TABLE account_info (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    start_date DATE,
    lesson_1_completion_date DATE,
    lesson_2_completion_date DATE,
    lesson_3_completion_date DATE,
    UNIQUE (user_id),
    UNIQUE (username)
);