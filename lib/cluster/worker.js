(function () {
    'use strict';

    const fs = require('fs');
    const moment = require('moment');
    const csvgen = require('../generator');

    console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] Worker ${process.pid} started`);
    const columns = process.argv[2];
    const generateConfig = JSON.parse(process.argv[3]);

    const { id } = process.env;

    const stream = fs.createWriteStream(`${require('os').tmpdir()}/csv/${id}`);

    stream.on('finish', () => {
        process.exit(0);
    });

    csvgen(stream, columns, generateConfig).then(() => {
        stream.end();
    }, e => {
        console.error(e);
        process.exit(1);
    });
})();
