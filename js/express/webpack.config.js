const path = require('path');

module.exports = {
	target: 'node',
  entry: './react-server.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  } , module: {
    rules: [{
       
        test: /\.js$/,
         exclude: /node_modules/,

        use: {
            loader: 'babel-loader'
           
        }
    }]
  }
};