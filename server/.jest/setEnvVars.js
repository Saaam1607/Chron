const path = require('path');
const dotenvPath = path.resolve(__dirname, '../env/local.env');

console.log(path.resolve(__dirname, '../env/local.env'));
require('dotenv').config({ path: dotenvPath });