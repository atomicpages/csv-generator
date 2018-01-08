'use strict';

const fs = require('fs');
const path = require('path');
const Utils = require('./utils');

/**
 * A thin OS wrapper that writes user preferences to a file.
 * @module lib/preferences
 * @author Dennis Thompson <atomicpages@gmail.com>
 * @version 1.0.0
 */
module.exports = {

    _preferences: null,
    _file: path.join(Utils.home(), '.gencsv'),

    /**
     * @return {boolean} True if the `interactive` key is set in the user preferences file.
     */
    isInteractive: function () {
        return this.readPreferences('interactive');
    },

    /**
     * @return {boolean} True if the `always-use-headers` key is set in the user preferences file.
     */
    alwaysUseHeaders: function () {
        return this.readPreferences('always-use-headers');
    },

    /**
     * Saves a key and value pair to the preferences file.
     * @param {string} key The key to save.
     * @param {*} value The JSON-encodable value to set.
     * @param {function} [cb] The callback to execute after the file is written.
     * @async
     */
    save: function (key, value, cb) {
        if (!this._preferences) {
            this._preferences = this.loadPreferences();
        }

        this._preferences[key] = value;

        fs.writeFile(this._file, JSON.stringify(this._preferences), err => {
            if (err) {
                console.error('Unable to save preferences');
                console.error(err);
            }

            if (cb && typeof cb === 'function') {
                cb();
            }
        });
    },

    /**
     * Truncates user preferences.
     * @param {function} [cb] The callback to execute is unlinking is successful.
     * @param {function} [errorCallback] The callback to execute in the event of an error.
     * @async
     */
    truncate: function (cb, errorCallback) {
        try {
            fs.unlinkSync(this._file);

            if (cb && typeof cb === 'function') {
                cb();
            }
        } catch (e) {
            if (errorCallback && typeof errorCallback === 'function') {
                errorCallback();
            }
        }
    },

    /**
     * @return {string} The absolute path to the preferences file.
     */
    file: function () {
        return this._file;
    },

    /**
     * Loads preferences into memory synchronously.
     * @return {object} Will return an object object if we're unable to load contents from
     * the file system.
     */
    loadPreferences: function () {
        let json = {};

        try {
            json = JSON.parse(fs.readFileSync(this._file));
        } catch (e) {
            // do nothing...
        }

        return json;
    },

    /**
     * Attempts to read user preferences and fetch data.
     * Cached in memory the first time we read the preferences.
     * @param {string} key The key to search for in the preferences file.
     * @return {boolean} False if no preferences file exists, otherwise the value of the key.
     */
    readPreferences: function (key) {
        if (!this._preferences) {
            this._preferences = this.loadPreferences();
        }

        return this._preferences && this._preferences.hasOwnProperty(key) && this._preferences[key];
    }

};
