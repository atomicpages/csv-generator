CSV Generator
=============

A simple-to-use script for generating CSV files with hundreds of columns and billions of rows.

### Installation
To install globally:

```bash
npm i -g gencsv # or yarn
yarn global add gencsv
```

Since the command is on our global path, we can execute via:

```bash
gencsv --help
```

you can also install locally:

```bash
npm i gencsv
yarn add gencsv
```

we can run locally:

```bash
./node_modules/.bin/gencsv --help
```

You can set a symlink to your project root also:

```bash
ln gencsv ./node_modules/.bin/gencsv
./gencsv --help
```

### Usage
You can use this script in two modes:

* Interactive CLI Interface
* CLI Interface

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
  --rows, -r                The number of rows to generate (e.g. 100, 100000,
                            100k, 1M, 1B, etc.)          [number] [default: 100]
  --interactive, -i         Run the script in interactive mode with a series of
                            questions and user-provided answers
  --always-interactive, -a  Start the script in interactive mode and save this
                            setting
  --clear-settings, -c      Clear always-interactive settings
  --help                    Show help                                  [boolean]
  --version                 Show version number                        [boolean]
```

We can define our tables two ways:

1. Manual entry

    ```bash
    gencsv foo.csv name, email, ccnumber
    ```

    This will generate a `.csv` file in our current working directory with three columns and 100 rows.
2. Columns definition as plain text

    For wide tables, we can define our column definitions in a separate file:

    ```bash
    gencsv foo.csv < columns.txt
    ```

    where `columns.txt` contains:

    ```
    name, email, ccnumber, birthday, date, ...
    ```

    We can also define row headers in `columns.txt` as well:

    ```
    Name, Email Address, Credit Card Number, Birthday, Transaction Date, ...
    name, email, ccnumber, birthday, date, ...
    ```

### Vendor Copyright Notice
This tool uses some scripts that are copyright of [Data Design Group Inc.](http://www.ddginc-usa.com/) For more information see the README file in `lib/vendor`.
