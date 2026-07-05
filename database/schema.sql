-- Buat database
CREATE DATABASE IF NOT EXISTS notes_api;
USE notes_api;

-- Buat tabel notes
CREATE TABLE IF NOT EXISTS notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert data dummy
INSERT INTO notes (title) VALUES 
('Belajar Express'),
('Belajar Node.js');
