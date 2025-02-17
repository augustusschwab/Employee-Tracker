-- Clear existing data and reset sequences
TRUNCATE employee, role, department RESTART IDENTITY CASCADE;

-- Insert data into department table
INSERT INTO department (name) VALUES
    ('Engineering'),
    ('Human Resources'),
    ('Marketing'),
    ('Sales'),
    ('Finance');

-- Insert data into role table
INSERT INTO role (title, salary, department_id) VALUES
    ('Software Engineer', 90000, 1),
    ('Senior Software Engineer', 120000, 1),
    ('HR Manager', 75000, 2),
    ('Recruiter', 65000, 2),
    ('Marketing Specialist', 60000, 3),
    ('Marketing Manager', 85000, 3),
    ('Sales Associate', 55000, 4),
    ('Sales Manager', 95000, 4),
    ('Financial Analyst', 70000, 5),
    ('Finance Manager', 110000, 5);

-- Insert data into employee table
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
    ('Alice', 'Johnson', 1, 3),   -- Alice is a Software Engineer, reports to Charlie
    ('Bob', 'Smith', 1, 3),       -- Bob is also a Software Engineer, reports to Charlie
    ('Charlie', 'Williams', 2, NULL),   -- Charlie is a Senior Software Engineer, no manager (he is a manager)
    ('Diana', 'Evans', 3, NULL),  -- Diana is an HR Manager, no manager
    ('Ethan', 'Brown', 4, 4),     -- Ethan is a Recruiter, reports to Diana
    ('Fiona', 'Miller', 5, 7),    -- Fiona is a Marketing Specialist, reports to George
    ('George', 'Davis', 6, NULL), -- George is a Marketing Manager, no manager
    ('Hannah', 'Wilson', 7, 9),   -- Hannah is a Sales Associate, reports to Ian
    ('Ian', 'Anderson', 8, NULL), -- Ian is a Sales Manager, no manager
    ('Jack', 'Thomas', 9, 11),    -- Jack is a Financial Analyst, reports to Karen
    ('Karen', 'White', 10, NULL); -- Karen is a Finance Manager, no manager
