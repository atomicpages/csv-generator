(function () {
    'use strict';

    const os = require('os');
    const chalk = require('chalk');
    const i18n = require('i18n');
    const path = require('path');

    const clusterLoader = require('../lib/cluster/loader');
    const Utils = require('../lib/utils');
    const Preferences = require('../lib/preferences');

    i18n.configure({
        locales: ['en'],
        directory: path.resolve(`${__dirname}/../locales`)
    });

    const yargs = require('yargs');
    const argv = yargs
        .command('<file>', i18n.__('The output file name'))
        .usage('$0 [options] <file> [columns..]\n$0 [options] <file> < columns.txt')
        .options({
            'always-interactive': {
                alias: 'a',
                describe: i18n.__('Start the script in interactive mode and save this setting'),
                conflicts: 'clear-settings'
            },
            chunk: {
                describe: i18n.__('The number of rows to generate per pass'),
                number: true,
                default: 1000
            },
            'clear-settings': {
                alias: 'c',
                describe: i18n.__('Clear always-interactive settings')
            },
            cluster: {
                describe: i18n.__('Enable cluster mode'),
                boolean: true,
                default: false
            },
            cores: {
                describe: i18n.__('The number of cores to use', { cores: os.cpus().length }),
                number: true,
                implies: 'cluster'
            },
            functions: {
                alias: 'func',
                describe: i18n.__('Lists available functions')
            },
            interactive: {
                alias: 'i',
                describe: i18n.__('Run the script in interactive mode with a series of questions and user-provided answers'),
                conflicts: 'clear-settings'
            },
            partition: {
                describe: i18n.__('Manually set the partition size if you know what works for your OS'),
                string: true,
                default: '16K' // https://nodejs.org/dist/latest-v8.x/docs/api/stream.html#stream_constructor_new_stream_writable_options
            },
            rows: {
                alias: 'r',
                describe: i18n.__('The number of rows to generate (e.g. 100, 100000, 100k, 1M, 1B, etc.)'),
                default: 100
            },
            silent: {
                alias: 's',
                describe: i18n.__('Minimal console output'),
                boolean: true,
                default: false
            }
        })
        .help()
        .version(require('../package.json').version)
        .argv;

    const showHelp = message => {
        console.log(`${chalk.redBright(`${message}`)}\n${i18n.__('Usage')}:`);
        yargs.showHelp();
        process.exit(1);
    };

    // handle implication logic
    if (argv.cluster && !argv.cores) {
        argv.cores = os.cpus().length;
    }

    if (argv.functions) {
        console.log(`${i18n.__('Available functions')}:`);
        Utils.functions(require('../functions'));
        process.exit(0);
    }

    if (argv.c) {
        console.log(`${i18n.__('Removing settings')}...`);

        Preferences.truncate(
            () => {
                console.log(`${i18n.__('Successfully removed')} ${chalk.cyan(Preferences.file())}`);

                if (argv._.length <= 1) {
                    process.exit(0);
                }
            },
            () => {
                console.log(`${i18n.__('Error removing')} ${chalk.redBright(Preferences.file())}`);
                console.log(`${i18n.__('Attempting to run command')}...\n`);
            }
        );
    }

    if (Preferences.isInteractive() || argv.i) {
        require('../index');
    } else if (argv.a) {
        Preferences.save('interactive', true, () => {
            console.log(`${i18n.__('Settings written to')} ${chalk.cyan(Preferences.file())}`);
            setTimeout(() => require('../index'), 500);
        });
    } else {
        if (argv._.length <= 1 && process.stdin.isTTY) {
            console.log(chalk.redBright(`${i18n.__('You must define an output file name and at least one column definition!')}`));
            process.exit(1);
        }

        let [outFile, columns] = argv._;
        let rows = 100;

        if (!outFile) {
            showHelp(i18n.__('Output file must be defined!'));
        } else if (!/^\.?[a-zA-Z0-9.-_]+(\.\w+)?$/.test(outFile)) {
            showHelp(`${i18n.__('Output file cannot end in a special character. Did you forget to add the output file?')}\n`);
        }

        if (argv.r !== 100) {
            try {
                rows = Utils.convertNumber(argv.r.trim());
            } catch (e) {
                console.log(chalk.redBright(i18n.__('Invalid row number')));
                process.exit(1);
            }
        }

        if (!columns) {
            let data = '';

            const rl = require('readline').createInterface({
                input: process.stdin,
                output: process.stdout,
                terminal: false
            });

            rl.on('line', line => {
                data += line;
                data += '\n';
            }).on('close', () => {
                if (!argv.q) {
                    console.log(`${i18n.__('Columns definitions received! Validating')}...`);
                }

                let lines = data.split('\n');
                let headers = '';

                if (lines.length > 2) {
                    [headers, columns] = lines;
                } else {
                    [columns] = lines;
                }

                if (columns.indexOf(/\{\{\s+/) !== -1) {
                    columns = columns.replace(/\{\{\s+/g, '');
                }

                if (columns.indexOf(/\s+\}\}/) !== -1) {
                    columns = columns.replace(/\s+\}\}/g, '');
                }

                clusterLoader(argv, outFile, columns, {
                    rows: rows,
                    chunks: argv.chunk,
                    headers: headers.split(/\s*,\s*/),
                    silent: argv.silent
                });
            });
        } else {

            clusterLoader(argv, outFile, columns, {
                rows: rows,
                chunks: argv.chunk,
                headers: null,
                silent: argv.silent
            });
        }
    }
})();
