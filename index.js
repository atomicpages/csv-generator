if (require.main === module) {
    require('./interactive')();
} else {
    module.exports = require('./lib/generator');
}
