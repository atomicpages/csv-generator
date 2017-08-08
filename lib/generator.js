'use strict';

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const genData = require(path.join(__dirname, 'vendor/gendata.js'));

eval(fs.readFileSync(path.join(__dirname, 'vendor/csvsup.js')) + ''); // eslint-disable-line no-eval
eval(fs.readFileSync(path.join(__dirname, 'vendor/strsup.js')) + ''); // eslint-disable-line no-eval

/**
 * Appends default headers to the table.
 * @param stop {number} The stop condition for the loop.
 * @return {string[]} An array of default headers.
 */
function appendHeaders(stop) {
    let defaultHeaders = [];

    for (let i = 1; i <= stop; i++) {
        defaultHeaders.push(`Column${i}`);
    }

    return defaultHeaders;
}

/**
 * @param name {string} The name of the output file.
 * @param columns {string[]} An array of functions to execute for each cell.
 * @param options {object} Options to pass the function.
 * @param [headers] {string[]} An array of headers to add as the first row of the generated table.
 */
module.exports = function (name, columns, options, headers) {
    if (fs.existsSync(path.resolve(name))) {
        fs.unlinkSync(path.resolve(name));
    }

    const stream = fs.createWriteStream(path.resolve(name), { encoding: 'utf8' });

    if (options && options.headers) {
        if (Array.isArray(headers) && headers.length > 0) {
            if (headers.length !== columns.length) {
                stream.write(headers.concat(appendHeaders(columns.length - headers.length)).join(',') + '\n');
            } else {
                stream.write(headers.join(',') + '\n');
            }
        } else {
            stream.write(appendHeaders(columns.length).join(',') + '\n');
        }
    }

    const start = new Date().getTime();

    stream.on('finish', () => {
        console.log(`Successfully wrote ${chalk.green(options.rows)} rows to ${path.resolve(name)} in ${(new Date().getTime() - start) / 1000}s`);
    });

    return new Promise(resolve => {
        for (let i = 0; i < options.rows; i += options.chunks) {
            let size = options.chunks > options.rows ? options.rows : options.chunks;
            let csvStringPart = genData(columns, size);

            if (!options.silent) {
                console.log(`Appending CSV part ${i} of size ${size}`);
            }

            stream.write(csvStringPart);
        }

        stream.end();
        resolve();
        /* istanbul ignore next */
    }).catch(err => { // eslint-disable-line dot-notation
        fs.unlink(path.resolve(name));
        throw new Error(err);
    });
};
