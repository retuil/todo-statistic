const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}
function getTODOs() { // => Array[{value: str}]
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
            console.log(getTODOs());
            break
        default:
            console.log('wrong command');
            break;
    }
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

// console.log(extractAuthorAndDate({value: ""}))
// console.log(extractAuthorAndDate({value: ";"}))
// console.log(extractAuthorAndDate({value: "abc; 2020-11-1; comm"}))
// console.log(extractAuthorAndDate({value: "abc;2020-11-1;comm"}))

