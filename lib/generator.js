'use strict';

// const DOB_SEED = new Date('1/1/2000');
// const dob = () => faker.date.past(50, DOB_SEED)

const fs = require('fs');
const path = require('path');

const chalk = require('chalk');
const isPlainObject = require('is-plain-object');
const faker = require('./faker');

/**
 * Appends default headers to the table.
 * @param {number} stop The stop condition for the loop.
 * @return {string[]} An array of default headers.
 * @private
 */
function appendHeaders(stop) {
    let defaultHeaders = [];

    for (let i = 1; i <= stop; i++) {
        defaultHeaders.push(`Column${i}`);
    }

    return defaultHeaders;
}

/**
 * @param {number} number The number to check.
 * @param {string} key The key to show in the error message.
 * @throws Error when the number is not valid.
 * @private
 */
function checkNumber(number, key) {
    const result = Number.parseInt(number);

    if (result < 1) {
        throw new Error(`${key} must be a positive integer`);
    }
}

/**
 * The gateway API for the entire script. Import this module into your own scripts
 * to generate CSV data on-the-fly.
 *
 * This function opens a `fs` stream and writes to the CSV file `m` records at a time.
 * This can be controlled by setting `options.chunks` to a positive integer value.
 * @example
 * const csvgen = require('csv-generator');
 * csvgen('foo.csv', ['name'], { rows: 10**6 });
 * @param {string} name The name of the output file.
 * @param {string[]} columns An array of functions to execute for each cell.
 * @param {object} options Options to pass the function.
 * @property {string|string[]} options.headers The headers to output as the first row of the CSV file.
 * @property {number} options.rows The number of rows to generate as an integer.
 * @property {number} options.chunks The number of rows to generate in one pass.
 * @property {boolean} options.silent Set `true` to disable console output.
 * @param {string[]} [headers] An array of headers to add as the first row of the generated table.
 * @return {Promise} A Promise that is resolved then the stream closes.
 * @async
 * @module lib/generator
 * @author Dennis Thompson <atomicpages@gmail.com>
 * @version 2.0.0
 */
module.exports = function (name, columns, options, headers) {
    if (!name) {
        throw new Error('File name is required');
    }

    if (columns.length === 0) {
        throw new Error('columns must contain at least one entry');
    }

    if (!isPlainObject(options)) {
        throw new Error('options must be a plain object');
    }

    const size = options.chunks > options.rows ? options.rows : options.chunks;

    checkNumber(options.rows, 'options.rows');
    checkNumber(options.chunks, 'options.chunks');

    if (fs.existsSync(path.resolve(name))) {
        fs.unlinkSync(path.resolve(name));
    }

    const stream = fs.createWriteStream(path.resolve(name), { encoding: 'utf8' });

    if (options && options.headers) {
        if (Array.isArray(headers) && headers.length > 0) {
            if (headers.length !== columns.length) {
                stream.write(headers.concat(appendHeaders(columns.split(/,\s*/g).length - headers.length)).join(',') + '\n');
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
            for (let j = 0; j < size; j++) {
                stream.write(faker.fake(columns) + '\n');
            }

            if (!options.silent) {
                console.log(`Appending CSV part ${i} of size ${size}`);
            }
        }

        stream.end();
        resolve();
        /* istanbul ignore next */
    }).catch(err => { // eslint-disable-line dot-notation
        fs.unlink(path.resolve(name));
        throw new Error(err);
    });
};
