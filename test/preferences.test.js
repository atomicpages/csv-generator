/* eslint-disable dot-notation, no-invalid-this */

'use strict';

const fs = require('fs');
const expect = require('chai').expect;
const mock = require('mock-fs');
const Preferences = require('../lib/preferences');

describe('testing preferences class', function () {
    describe('#isInteractive', function () {
        it('should be undefined', function () {
            expect(Preferences.isInteractive()).to.be.false;
        });

        it('should be false', function () {
            Preferences._preferences = { interactive: false };
            expect(Preferences.isInteractive()).to.be.false;
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
            config[Preferences.file()] = '{"foo": true}';
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

        it('should read preferences written to disk', function () {
            Preferences._preferences = null; // mock-fs is persisting options after it blocks; fake it
            Preferences.save('bar', true);

            fs.readFile(Preferences.file(), (err, data) => {
                expect(data).to.deep.equal({
                    foo: true,
                    bar: true
                });
            });
        });

        it('should save when no options are saved on disk', function () {
            Preferences.truncate(() => {
                Preferences._preferences = null;
                Preferences.save('bar', true);

                fs.readFile(Preferences.file(), (err, data) => {
                    expect(data).to.deep.equal({ bar: true });
                });
            }, () => {
                expect.fail('An error occurred truncating persisted settings. Unable to test properly.');
            });
        });
    });

    describe('#truncate', function () {
        describe('#truncate with mock-fs', function () {
            beforeEach(function () {
                const config = {};
                config[Preferences.file()] = '';
                mock(config);
            });

            afterEach(function () {
                mock.restore();
            });

            it('should remove all saved options', function () {
                Preferences.save('always-use-headers', true);
                Preferences.truncate();

                fs.readFile(Preferences.file(), (err, data) => {
                    expect(err).to.not.be.null;
                    expect(err).to.not.be.undefined;
                    expect(err).to.have.own.property('code');
                    expect(err).to.have.own.property('code', 'ENOENT');
                    expect(data).to.be.undefined;
                });
            });

            it('should execute success callback after unlinking file', function () {
                let spy = this.sinon.spy(console, 'log');

                Preferences.save('always-use-headers', true);
                Preferences.truncate(() => console.log('foo'));

                expect(console.log.calledOnce).to.be.true;
                // spy.should.have.been.calledWithMatch('foo');

                spy.restore();
            });
        });

        it('should execute error callback when settings file is not defined', function () {
            let spy = this.sinon.spy(console, 'log');

            Preferences.truncate(null, () => {
                console.log('foo');
            });

            expect(console.log.calledOnce).to.be.true;

            spy.restore();
        });

        it('should not throw if no callback is defined', function () {
            expect(Preferences.truncate).to.not.throw();
        });
    });
});
