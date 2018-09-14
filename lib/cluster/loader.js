const fs = require('fs');
const path = require('path');
const cluster = require('cluster');
const uuid = require('uuid/v4');
const moment = require('moment');

const TEMP_DIR = require('os').tmpdir();

/**
 *
 * @param {string[]} files A list of files to search for.
 * @param {string} out The path to the output target.
 */
const concat = (files, out) => {
    files.forEach(file => {
        if (fs.existsSync(file)) {
            try {
                fs.appendFileSync(out, fs.readFileSync(file, 'utf8'));
                fs.unlinkSync(file);
            } catch (e) {
                console.error(e);
            }
        }
    });
};

module.exports = function (argv, outFile, columns, generateConfig, headers) {
    const parts = new Map();
    const { cores } = argv;
    const useCluster = argv.cluster;

    if (useCluster && cores > 1 && generateConfig.rows >= 10000) {
        console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] Process ${process.pid} started`);

        if (generateConfig.rows >= 10000) {
            generateConfig.rows /= cores;
        }

        const args = [
            JSON.stringify(argv),
            JSON.stringify(generateConfig)
        ];

        if (headers) {
            args.push(JSON.stringify(headers));
        }

        cluster.setupMaster({
            exec: path.join(__dirname, 'worker.js'),
            args: args
        });

        for (let i = 0; i < cores; i++) {
            const id = uuid();

            const worker = cluster.fork({
                id: id,
                worker: i
            });

            parts.set(worker.process.pid, id);
        }

        cluster.on('exit', (worker, code) => {
            if (code !== 0) {
                // TODO: restart process...
            }

            if (Object.keys(cluster.workers).length === 0) {
                console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] All child processes has stopped. Terminating master process...`);

                const fragments = Array.from(parts.values());
                concat(fragments.map(file => path.join(TEMP_DIR, 'csv', file)), outFile);
                process.exit(0);
            }

            console.log(`Worker with PID ${worker.process.pid} has finished the job`);
        });
    } else {
        require('../utils').generate(outFile, columns, generateConfig, headers);
    }
};
