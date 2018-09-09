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

    faker.date.timestamp = function () {
        return Math.round(faker.date.recent().getTime() / 1000);
    };

    /**
     * Generates a sequence of numbers starting from 1
     * @return {number}
     */
    faker.random.seq = function () {
        return ++sequence_base;
    };

    faker.random.yn = function () {
        return faker.random.arrayElement(YN_ARR);
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
