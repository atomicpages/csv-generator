const fs = require('fs');
const path = require('path');
const Utils = require('./utils');

module.exports = {

    _preferences: null,
    _file: path.join(Utils.home(), '.gencsv'),

    /**
     * @return {boolean} True if the `interactive` key is set in the user preferences file.
     */
    isInteractive: function () {
        return this._readPreferences('interactive');
    },

    /**
     * @return {boolean} True if the `always-use-headers` key is set in the user preferences file.
     */
    alwaysUseHeaders: function () {
        return this._readPreferences('always-use-headers');
    },

    /**
     * Saves a key and value pair to the preferences file.
     * @param key {string} The key to save.
     * @param value {*} The JSON-encodable value to set.
     * @param [cb] {function} The callback to execute after the file is written.
     */
    save: function (key, value, cb) {
        if (!this._preferences) {
            this._preferences = this._loadPreferences();
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
     * @param [cb] {function} The callback to execute is unlinking is successful.
     * @param [errorCallback] {function} The callback to execute in the event of an error.
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

    file: function () {
        return this._file;
    },

    _loadPreferences: function () {
        let json = {};

        try {
            try {
                json = JSON.parse(fs.readFileSync(this._file));
            } catch (e) {
                // do nothing...
            }
        } catch (e) {
            // do nothing...
        }

        return json;
    },

    /**
     * Attempts to read user preferences and fetch data.
     * Cached in memory the first time we read the preferences.
     * @return {boolean} False if no preferences file exists, otherwise the value of the key.
     * @private
     */
    _readPreferences: function (key) {
        if (!this._preferences) {
            this._preferences = this._loadPreferences();
        }

        return this._preferences && this._preferences.hasOwnProperty(key) && this._preferences[key];
    }

};
