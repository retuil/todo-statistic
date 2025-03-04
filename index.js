const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');
const path = require('node:path');
const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);
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
    const commandParts = command.split(' ');
    const commandName = commandParts[0];
    switch (commandName) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            show(getTODOs());
            break
        case 'user':
            const userName = commandParts[1];
            const userTodos = getTODOs()
                .map(extractAuthorAndDate)
                .filter(obj => (obj.author || '').toLowerCase() === (userName || '').toLowerCase());
            show(userTodos)
            break;
        case 'important':
            let importantTodos = getTODOs()
                .map(evaluateImportant)
                .filter(todo => todo.important > 0);
            show(importantTodos);
            break;
        case 'sort':
            const toSortTodos = getTODOs()
                .map(extractAuthorAndDate)
                .map(evaluateImportant)
            switch (commandParts[1]) {
                case 'importance':
                    toSortTodos.sort((a, b) => -a.important + b.important)
                    break;
                case 'user':
                    toSortTodos.sort((a, b) => ((a.author || '').length - (b.author || '').length) || (a.author - b.author))
                    break
                case 'date':
                    toSortTodos.sort((a, b) => Date.parse(a.date) - Date.parse(b.date))
                    break
                default:
                    console.log('unknown species')
                    return;
            }
            show(toSortTodos);
            break
        default:
            console.log('wrong command');
            break;
    }
}

function show(data) {
    const todos = data.map(extractAuthorAndDate).map(evaluateImportant);
    todos.unshift({'author': 'user', 'important': 1, 'date': 'date', 'value': 'comment'})

    const importantLength = 1;
    const userLength = detectLength(todos.map(x => (x.author || '').length), 10);
    const dateLength = detectLength(todos.map(x => (x.date || '').length), 10);
    const textLength = detectLength(todos.map(x => (x.clearValue || x.value || '').length ||
        x.value.length), 50);

    writeDataLine(todos.shift(), importantLength, userLength, dateLength, textLength);
    console.log('-'.repeat(importantLength + userLength + dateLength + textLength + 3 * 3));
    for (let todo of todos) {
        writeDataLine(todo, importantLength, userLength, dateLength, textLength);
    }
    console.log('-'.repeat(importantLength + userLength + dateLength + textLength + 3 * 3));
}

function evaluateImportant(todo) {
    let str = todo.value;
    todo['important'] = str.split('!').length - 1;
    return todo;
}

// TODO you can do it!


function extractAuthorAndDate(obj) {
    const t = obj.value.split(';');
    if (t.length >= 3) {

        const author = t[0].trim();
        const date = t[1].trim();
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

function setLength(obj, maxLength) {
    let str = obj.toString();
    if (str.length > maxLength) {
        return str.substring(0, maxLength - 3) + '...';
    }

    return str.padEnd(maxLength, ' ');
}

function writeDataLine(data, importantLength, userLength, dateLength, textLength){
    const important = setLength(data.important ? '!' : '', importantLength);
    const user = setLength(data.author || '', userLength);
    const date = setLength(data.date || '', dateLength);
    const text = setLength(data.clearValue || data.value || '', textLength);

    console.log(writeLine(important, user, date, text));
}

function writeLine(...lines) {
    return lines.join(' | ')
}

function detectLength(dataLengths, maxLength) {
    return Math.min(maxLength, Math.max(...dataLengths));
}

// console.log(extractAuthorAndDate({value: ""}))
// console.log(extractAuthorAndDate({value: ";"}))
// console.log(extractAuthorAndDate({value: "abc; 2020-11-1; comm"}))
// console.log(extractAuthorAndDate({value: "abc;2020-11-1;comm"}))

