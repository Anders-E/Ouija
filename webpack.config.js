const path = require('path');

module.exports = {
    entry: './src/client/main.mjs',
    output: {
        path: path.resolve(__dirname, 'src/client'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.mjs$/,
                type: 'javascript/auto'
            }
        ]
    },
    watch: true
};
