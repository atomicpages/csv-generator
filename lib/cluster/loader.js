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

// const calculateWorkers = (columns, { rows }) => {

// };

/**
 * Loads all required processes for cluster mode or simply calls
 * the generate function when in single node mode.
 *
 * In cluster mode, there are three categories of data:
 * 1. Small data <= 50K rows
 * @param {object} argv The raw object `yargs` generates.
 * @param {string} outFile The name of the output file.
 * @param {string[]} columns The column definitions.
 * @param {object} generateConfig The config object passed to the generator function.
 */
module.exports = function (argv, outFile, columns, generateConfig) {
    const parts = new Map();
    const { cores } = argv;
    const useCluster = argv.cluster;

    if (useCluster && cores > 1 && generateConfig.rows >= 10000) {
        console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] Process ${process.pid} started`);

        if (generateConfig.rows >= 10000) {
            generateConfig.rows /= cores;
            generateConfig.rows = Math.round(generateConfig.rows);
        }

        cluster.setupMaster({
            exec: path.join(__dirname, 'worker.js'),
            args: [
                columns, // give only the column definitions
                JSON.stringify(generateConfig)
            ]
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
        const stream = fs.createWriteStream(outFile);

        require('../generator')(stream, columns, generateConfig).then(() => {
            stream.end();
        });
    }
};
