'use strict';

const inquirer = require('inquirer');
const path = require('path');
const tools = require('@cloudvector/tools');
const generate = require('./generate.js');

const variableValidation = (input) => {
    if (/^([A-Za-z\-\_\d])+$/.test(input)) {
        return true;
    } else {
        return 'Name may only include letters, numbers, dashes and underscores.';
    }
};

const nameValidation = (input) => {
    if (/^([A-Za-z\s\d])+$/.test(input)) {
        return true;
    } else {
        return 'Name may only include letters.';
    }
};

// Generate code
const init = async () => {
    let templatePath = path.join(__dirname, '/../templates');
    let currentPath = process.cwd();
    const QUESTIONS = [
    {
        name: 'type',
        type: 'list',
        message: 'What component would you like to generate?',
        choices: await tools.directories(templatePath)
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
    }];

    // Ask for the input
    let answers = await inquirer.prompt(QUESTIONS);
    // Generate result
    await generate(answers, templatePath, currentPath);
};

init();