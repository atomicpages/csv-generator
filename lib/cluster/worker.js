const worker = function () {
    const moment = require('moment');
    const Utils = require('../utils');

    console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] Worker ${process.pid} started`);
    const argv = JSON.parse(process.argv[2]);
    const generateConfig = JSON.parse(process.argv[3]);
    const headers = process.argv.length > 4 ? JSON.parse(process.argv[4]) : null;

    const { id } = process.env;
    const { _ } = argv;

    Utils.generate(id, _[1], generateConfig, headers, `${require('os').tmpdir()}/csv`).then(
        () => {
            process.exit(0);
        },
        e => {
            console.error(e);
            process.exit(1);
        }
    );
};

if (require.main === module) {
    worker();
} else {
    module.exports = worker;
}
