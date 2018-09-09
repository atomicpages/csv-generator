CSV Generator
=============

[![Build Status](https://travis-ci.org/atomicpages/csv-generator.svg?branch=master)](https://travis-ci.org/atomicpages/csv-generator) [![Coverage Status](https://coveralls.io/repos/github/atomicpages/csv-generator/badge.svg?branch=master)](https://coveralls.io/github/atomicpages/csv-generator?branch=master) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

A simple-to-use script for generating CSV files with hundreds of columns and billions of rows.

### Installation
To install globally:

```bash
npm i -g csv-generator # or yarn
yarn global add csv-generator
```

Since the command is on our global path, we can execute via:

```bash
gencsv --help
```

you can also install locally:

```bash
npm i csv-generator
yarn add csv-generator
```

we can run locally:

```bash
./node_modules/.bin/gencsv --help
```

You can set a soft link to your project root also:

```bash
ln -s gencsv ./node_modules/.bin/gencsv
./gencsv --help
```

### Usage
You can use this script in three ways:

* Interactive CLI Interface
* CLI Interface
* API (used for embedding in your other scripts/modules)

#### Interactive Interface
The interactive interface is a series of questions and answers. This interface is not the default interface for this tool, but we can launch it via:

```bash
gencsv --interactive # or
gencsv -i
```

if you want always use the interactive interface, you can save this preference:

```bash
gencsv --always-interactive # or
gencsv -a
```

Don't need this interface anymore? No problem:

```bash
gencsv --clear-settings # or
gencsv -c
```

You can also run the script after clearing the settings if you wish:

```bash
gencsv -c foo.csv < columns.txt
```

#### CLI Interface
Resembling other commands like `ls`, this is the default feel:

```bash
gencsv [options] <file> [columns..]
gencsv [options] <file> < columns.txt

Commands:
  <file>  The output file name

Options:
  --chunk                   The number of rows to generate per pass
                                                        [number] [default: 1000]
  --functions, --func       Lists available functions
  --rows, -r                The number of rows to generate (e.g. 100, 100000,
                            100k, 1M, 1B, etc.)                   [default: 100]
  --use-headers, -h         Use this flag to set column headers
                                                      [boolean] [default: false]
  --interactive, -i         Run the script in interactive mode with a series of
                            questions and user-provided answers
  --always-interactive, -a  Start the script in interactive mode and save this
                            setting
  --always-use-headers      Use this flag to persist column headers preferences
  --clear-settings, -c      Clear always-interactive settings
  --silent, -s              Minimal console output    [boolean] [default: false]
  --help                    Show help                                  [boolean]
  --version                 Show version number                        [boolean]
```

We can define our tables two ways:

1. Manual entry

    When issuing the command, be sure to separate functions by **space** &mdash; other delimiters are not supported with this method of entry.

    ```bash
    gencsv foo.csv 'name email ccnumber date(2) pick(a|b)' # quote the argument to avoid escaping
    gencsv foo.csv name email ccnumber date\(2\) pick\(a\|b\) # or escape special BASH characters
    ```

    This will generate a `.csv` file in our current working directory with five columns and 100 rows.

    Need more rows? Need a lot of rows? No problem.

    ```bash
    gencsv foo.csv -r 100K 'name email ccnumber date(2) pick(AWS|Azure|Google Cloud|Digital Ocean)' # or
    gencsv foo.csv -r 100000 'name email ccnumber date(2) pick(AWS|Azure|Google Cloud|Digital Ocean)'
    ```

    Same table, but this time with 100,000 rows!

    Need even more? This script provides additional aliases:

    * `K` += 10^3 (e.g. 80K)
    * `M` += 10^6 (e.g. 0.2M)
    * `B` += 10^9 (e.g 2.13B)

    Want to interpolate BASH variables? Use double quotes:

    ```bash
    gencsv foo.csv "name email ccnumber date(2) pick($USER|b)"
    ```

2. Columns definition as plain text

    For wide tables, we can define our column definitions in a separate file:

    ```bash
    gencsv foo.csv < columns.txt
    ```

    where `columns.txt` contains:

    ```
    name, email, ccnumber, birthday, date, ...
    ```

    We can define column headers in `columns.txt` as well:

    ```
    Name, Email Address, Credit Card Number, Birthday, Transaction Date, ...
    name, email, ccnumber, birthday, date, ...
    ```

#### API Interface
What's that? An API? Yes. As of 1.0.2 you can `require` `csv-generator` in your node app:

```js
const gencsv = require('csv-generator');

gencsv('foo.csv', ['name'], {
    rows: 100,
    chunks: 10,
    silent: true
}).then(
    res => {
        console.log(res);
    },
    e => {
        console.error(e);
    }
);
```

### Performance Notes
By nature, some functions are considerably slower than others, for example:

| Function | Time to Write 10K Rows by 100 Columns |
| :---: | :---: |
| `string` | 9.481s |
| `string(8)` | 6.305s |
| `alpha` | 6.138s |
| `alpha(8)` | 4.061s |
| `sentence` | 40.378s |

by contrast, these functions are much faster:

| Function | Time to Write 10K Rows by 100 Columns |
| :---: | :---: |
| `guid` | 1.264s |
| `age` | 0.72s |
| `integer` | 0.684s |
| `zip` | 2.579 |
| `yn` | 0.706s |

If you need to generate large amounts of data for _wide_ tables it is recommended to use fast functions.

#### More Notes
Instead of hundreds of async file writes (i.e. page faults), this generator uses a single stream to write content to the file. The trade-off is normal heap space, less CPU involvement, but more virtual memory used &mdash; memory is cheap; transistors aren't.

### Developers
Want to add a feature? Have a useful generator? Need to debug? The `readline` interface makes for cumbersome debugging, but node has our back:

```bash
node --inspect-brk index.js
```

or if you need to debug the CLI interface:

```bash
node --inspect-brk bin/gencsv foo.csv < columns.txt
```

open up Google Chrome and navigate to:

```
chrome://inspect
```

### Running Tests
To run unit tests:

```bash
npm run coverage # or
yarn coverage
```
