/* eslint-disable dot-notation, no-invalid-this */

'use strict';

const stripAnsi = require('strip-ansi');
const expect = require('chai').expect;
const Utils = require('../lib/utils');
const mock = require('mock-fs');

require('mocha-sinon');

describe('Testing the Utils class', function () {
    describe('#home', function () {
        it('should contain the user\'s name', function () {
            expect(Utils.home()).to.have.string(process.env[process.platform === 'win32' ? 'USERNAME' : 'USER']);
        });
    });

    describe('#listFunctions', function () {
        it('should contain name, email, and address as functions', function () {
            const table = Utils.listFunctions({
                name: 'This is a test',
                email: 'This is a test',
                address: 'This is a test'
            });

            expect(table).to.have.string('name');
            expect(table).to.have.string('email');
            expect(table).to.have.string('address');
        });

        it('should render variations alongside top-level options', function () {
            const table = stripAnsi(Utils.listFunctions({
                name: {
                    desc: 'Testing',
                    variations: {
                        'name(2)': 'My desc'
                    }
                }
            }));

            expect(table).to.have.string('name');
            expect(table).to.have.string('Testing');
            expect(table).to.have.string('name(2)');
            expect(table).to.have.string('My desc');
        });

        it('should only add strings and objects of the right format', function () {
            const table = Utils.listFunctions({
                name: 0,
                email: 'This is a test',
                address: 'This is a test'
            });

            expect(table).to.not.have.string('name');
            expect(table).to.have.string('email');
            expect(table).to.have.string('address');
        });
    });

    describe('#functions', function () {
        it('should print content to the console', function () {
            let spy = this.sinon.spy(console, 'log');

            stripAnsi(Utils.functions({
                name: 'This is a test',
                email: 'This is a test',
                address: 'This is a test'
            }));

            expect(console.log.calledOnce).to.be.true;

            spy.restore();
        });
    });

    describe('#convertNumber', function () {
        it('should throw an exception on invalid input', function () {
            expect(Utils.convertNumber).to.throw(Error);
        });

        it('should throw an exception when conversion character is unsupported', function () {
            try {
                Utils.convertNumber('10T');
            } catch (e) {
                expect(e).to.be.an.instanceof(Error);
                expect(e.message).to.equal('Invalid number');
            }
        });

        it('should not change 100', function () {
            expect(Utils.convertNumber('100')).to.equal(100);
        });

        it('should convert 10K to 10000', function () {
            expect(Utils.convertNumber('10K')).to.equal(10000);
        });

        it('should convert 10M to 10000000', function () {
            expect(Utils.convertNumber('10M')).to.equal(10000000);
        });

        it('should convert 0.8B to 800000000', function () {
            expect(Utils.convertNumber('0.8B')).to.equal(800000000);
        });

        it('should return return an integer given a float', function () {
            expect(Utils.convertNumber(3.14)).to.equal(3);
        });

        it('should round up when too many decimals are added', function () {
            expect(Utils.convertNumber('0.1234567890K')).to.equal(124);
        });

        it('should throw an exception given zero', function () {
            try {
                Utils.convertNumber(0);
            } catch (e) {
                expect(e).to.be.an.instanceof(Error);
            }
        });

        it('should throw an exception given a negative number', function () {
            try {
                Utils.convertNumber(-1);
            } catch (e) {
                expect(e).to.be.an.instanceof(Error);
            }
        });
    });

    describe('#generate', function () {
        it('should call generate without an exception', function (done) {
            mock();

            const generate = Utils.generate('foo.csv', ['name'], {
                rows: 1,
                chunks: 1,
                silent: true
            }).then(function () {
                expect(generate).to.not.throw;
                mock.restore();
                done();
            });
        });
    });
});
