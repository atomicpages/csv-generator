const fs = require('fs');
const path = require('path');
const Table = require('cli-table');
const _ = require('lodash/string');

module.exports = {

    /**
     * Platform-dependent user home directory compatible on Windows and *nix systems that export $HOME.
     * @return {boolean} THe path to the user's home directory.
     */
    home: function () {
        return process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME'];
    },

    /**
     * Prints the list of functions to STDOUT.
     * @param source {object} The JSON model to read from.
     */
    functions: function (source) {
        console.log(this.listFunctions(source));
    },

    /**
     * Generates an ASCII table from a JSON model.
     * @param source {object} The JSON model to read from.
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
     * @param file {string} The file to write to.
     * @param columns {string[]} An array of functions to run on each column.
     * @param options {object} Options to pass the generator.
     * @param [headers] {string[]} An array of custom column headers.
     */
    generate: async function (file, columns, options, headers) { // eslint-disable-line
        await require('./generator')(file, columns, options, headers);
    },

    /**
     * Converts a number like 100K to 100000.
     * @param number {string} The number to convert.
     * @throws Error when number is invalid.
     * @return {number} The converted number.
     */
    convertNumber: function (number) {
        if (/^\d+(\.\d*)?(K|M|B)$/.test(number)) {
            let r = number.toLowerCase().trim();

            if (_.endsWith(r, 'k')) {
                return Math.ceil(parseFloat(r) * 1000);
            } else if (_.endsWith(r, 'm')) {
                return Math.ceil(parseFloat(r) * 10 ** 6);
            } else {
                return Math.ceil(parseFloat(r) * 10 ** 9);
            }
        }

        if (!/[1-9]\d*$/.test(number)) {
            throw new Error('Invalid number');
        }

        return parseInt(number);
    }

};
