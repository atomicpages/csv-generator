const fs = require('fs');
const path = require('path');

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

    isInteractive: function () {
        try {
            let content = fs.readFileSync(path.resolve(this.home(), '.gencsv'));

            if (content) {
                let json;

                try {
                    json = JSON.parse(content);
                } catch (e) {
                    return false;
                }

                return json.interactive;
            }
        } catch (e) {
            // do nothing...
        }

        return false;
    }
};
