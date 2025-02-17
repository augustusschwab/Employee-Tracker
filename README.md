# Employee-Tracker

## Description
An command line interface application that queries a PostgreSQL employee database and allows the user to perform various commands on the data. See walkthrough video under the usage section for an example of the application.

## Table of Contents
  - [Installation](#installation)
  - [Usage](#usage)
  - [License](#license)
  - [Contributing](#contributing)
  - [Tests](#tests)
  - [Questions](#questions)
  
## Installation
To install, clone or download the project folder and run `npm install` from the root directory. The application uses the `inquirer` and `pg` JavaScript packages to allow interaction with the command line interface and query PostgreSQL. Ensure PostgreSQL is downloaded to the users machine.

## Usage
This application runs in the command line with `Node.js` and the `inquirer` package. Once a root folder is setup on the users machine and the dependencies are installed start by initializing the PostgreSQL database using `psql -U posgres` and providing the password to the postgres database. Then run `\i schema.sql` followed by `\i seed.sql`, this will setup the database and prepopulate it with data. The application can then be run using `npm start` from the command line. See video below for an example.

  [Employee Tracker Example Video](https://drive.google.com/file/d/1zOuDagC7ZivhvsSLGWIie8y_dfHMK5yA/view?usp=sharing)


## License
  ![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

[MIT License](https://opensource.org/licenses/MIT)
  
## Contributing
  To contribute to this repository, please contact the repository owner via the email in the questions section.
  
## Tests
  To run tests as the code is being modified simply run `node start` in the command line.
  
## Questions
  Github: augustusschwab
  
  For additional questions please send and email to, augustusschwab@gmail.com.
  
  
> [!NOTE]
  >All code was written by Gus Schwab using the starter code provided in Module 10 of the U of U Software Development Bootcamp.
