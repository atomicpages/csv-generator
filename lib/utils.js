'use strict';

const Table = require('cli-table');
const _ = require('lodash/string');

/**
 * Utility module that contains various utility functions
 * that are shared by the interactive interface and the default
 * CLI interface.
 * @module lib/utils
 * @author Dennis Thompson <atomicpages@gmail.com>
 * @version 1.0.0
 */
module.exports = {

    /**
     * Platform-dependent user home directory compatible on Windows and *nix systems that export `$HOME`.
     * @return {boolean} The path to the user's home directory.
     */
    home: function () {
        return process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME'];
    },

    /**
     * Prints the list of functions to `STDOUT`.
     * @param source {object} The `JSON` model to read from.
     */
    functions: function (source) {
        console.log(this.listFunctions(source));
    },

    /**
     * Generates an ASCII table from a `JSON` model.
     * @param source {object} The `JSON` model to read from.
     */
    listFunctions: function (source) {
        let table = new Table({
            head: ['Name', 'Description'],
            colWidths: [50, 150]
        });

        for (let key in source) {
            if (typeof source[key] === 'string') {
                table.push([key, source[key]]);
            } else if (typeof source[key] === 'object') {
                table.push([key, source[key].desc]);

                for (let k in source[key].variations) {
                    table.push([k, source[key].variations[k]]);
                }
            }
        }

        return table.toString();
    },

    /**
     * Delegates the generation of random data.
     * @param {string} file The file to write to.
     * @param {string[]} columns An array of functions to run on each column.
     * @param {object} options Options to pass the generator.
     * @param {string[]} [headers] An array of custom column headers.
     * @param {string} [path] An optional path to write the file to.
     * @async
     */
    generate: async function (file, columns, options, headers, path) { // eslint-disable-line
        await require('./generator')(file, columns, options, headers, path);
    },

    /**
     * Converts a number like 100K to 100000.
     * @param {string} number The number to convert.
     * @throws Error when number is invalid.
     * @return {number} The converted number.
     */
    convertNumber: function (number) {
        if (/^\d+(\.\d*)?(K|M|B)$/.test(number)) {
            let r = number.toLowerCase().trim();

            if (_.endsWith(r, 'k')) {
                return Math.ceil(parseFloat(r) * 1000);
            } else if (_.endsWith(r, 'm')) {
                return Math.ceil(parseFloat(r) * Math.pow(10, 6));
            }

            return Math.ceil(parseFloat(r) * Math.pow(10, 9));
        }

        if (!/[1-9]\d*$/.test(number)) {
            throw new Error('Invalid number');
        }

        return parseInt(number);
    }

};
