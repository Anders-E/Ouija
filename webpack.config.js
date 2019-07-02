const path = require('path');

module.exports = {
    entry: './src/client/main.ts',
    output: {
        path: path.resolve(__dirname, 'src/client'),
        filename: 'bundle.js'
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },    
    watch: true
};
