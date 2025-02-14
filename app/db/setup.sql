-- Drop existing tables if they exist
DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS timesheets;

-- Create employees table with personal and professional fields
CREATE TABLE employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    job_title TEXT NOT NULL,
    department TEXT NOT NULL,
    salary REAL NOT NULL,
    photo_path TEXT,
    cv_path TEXT  -- Removed the extra comma here
);

-- Create timesheets table
CREATE TABLE timesheets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    employee_id INTEGER NOT NULL,
    summary TEXT,
    FOREIGN KEY (employee_id) REFERENCES employees(id)
);
