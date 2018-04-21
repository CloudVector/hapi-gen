'use strict';

const inquirer = require('inquirer');
const path = require('path');
const files = require('./files.js');
const generate = require('./generate.js');
const config = require('config');

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

/* Assign validation program code */
const prepare (list) {
    for (let i = 0, len1 = list.length; i < len1; i++) {
        if (list[i].validate) {
            if (list[i].mode === 'variable') {
                list[i].validate = variableValidation;
            } else if (list[i].mode === 'name') {
                list[i].validate = nameValidation;
            }
        }
        // Check choices
        if (Array.isArray(list[i].choices)) {
            for (let j = 0, len2 = list[i].choices.length; i < len2; i++) {
                if (list[i].choices[j] === '--') {
                    list[i].choices[j] = new inquirer.Separator();
                }
            }
        }
    }
    return list;
};

const init = async () => {
    // Generate code
    let templatePath = path.join(__dirname, '/../templates');
    let currentPath = process.cwd();
    let model = {};
    let anwsers;
    let questions = config.get('questions');
    // Project
    answers = await inquirer.prompt(prepare(questions.project));
    model = Object.assign(answers, model);
    // Application
    if (model.type.endsWith('-app')) {
        answers = await inquirer.prompt(prepare(questions.app));
        model = Object.assign(answers, model);
    } else {
        if (model.type === 'service-plugin') {
            answers = await inquirer.prompt(prepare(questions.plugin));
            model = Object.assign(answers, model);
        } else if (model.type === 'web-app-widget') {
            let combined = questions.plugin.concat(questions.widget);
            answers = await inquirer.prompt(prepare(combined));
            model = Object.assign(answers, model);
        }
    }
    // Generate result
    console.log(model);
    //generate(model, templatePath, currentPath);
};

init();