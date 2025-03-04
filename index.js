const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');
const path = require('node:path');
const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => [readFile(path), path]);
}

function getTODOs() { 
    const regex = /^\s*\/\/\s*[Tt][Oo][Dd][Oo]\s*(.*)/;
    const todoComments = [];

    for (const content of files) {
        const lines = content[0].split('\n');
        for (const line of lines) {
            const match = line.match(regex);
            if (match) {
                todoComments.push({
                    'value': match[1],
                    'file': path.basename(content[1])
                });
            }
        }
    }
    return todoComments;
}

function processCommand(command) {
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            show(getTODOs());
            break
        case 'important':
            let importantTodos = getTODOs()
                .map(evaluateImportant)
                .filter(todo => todo.important > 0);
            show(importantTodos);
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function show(todos){
    const importantLength = 1;
    const userLength = 10;
    const dateLength = 10;
    const textLength = 50;

    for (let todo of todos) {
        const important = setLength(todo.important ? '!' : '', importantLength);
        const user = setLength(todo.author || '', userLength);
        const date = setLength(todo.date || '', dateLength);
        const text = setLength(todo.value || '', textLength);

        console.log(writeLine(important, user, date, text));
    }
}

function evaluateImportant(todo){
    let str = todo.value;
    todo['important'] = str.split('!').length - 1;
    return todo;
}

// TODO you can do it!


function extractAuthorAndDate(obj) {
    const t = obj.value.split(';');
    if (t.length >= 3) {
        const author = t[0].trim();
        const date = Date.parse(t[1].trim());
        const endDateIndex = obj.value.indexOf(';', obj.value.indexOf(';') + 1) + 1;
        const clearValue = obj.value.slice(endDateIndex).trim();
        return {
            ...obj,
            author,
            date,
            clearValue,
        };
    }
    return {
        ...obj,
        author: null,
        date: null,
        clearValue: obj.value.trim(),
    };
}

function setLength(str, maxLength){
    if (str.length > maxLength){
        return str.substring(0, maxLength - 3) + '...';
    }
    return str;
}

function writeLine(...lines){
    return lines.join(' | ')
}

// console.log(extractAuthorAndDate({value: ""}))
// console.log(extractAuthorAndDate({value: ";"}))
// console.log(extractAuthorAndDate({value: "abc; 2020-11-1; comm"}))
// console.log(extractAuthorAndDate({value: "abc;2020-11-1;comm"}))

