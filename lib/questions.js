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

internals.questions = {
    project: [
        {
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
        {
            name: 'name',
            type: 'input',
            message: 'Name:',
            validate: internals.variableValidation
        },
        {
            name: 'db',
            type: 'list',
            message: 'Database support:',
            choices: [
                'none',
                'mongodb',
                'mysql',
                'elasticsearch'
            ]
        }
    ],
    app: [
        {
            name: 'author',
            type: 'input',
            message: 'Author:',
            validate: internals.nameValidation
        },
        {
            name: 'github', 
            type: 'input', 
            message: 'Github Account:',
            validate: internals.variableValidation
        }
    ],
    plugin: [
        {
            name: 'endpoint',
            type: 'checkbox',
            message: 'Endpoint examples:',
            choices: [
                {
                    name: 'GET',
                    checked: true
                },
                {
                    name: 'POST',
                    checked: true
                },
                {
                    name: 'PUT',
                    checked: false
                },
                {
                    name: 'DELETE',
                    checked: false
                }
            ]
        }
    ],
    widget: [
        {
            name: 'viewengine',
            type: 'list',
            message: 'View engine:',
            choices: [
                {
                    name: 'dust',
                    checked: true
                }
            ]
        }
    ]
};

const init = async () => {
    // Generate code
    let templatePath = path.join(__dirname, '/../templates');
    let currentPath = process.cwd();
    let data = {};
    let answers;
    // Project
    answers = await inquirer.prompt(internals.questions.project);
    data = Object.assign(answers, data);
    // Application
    if (data.type.endsWith('-app')) {
        answers = await inquirer.prompt(internals.questions.app);
        data = Object.assign(answers, data);
    } else {
        // Plugin
        if (data.type === 'service-plugin') {
            answers = await inquirer.prompt(internals.questions.plugin);
            data = Object.assign(answers, data);
        // Widget (plugin + UI)
        } else if (data.type === 'web-app-widget') {
            let combined = internals.questions.plugin.concat(internals.questions.widget);
            answers = await inquirer.prompt(combined);
            data = Object.assign(answers, data);
        }
    }
    // Generate result
    let model = new Model(data);
    //console.log(model);
    generate(model, templatePath, currentPath);
};

init();