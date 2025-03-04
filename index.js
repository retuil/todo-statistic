const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}
function getTODOs() { // => Array[str]
    const filesContent = getFiles();
    const todoComments = [];

    for (const content of filesContent) {
        const lines = content.split('\n');
        for (const line of lines) {
            if (line.includes('// TODO')) {
                todoComments.push({'value': line.trim()});
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
    for (let todo of todos) {
        console.log(todo.value);
    }
}

function evaluateImportant(todo){
    let str = todo.value;
    todo['important'] = str.split('!').length - 1;
    return todo;
}

// TODO you can do it!
