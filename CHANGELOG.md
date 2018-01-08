### 1.0.4
* Dropping support for Node 4

### 1.0.3
* Bumping version for NPM

### 1.0.2
* Fixing clerical error in README
* Bumping node module versions
* Adding API docs
* Removing e2e tests since they're not complete
* Removing `asyncawait` plugin
* Disabling `dot-location` rule in ESLint
* Setting `ecmaVersion` to 2017 in ESLint
* using real `async/await` in `utils.js` now
* Exposing API publicly

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

### 1.0.1
* ~~Adding e2e tests~~
* Adding localizations
* Adding linting to travis build
* Fixing fatal exception when output file is missing for CLI interface
    * `gencsv -r 10K < columns.txt` displays a proper console error instead of a stacktrace
* Adding TONS of new benchmarks
    * `time` logs
    * `dtrace`
    * and spreadsheets with other cool stuff...
* Merging PR #1
	* Adding GUID
	* Removing float restrictions

### 1.0.0
* Initial Release
