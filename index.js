const fs = require('fs');
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const inquirer = require('inquirer');
const Utils = require('./lib/utils');

(function () {
    clear();

    console.log(''); // prevents top from being chopped off

    console.log(
        chalk.yellow(
            figlet.textSync('CSV Generator', {
                horizontalLayout: 'full'
            })
        )
    );

    console.log('To show help or list available functions, type "help" or "help functions" at any question and press ENTER');

    const help = input => {
        if (input.toLocaleLowerCase().trim() === 'help') {
            return 'Testing...';
        } else if (/^(help\s*)?func(tions?)?$/i.test(input.toLocaleLowerCase().trim())) {
            return 'Available functions:\n' + Utils.functions(require('./functions'), true);
        }

        return true;
    };

    inquirer.prompt([{
            name: 'file',
            type: 'input',
            message: 'Enter in the name of your output file:',
            default: 'my.csv',
            validate: function (input) {
                let response = help(input);

                if (response !== true) {
                    return response;
                }

                return true;
            }
        },
        {
            name: 'columns',
            type: 'input',
            message: 'Enter in column definitions using a list of available functions separated by a comma. For examples and other documentation, type "help" and press ENTER:',
            validate: function (input) {
                let response = help(input);

                if (response !== true) {
                    return response;
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
                let response = help(input);

                if (response !== true) {
                    return response;
                }

                if (!/^[1-9]\d*(B|K|M)?$/.test(input)) {
                    return 'Invalid number entered. Value must be an integer greater than 0.';
                }

                return true;
            }
        }
    ]).then(() => {
        // TODO: handle this case...
    });
}());
