const path = require('path');

module.exports = {
    entry: './src/client/main.ts',
    mode: 'production',
    devtool: 'source-map',
    output: {
        path: path.resolve(__dirname, 'public/dist'),
        filename: 'bundle.js'
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ]
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: { loader: 'ts-loader' },
                exclude: /node_modules/
            },
            {
                enforce: 'pre',
                test: /\.js$/,
                loader: 'source-map-loader'
            }
        ]
    }
};
