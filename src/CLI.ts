import inquirer from 'inquirer';
import pg from 'pg';
const { Client } = pg;
//import { client, connectToDb } from './connection.js';

class CLI {
    client = new Client;
    exit: boolean = false;

    constructor(client = new Client){
        this.client = client;
    }

    //Get helper functions to create lists in the inquirer prompts.
    //Get an array of department names.
    async getDepartments() {
        try{
            const result = await this.client.query('SELECT * FROM department');
            return result.rows.map(row => row.name);
        } catch(err) {
            console.log(err);
            return [];
        }   
    }

    //Get an array of roles.
    async getRoles() {
        try{
            const result = await this.client.query('SELECT * FROM role');
            return result.rows.map(row => row.title);
        } catch(err) {
            console.log(err);
            return [];
        }  
    }

    //Get an array of employees
    async getEmployees() {
        try{
            const result = await this.client.query('SELECT first_name, last_name FROM employee')
            return result.rows.map((employee) => {
                return `${employee.first_name} ${employee.last_name}`
            });
        } catch(err) {
            console.log(err);
            return[];
        }
    }

    //Get an array of managers.
    async getManagers() {
        try{
            const query: string = 
            `SELECT DISTINCT e.first_name, e.last_name 
            FROM employee e
            JOIN employee sub ON e.id = sub.manager_id;`
            const result = await this.client.query(query);
            
            return result.rows.map((manager) => {
                return `${manager.first_name} ${manager.last_name}`
            });
        } catch(err) {
            console.log(err)
            return [];
        }
    }

    //Helper functions for creating tables
    createTable(data: Record<string, any>[]){
        //Create an array of object keys
        const headers: string[] = Object.keys(data[0]);

        //Determine the column widths - find longest value in each column
        const widths: number[] = headers.map(header =>
            Math.max(header.length, ...data.map(value => String(value[header]).length))
        )
        
        //Format each row of the table.
        const formatRow = (row: any) => {
            return headers.map((header, i) => String(row[header]).padEnd(widths[i])).join(" | ");
        }

        //Create a header row of the table with the key names.
        console.log(formatRow(Object.fromEntries(headers.map(header => [header, header]))));

        //Create a divider from the header to the data.
        console.log("-".repeat(formatRow(data[0]).length));

        //Print each row.
        data.forEach(row => console.log(formatRow(row)));

    }

    //Query to view all departments in the database.
    async viewDepartment(): Promise<void> {
        try{
            const result = await this.client.query('SELECT * FROM department');
            this.createTable(result.rows);
        } catch(err){
            console.log(err);
        }  
    };

    //Query to view all roles in the database
    async viewRoles(): Promise<void> {
        try{
            const rolesQuery = 
            `SELECT 
                role.title AS job_title, 
                role.id AS role_id,
                department.name AS department, 
                role.salary 
            FROM role 
            JOIN department ON role.department_id = department.id`;
            
            const result = await this.client.query(rolesQuery);
            this.createTable(result.rows);
        } catch(err) {
            console.log(err);
        }
    };

    //Query to view all employees in the database.
    async viewEmployees(): Promise<void> {
        try{
            const employeesQuery =
            `SELECT
                employee.id AS employee_id,
                employee.first_name,
                employee.last_name,
                role.title AS job_title,
                department.name AS department,
                role.salary,
                CONCAT(m.first_name, ' ', m.last_name) AS manager
            FROM employee
            JOIN role ON employee.role_id = role.id
            JOIN department ON role.department_id = department.id
            LEFT JOIN employee m ON employee.manager_id = m.id`;

            const result = await this.client.query(employeesQuery);
            this.createTable(result.rows);
        } catch(err){
            console.log(err);
        }
    };

    //Function to add a department to the database.
    async addDepartment(){
        return inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'department',
                    message: 'What is the department name?'
                }
            ])
            .then(async(answer: any) => {
                try{
                    await this.client.query('INSERT INTO department (name) VALUES ($1)', [answer.department]);
                    console.log(`${answer.department} added to database.`)
                } catch(err) {
                    console.log(err)
                }
            });
    };

    //Function to add a role to the database.
    async addRole(){
        return inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'role',
                    message: 'What is the role name?'
                },
                {
                    type: 'input',
                    name: 'salary',
                    message: 'What is the salary of the role?'
                },
                {
                    type: 'list',
                    name: 'department',
                    message: 'What department is the role in?',
                    choices: await this.getDepartments()
                }
            ])
            .then(async (answer: any) => {
                try{
                    const departmentId = await this.client.query('SELECT id FROM department WHERE name = ($1)', [answer.department]);
                    await this.client.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', [answer.role, answer.salary, departmentId.rows[0].id]);
                    console.log(`${answer.role} was added to database.`);
                } catch(err) {
                    console.log(err)
                }
            });
    };

    //Function to add an employee to the database.
    async addEmployee(){
        return inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'firstName',
                    message: 'What is the employees first name?'
                },
                {
                    type: 'input',
                    name: 'lastName',
                    message: 'What is the employee\'s last name?'
                },
                {
                    type: 'list',
                    name: 'role',
                    message: 'What is the employee\'s role?',
                    choices: await this.getRoles()
                },
                {
                    type: 'list',
                    name: 'manager',
                    message: 'Who is the employee\'s manager?',
                    choices: await this.getManagers()
                },
            ])
            .then(async (answer: any) => {
                try{
                    const roleId = await this.client.query('SELECT id FROM role WHERE title = ($1)', [answer.role]);
                    const managerId = await this.client.query('SELECT id FROM employee WHERE CONCAT(first_name, \' \', last_name) = ($1)', [answer.manager]);
                    await this.client.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [answer.firstName, answer.lastName, roleId.rows[0].id, managerId.rows[0].id]);
                    console.log(`${answer.firstName} ${answer.lastName} was added to database.`)
                } catch(err) {
                    console.log(err)
                }
            });
    };

    //Function to update an employee's role.
    async updateEmployeeRole(){
        try{
            return inquirer
                .prompt([
                    {
                        type: 'list',
                        name: 'name',
                        message: 'What is the employee\'s name?',
                        choices: await this.getEmployees()
                    },
                    {
                        type: 'list',
                        name: 'role',
                        message: 'What is the employee\'s new role?',
                        choices: await this.getRoles()
                    }
                ])
                .then(async(answer: any) => {
                    const roleId = await this.client.query('SELECT id FROM role WHERE title = ($1)', [answer.role])
                    const firstName = answer.name.split(" ")[0];
                    const lastName = answer.name.split(" ")[1];
                    console.log(`${firstName} ${lastName}`);
                    await this.client.query('UPDATE employee SET role_id = ($3) WHERE first_name = ($1) AND last_name = ($2)', [firstName, lastName, roleId.rows[0].id]);
                    console.log(`${answer.firstName} ${answer.lastName}'s role was upadted to ${answer.role}.`)
                })
            
        } catch(err) {
            console.log(err)
        }
    };

    //Method to start the CLI.
    startUp(): void {
        inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'action',
                    message: 'What would you like to do?',
                    choices: [
                        'View All Departments', 
                        'View All Roles', 
                        'View All Employees', 
                        'Add A Department', 
                        'Add A Role', 
                        'Add An Employee',
                        'Update An Employee Role',
                        'Exit'
                    ],
                },
            ])
            .then((answers: any) => {
                if(answers.action === 'View All Departments'){
                    return this.viewDepartment();
                } else if (answers.action === 'View All Roles'){
                    return this.viewRoles();
                } else if (answers.action === 'View All Employees'){
                    return this.viewEmployees();
                } else if (answers.action === 'Add A Department'){
                    return this.addDepartment();
                } else if (answers.action === 'Add A Role'){
                    return this.addRole();
                } else if (answers.action === 'Add An Employee'){
                    return this.addEmployee();
                } else if (answers.action === 'Update An Employee Role'){
                    return this.updateEmployeeRole();
                } else {
                    this.exit = true;
                    return Promise.resolve();
                }
            })
            .then(() => {
                if(!this.exit){
                    return this.startUp();
                } else {
                    return Promise.resolve();
                }
            });      
    }
}

//Export CLI class.
export default CLI;
