const fs = require('fs');
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const inquirer = require('inquirer');

clear();

console.log(''); // prevents top from being chopped off

console.log(
    chalk.yellow(
        figlet.textSync('CSV Generator', { horizontalLayout: 'full' })
    )
);

inquirer.prompt([
    {
        name: 'file',
        type: 'input',
        message: 'Enter in the name of your output file:',
        default: 'my.csv'
    },
    {
        name: 'columns',
        type: 'editor',
        message: 'Enter in column definitions using a list of available functions separated by a comma. For examples and other documentation, type "help" and press ENTER:',
        validate: function (input) {
            if (input.toLocaleLowerCase().trim() === 'help') {
                // show help...
                return '';
            } else if (input.toLocaleLowerCase().trim().indexOf('func') !== -1) {
                // show functions...
                return '';
            }

            if (input.trim().split(/\s*,\s*/g).length === 0) {
                return 'Invalid column definitions.';
            }

            return true;
        }
    },
    {
        name: 'rows',
        type: 'input',
        message: 'Enter in the total number of rows to generate (e.g. 100, 100000, 100K, 10M, 1B, etc.):',
        default: 100,
        validate: function (input) {
            if (!/^[1-9]\d*(B|K|M)?$/.test(input)) {
                return 'Invalid number entered. Value must be an integer greater than 0.';
            }

            return true;
        }
    }
]).then(() => {
    // TODO: handle this case...
});
