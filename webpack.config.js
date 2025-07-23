const path = require('path');

module.exports = {
  entry: './src/frontend/js/main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'src/frontend/dist'),
  },
  mode: 'development'
};
