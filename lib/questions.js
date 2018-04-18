'use strict';

const inquirer = require('inquirer');
const fs = require('fs');
const generate = require('./generate.js');

const variableValidation = (input) => {
    if (/^([A-Za-z\-\_\d])+$/.test(input)) {
        return true;
    } else {
        return 'Name may only include letters, numbers, dashes and underscores.';
    }
};

const nameValidation = (input) => {
    if (/^([A-Za-z\d])+$/.test(input)) {
        return true;
    } else {
        return 'Name may only include letters.';
    }
};

const numberValidation = (input) => {
    if (/^([\d])+$/.test(input)) {
        return true;
    } else {
        return 'Numbers only.';
    }
};

// Generate code
const init = async () => {
    const QUESTIONS = [
    {
        name: 'type',
        type: 'list',
        message: 'What component would you like to generate?',
        choices: ['service-app', 'service-plugin', 'web-app', 'web-app-widget']
    },
    {
        name: 'name',
        type: 'input',
        message: 'Component name:',
        validate: variableValidation
    },
    {
        name: 'author',
        type: 'input',
        message: 'Author:',
        validate: nameValidation
    },
    {
        name: 'github', 
        type: 'input', 
        message: 'Github Account:',
        validate: variableValidation
    },
    {
        name: 'port',
        type: 'input',
        message: 'Port:',
        validate: numberValidation
    }
    ];

    // Ask for the input
    let answers = await inquirer.prompt(QUESTIONS);
    // Generate result
    let result = await generate(answers, { 
        currentPath: process.cwd()
    });
    console.log(result);
};

init();