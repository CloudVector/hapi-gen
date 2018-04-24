'use strict';

const inquirer = require('inquirer');
const path = require('path');
const generate = require('./generate.js');
const Model = require('./model.js');
const internals = {};

/* Variable validation */
internals.variableValidation = (input) => {
    if (/^([A-Za-z\-\_\d])+$/.test(input)) {
        return true;
    } else {
        return 'Name may only include letters, numbers, dashes and underscores.';
    }
};

/* Name validation */
internals.nameValidation = (input) => {
    if (/^([A-Za-z\s\d])+$/.test(input)) {
        return true;
    } else {
        return 'Name may only include letters.';
    }
};

/* Number validation */
internals.numberValidation = (input) => {
    if (/^([\d])+$/.test(input)) {
        return true;
    } else {
        return 'Numbers only.';
    }
};

/* Version validation */
internals.versionValidation = (input) => {
    if (/(\d+\.)(\d+\.)(\d)/.test(input)) {
        return true;
    } else {
        return 'Example: <major>.<minor>.<patch> = 1.0.0';
    }
};

/* Enforce at least one to be selected */
internals.minimumValidation = (input) => {
    if (input.length < 1) {
        return 'You must choose at least one!';
    }
    return true;
};

// Individual question 
const question = {
    type: {
        name: 'type',
        type: 'list',
        message: 'What component would you like to generate?',
        choices: [
            'service-app',
            'service-plugin',
            new inquirer.Separator(),
            'web-app', 
            'web-app-widget'
        ]
    },
    name: {
        name: 'name',
        type: 'input',
        message: 'Name:',
        validate: internals.variableValidation
    },
    database: {
        name: 'database',
        type: 'list',
        message: 'Database support:',
        choices: [
            'none',
            'mongodb',
            'mysql',
            'elasticsearch'
        ]
    },
    port: {
        name: 'port',
        type: 'input',
        message: 'Port:',
        validate: internals.numberValidation
    },
    author: {
        name: 'author',
        type: 'input',
        message: 'Author:',
        validate: internals.nameValidation
    },
    github: {
        name: 'github', 
        type: 'input', 
        message: 'Github Account:',
        validate: internals.variableValidation
    },
    version: {
        name: 'version',
        type: 'input',
        message: 'Plugin version',
        validate: internals.versionValidation
    },
    useapi: {
        name: 'useapi',
        type: 'confirm',
        message: 'Use "/api/" word in endpoints path?',
        default: true
    },
    useversion: {
        name: 'useversion',
        type: 'checkbox',
        message: 'Use version number embedded in endpoints path?',
        choices: [
            {
                name: 'major',
                checked: true
            },
            {
                name: 'minor',
                checked: false
            },
            {
                name: 'patch',
                checked : false
            }
        ]
    },
    viewengine: {
        name: 'viewengine',
        type: 'list',
        message: 'View engine:',
        validate: internals.minimumValidation,
        choices: [
            {
                name: 'dust',
                checked: true
            }
        ]
    }
};

// List of questions
const questions = {
    project: [
        question.type,
        question.name
    ],
    app: [
        question.database,
        question.port,
        question.author,
        question.github
    ],
    plugin: [
        question.version,
        question.useversion,
        question.useapi
    ],
    widget: [
        question.version,
        question.useversion,
        question.useapi,
        question.viewengine
    ]
};

const init = async () => {
    // Generate code
    let templatePath = path.join(__dirname, '/../templates');
    let currentPath = process.cwd();
    let data = {};
    let answers;
    // Project
    answers = await inquirer.prompt(questions.project);
    Object.assign(data, answers);
    // Application
    if (data.type.endsWith('-app')) {
        answers = await inquirer.prompt(questions.app);
        Object.assign(data, answers);
    } else {
        // Plugin
        if (data.type === 'service-plugin') {
            answers = await inquirer.prompt(questions.plugin);
            Object.assign(data, answers);
        // Widget (plugin + UI)
        } else if (data.type === 'web-app-widget') {
            answers = await inquirer.prompt(questions.widget);
            Object.assign(data, answers);
        }
    }
    // Create model
    let model = new Model(data);
    // Get all the supported database name, which was not choosen
    model.dbNotUsed = [];
    question.database.choices.forEach((choice) => {
        if (model.database !== choice && choice !== 'none') {
            model.dbNotUsed.push(choice + '.js');
        }
    });
    // Generate result
    generate(model, templatePath, currentPath);
};

init();