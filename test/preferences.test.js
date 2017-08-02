/* eslint-disable dot-notation, no-invalid-this */

const fs = require('fs');
const expect = require('chai').expect;
const mock = require('mock-fs');
const Preferences = require('../lib/preferences');

describe('testing preferences class', function () {
    describe('#isInteractive', function () {
        it('should be undefined', function () {
            expect(Preferences.isInteractive()).to.be.false;
        });
    });

    describe('#alwaysUseHeaders', function () {
        it('should be udnefined', function () {
            expect(Preferences.alwaysUseHeaders()).to.be.false;
        });
    });

    describe('#file', function () {
        it('should end with .gencsv', function () {
            expect(Preferences.file()).to.have.string('.gencsv');
        });
    });

    describe('#save', function () {
        beforeEach(function () {
            const config = {};
            config[Preferences.file()] = '';

            mock(config);
        });

        afterEach(function () {
            mock.restore();
        });

        it('should write preferences to config file', function () {
            Preferences.save('always-use-headers', true);

            fs.readFile(Preferences.file(), (err, data) => {
                expect(String(data)).to.have.string('always-use-headers');
            });
        });

        it('should print a message to the console after saving', function () {
            let spy = this.sinon.spy(console, 'log');

            Preferences.save('always-use-headers', true, () => {
                console.log('Settings written');

                expect(console.log.calledOnce).to.be.true;
                spy.restore();
            });
        });
    });
});
