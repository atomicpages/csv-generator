/**
 * A small library of polyfills for faker. This includes functions
 * that faker doesn't come with that we use for generating useful
 * and common bits of data.
 * @version 1.0.0
 * @since 2.0.0
 */
(function () {
    'use strict';

    const faker = require('faker');
    const moment = require('moment');
    const chance = new (require('chance'))();
    const DOB_SEED = new Date('1/1/2000');

    const YN_ARR = ['y', 'n'];

    let sequence_base = 0;

    /**
     * Generates a random date of birth.
     * @return {Date}
     */
    faker.date.dob = function () {
        return faker.date.past(50, DOB_SEED);
    };

    /**
     * Generates a timestamp in seconds.
     * @return {number}
     */
    faker.date.timestamp = function () {
        return Math.round(faker.date.recent().getTime() / 1000);
    };

    /**
     * Pass in an arbitrary date format and moment
     * will return the date string.
     * @param {number|string|Date} [date=chance.hammertime()] The date to format.
     * @param {string} [format='MM/DD/YYYY'] The format of the date.
     * @example
     * faker.date.format();
     * faker.date.format(faker.date.past(), 'DD/MM/YYYY');
     * faker.date.format(faker.date.between('1970', '2000'));
     *
     * faker.fake('{{date.format([null, "MM/DD"])}}'); // set null to use random time
     * faker.fake('{{date.format([0, "MM/DD"])}}'); // set 0 to start at epoch time
     * @return {string}
     */
    faker.date.format = function (date = chance.hammertime(), format = 'MM/DD/YYYY') {
        let datePart = date;
        let formatPart = format;

        if (Array.isArray(date)) {
            [datePart, formatPart] = date;
        }

        if (!datePart && typeof datePart !== 'number') {
            datePart = chance.hammertime();
        }

        return moment(datePart).format(formatPart);
    };

    /**
     * Format a date range.
     * @param {string|number|Date} from Beginning from date.
     * @param {string|number|Date} to Ending on date.
     * @param {string} [format='MM/DD/YYYY'] The format string.
     * @example
     * faker.date.range('1900', '1950');
     * faker.date.range('1900', '1950', 'YYYY/MM/DD HH:mm');
     *
     * faker.fake('{{date.range(["1900", "1950"])}}');
     * faker.fake('{{date.range("1900", "1950")}}');
     */
    faker.date.range = function (from, to, format) {
        let f = from;
        let t = to;
        let ff = format;

        if (Array.isArray(from)) {
            [f, t, ff] = from;
        } else if (typeof from === 'string') {
            [f, t, ff] = from.split(/,\s*/g);
        }

        if (!ff) {
            ff = 'MM/DD/YYYY';
        }

        return moment(faker.date.between(f, t)).format(ff);
    };

    /**
     * Generates a sequence of numbers starting from 1.
     * @return {number}
     */
    faker.random.seq = function () {
        return ++sequence_base;
    };

    faker.random.yn = function () {
        return faker.random.arrayElement(YN_ARR);
    };

    /**
     * Ability to generate a full name easily.
     * @return {string}
     */
    faker.name.name = function () {
        return `${faker.name.firstName()} ${faker.name.lastName()}`;
    };

    // aliases
    faker.date.birthday = faker.date.dob;
    faker.name.first = faker.name.firstName;
    faker.name.last = faker.name.lastName;
    faker.address.zip = faker.address.zipCode;

    /**
     * Chance polyfills
     */

    // https://chancejs.com/finance/cc.html
    faker.finance.cc = options => chance.cc(options);

    // https://chancejs.com/finance/cc_type.html
    faker.finance.cc_type = options => chance.cc_type(options);

    // https://chancejs.com/finance/exp.html
    faker.finance.exp = () => chance.exp();

    // https://chancejs.com/finance/exp_month.html
    faker.finance.exp_month = options => chance.exp_month(options);

    // https://chancejs.com/finance/exp_year.html
    faker.finance.exp_year = () => chance.exp_year();

    // https://chancejs.com/time/hammertime.html
    faker.date.hammertime = () => chance.hammertime();

    // https://chancejs.com/time/timezone.html
    faker.date.timezone = () => chance.timezone();

    faker.person = {
        // https://chancejs.com/person/ssn.html
        ssn: options => chance.ssn(options),

        // https://chancejs.com/person/gender.html
        gender: options => chance.gender(options),

        // https://chancejs.com/person/age.html
        age: options => chance.age(options),

        // https://chancejs.com/person/cf.html
        cf: () => chance.cf()
    };

    faker.thing = { animal: () => chance.animal() };

    module.exports = faker;
})();
