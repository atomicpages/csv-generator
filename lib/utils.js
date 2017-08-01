const fs = require('fs');
const path = require('path');
const Table = require('cli-table');

module.exports = {
    getCurrentDirectoryBase: function () {
        return path.basename(process.cwd());
    },

    directoryExists: function (filePath) {
        try {
            return fs.statSync(filePath).isDirectory();
        } catch (err) {
            return false;
        }
    },

    home: function () {
        return process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];
    },

    functions: function (source, returns) {
        let table = new Table({
            head: ['Name', 'Description'],
            colWidths: [50, 150]
        });

        for (let key in source) {
            if (source.hasOwnProperty(key)) {
                if (typeof source[key] === 'string') {
                    table.push([key, source[key]]);
                } else if (typeof source[key] === 'object') {
                    table.push([key, source[key].desc]);

                    for (let k in source[key].variations) {
                        table.push([k, source[key].variations[k]]);
                    }
                }
            }
        }

        if (returns) {
            return table.toString();
        } else {
            console.log(table.toString());
        }
    },

    isInteractive: function () {
        return this._readPreferences('interactive');
    },

    alwaysUseHeaders: function () {
        return this._readPreferences('always-use-headers');
    },

    _readPreferences: function (key) {
        try {
            let content = fs.readFileSync(path.resolve(this.home(), '.gencsv'));

            if (content) {
                let json;

                try {
                    json = JSON.parse(content);
                } catch (e) {
                    return false;
                }

                return json[key];
            }
        } catch (e) {
            // do nothing...
        }

        return false;
    }
};
