const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    mode: 'development', // Use 'production' for production builds
    entry: './src/index.js', // Entry point for your app
    output: {
        path: path.resolve(__dirname, 'dist'), // Output directory
        filename: 'bundle.js', // Output file name
        clean: true, // Clean the output directory before each build
    },
    devServer: {
        static: './dist', // Serve files from the 'dist' directory
        port: 3000, // Development server port
        open: true, // Automatically open the browser
        hot: true, // Enable hot module replacement
        historyApiFallback: true, // Ensure proper routing for React apps
        setupMiddlewares: (middlewares, devServer) => {
            devServer.app.use((req, res, next) => {
                try {
                    decodeURIComponent(req.url); // Decode the URI to catch malformed ones
                    next();
                } catch (e) {
                    res.status(400).send('Bad Request: Malformed URI');
                }
            });
            return middlewares;
        },
    },
    module: {
        rules: [
            {
                test: /\.js$/, // Process JavaScript files
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader', // Transpile JavaScript using Babel
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'], // Support modern JS and React
                    },
                },
            },
            {
                test: /\.scss$/, // Process SCSS files
                use: [
                    'style-loader', // Inject CSS into the DOM
                    'css-loader', // Resolve CSS imports
                    'sass-loader', // Compile SCSS to CSS
                ],
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/, // Process image files
                type: 'asset/resource', // Copy images to the output directory
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html', // Use your existing HTML file
            // favicon: './public/favicon.ico', // Optional: Add a favicon
        }),
        new webpack.DefinePlugin({
            'process.env': JSON.stringify(process.env), // Inject environment variables
        }),
    ],
    resolve: {
        extensions: ['.js', '.jsx'], // Resolve these extensions
    },
};