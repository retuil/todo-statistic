const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}
function getTODOs() { 
    const filesContent = getFiles();
    const regex = /^\s*\/\/\s*[Tt][Oo][Dd][Oo][\s\S]+/;
    const todoComments = [];

    for (const content of filesContent) {
        const lines = content.split('\n');
        for (const line of lines) {
            const match = line.match(regex);
            if (match) {
                todoComments.push({'value': match[0].trim()});
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
