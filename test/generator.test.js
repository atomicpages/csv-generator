/* eslint-disable dot-notation, no-invalid-this */

'use strict';

const fs = require('fs');
const expect = require('chai').expect;
const mock = require('mock-fs');
const generator = require('../lib/generator');
require('mocha-sinon');

const name = 'foo.csv';
const columns = ['first', 'last'];
const options = {
    rows: 1,
    chunks: 1,
    silent: true
};

describe('testing generator', function () {
    describe('#generator', function () {
        beforeEach(function () {
            mock();
        });

        afterEach(function () {
            mock.restore();
        });

        it('should throw an error when no name is provided', function () {
            try {
                generator('', columns, null);
            } catch (e) {
                expect(e).to.be.an.instanceof(Error);
                expect(e.message).to.equal('File name is required');
            }
        });

        it('should throw an error when columns is not an array', function () {
            try {
                generator(name, 2, null);
            } catch (e) {
                expect(e).to.be.an.instanceof(Error);
                expect(e.message).to.equal('columns is expected to be an array of string');
            }
        });

        it('should throw an error when columns an empty array', function () {
            try {
                generator(name, [], null);
            } catch (e) {
                expect(e).to.be.an.instanceof(Error);
                expect(e.message).to.equal('columns must contain at least one entry');
            }
        });

        it('should throw an error when options is not a plain object', function () {
            try {
                generator(name, columns, null);
            } catch (e) {
                expect(e).to.be.an.instanceof(Error);
                expect(e.message).to.equal('options must be a plain object');
            }
        });

        it('should fail with an exception when given a bad row count', function () {
            try {
                generator(name, columns, {
                    silent: true,
                    rows: -1
                });
            } catch (e) {
                expect(e).to.be.an.instanceof(Error);
                expect(e.message).to.equal('options.rows must be a positive integer');
            }
        });

        it('should fail with an exception when given a bad chunk count', function () {
            try {
                generator(name, columns, {
                    silent: true,
                    chunks: -1
                });
            } catch (e) {
                expect(e).to.be.an.instanceof(Error);
                expect(e.message).to.equal('options.chunks must be a positive integer');
            }
        });

        it('should generate a file', function (done) {
            generator(name, columns, options).then(function () {
                fs.readFile('foo.csv', (err, data) => {
                    expect(err).to.be.null;
                    expect(data).to.not.be.empty;
                    expect(data.toString()).to.match(/\w+,\w+/);

                    done();
                });
            });
        });

        it('should unlink or truncate file if it exists', function (done) {
            fs.writeFileSync('foo.csv', '');

            generator(name, columns, options).then(function () {
                fs.readFile('foo.csv', (err, data) => {
                    expect(data.toString().split(/\r\n|\r|\n/g).length).to.equal(2);
                    done();
                });
            });
        });

        it('should add default headers when option is set', function (done) {
            generator(name, columns, {
                silent: true,
                rows: 1,
                chunks: 1,
                headers: true
            }).then(function () {
                fs.readFile('foo.csv', (err, data) => {
                    let content = data.toString().split(/\r\n|\r|\n/g);
                    expect(content[0]).to.have.string('Column1,Column2');
                    expect(content.length).to.equal(3);
                    done();
                });
            });
        });

        it('should add user-defined headers', function (done) {
            generator(name, columns, {
                silent: true,
                rows: 1,
                chunks: 1,
                headers: true
            }, ['First Name', 'Last Name']).then(function () {
                fs.readFile('foo.csv', (err, data) => {
                    let content = data.toString().split(/\r\n|\r|\n/g);
                    expect(content[0]).to.have.string('First Name,Last Name');
                    expect(content.length).to.equal(3);
                    done();
                });
            });
        });

        it('should pad default headers when user-defined headers are not equal to column length', function (done) {
            generator(name, columns, {
                silent: true,
                rows: 1,
                chunks: 1,
                headers: true
            }, ['First Name']).then(function () {
                fs.readFile('foo.csv', (err, data) => {
                    let content = data.toString().split(/\r\n|\r|\n/g);
                    expect(content[0]).to.have.string('First Name,Column1');
                    expect(content.length).to.equal(3);
                    done();
                });
            });
        });

        it('should print a progress report as stream is written to', function (done) {
            let spy = this.sinon.spy(console, 'log');

            generator(name, columns, {
                rows: 2,
                chunks: 1
            }).then(function () {
                expect(console.log.calledThrice).to.be.true; // +1 for stream.on('end')
                spy.restore();
                done();
            });
        });

        it('should default size = rows when chunks > rows', function (done) {
            let spy = this.sinon.spy(console, 'log');

            generator(name, columns, {
                rows: 2,
                chunks: 10
            }).then(function () {
                expect(console.log.calledTwice).to.be.true;
                spy.restore();
                done();
            });
        });
    });
});
