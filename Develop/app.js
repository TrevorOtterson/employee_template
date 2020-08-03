const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

// renders html page when app is ran
const render = require("./lib/htmlRenderer");

// array for all employee prompt answers to be pushed inside
let employeeArray = []

function start() {
    // prompt for stating the application
    inquirer.prompt(
        {
            type: "list",
            name: "question",
            message: "Do you want to add new employees?",
            choices: ["Add Employees", "Done"]
        })

        // runs questions when 'Add Employees' is selected
        .then(function (answer) {
            if (answer.question === "Add Employees") {
                promptUser()
            }
            else {
                generateHTML()
            }
        })
}

function promptUser() {
    // list of questions for user to fill out
    inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "Enter employees name"
        },

        {
            type: "input",
            name: "email",
            message: "Enter employees email"
        },

        {
            type: "input",
            name: "id",
            message: "Enter employee id"
        },

        {
            type: "list",
            name: "job",
            message: "Enter employees job role",
            choices: ['Engineer', 'Intern', 'Manager']
        }
    ])
        // questions change to "Engineer" prompt when "Engineer" selected
        .then(function (answers) {
            if (answers.job === "Engineer") {
                // prompt added when job type is selected
                inquirer.prompt(
                    {
                        type: "input",
                        name: "github",
                        message: "Enter employees GitHub username"
                    })
                    // pushes answers to engineers prompt into the employee array
                    .then(function (engineerPrompt) {
                        const bestEngineer = new Engineer(answers.name, answers.id, answers.email, engineerPrompt.github)
                        employeeArray.push(bestEngineer)
                        start()
                    })
            }
            else if (answers.job === "Intern") {
                // prompt added when job type is selected
                inquirer.prompt(
                    {
                        type: "input",
                        name: "school",
                        message: "Enter employees school name"
                    })
                    // pushes answers to interns prompt into the employee array
                    .then(function (internPrompt) {
                        const bestIntern = new Intern(answers.name, answers.id, answers.email, internPrompt.school)
                        employeeArray.push(bestIntern)
                        start()
                    })
            }
            else if (answers.job === "Manager") {
                // prompt added when job type is selected
                inquirer.prompt(
                    {
                        type: "input",
                        name: "officenumber",
                        message: "Enter in managers office number"
                    })
                    // pushes answers to managers prompt into the employee array    
                    .then(function (managerPrompt) {
                        const bestManager = new Manager(answers.name, answers.id, answers.email, managerPrompt.officenumber)
                        employeeArray.push(bestManager)
                        start()
                    })
            }
        });
}

// generates new information for HTML when app is ran and prompts are filled out
function generateHTML() {
    fs.writeFile(outputPath, render(employeeArray), function (err) {
        if (err) throw err
        console.log("Done");
    })
}

// starts program when node is ran
start()