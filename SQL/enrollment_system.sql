-- ============================================================
-- School Enrollment System — Database Schema
-- Run: mysql -u root -p < SQL/enrollment_system.sql
-- After importing, run: cd backend && npm run seed
-- ============================================================

CREATE DATABASE IF NOT EXISTS enrollment_system
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE enrollment_system;

-- -------------------------------------------------------
-- Users Table
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  user_id    INT AUTO_INCREMENT PRIMARY KEY,
  username   VARCHAR(50)  NOT NULL UNIQUE,
  password   VARCHAR(255) NOT NULL,
  role       ENUM('admin','registrar') NOT NULL DEFAULT 'registrar',
  createdAt  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -------------------------------------------------------
-- Students Table
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS students (
  student_id     INT AUTO_INCREMENT PRIMARY KEY,
  first_name     VARCHAR(50)  NOT NULL,
  last_name      VARCHAR(50)  NOT NULL,
  birth_date     DATE,
  gender         ENUM('Male','Female','Other'),
  grade_level    VARCHAR(20),
  email          VARCHAR(100) NOT NULL UNIQUE,
  contact_number VARCHAR(20),
  createdAt      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -------------------------------------------------------
-- Courses Table
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS courses (
  course_id   INT AUTO_INCREMENT PRIMARY KEY,
  course_name VARCHAR(100) NOT NULL,
  grade_level VARCHAR(20),
  description TEXT,
  duration    VARCHAR(50),
  status      ENUM('Active','Inactive') NOT NULL DEFAULT 'Active',
  createdAt   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -------------------------------------------------------
-- Enrollments Table
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS enrollments (
  enrollment_id   INT AUTO_INCREMENT PRIMARY KEY,
  student_id      INT  NOT NULL,
  course_id       INT  NOT NULL,
  enrollment_date DATE NOT NULL,
  status          ENUM('Active','Inactive','Completed','Dropped') NOT NULL DEFAULT 'Active',
  createdAt       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_enrollment_student FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
  CONSTRAINT fk_enrollment_course  FOREIGN KEY (course_id)  REFERENCES courses(course_id)  ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -------------------------------------------------------
-- NOTE: Run "cd backend && npm run seed" to populate
--       users, students, courses, and enrollments with
--       sample data and create the default admin account.
-- -------------------------------------------------------
