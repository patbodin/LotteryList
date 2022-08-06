const configDate = require('./config/config.json');
const utils = require('./utils');
const chalk = require('chalk');

 function main(){

    const readPath = "C:/test/data/";
    const writePath = "C:/test/result/";
    const fileName = "result.xlsx"
    // const fileExt = ".json";

    // console.log(chalk.rgb(55,77,99).underline("Hello, ") + chalk.hex('#75a549')("Welcome to excel generator!"));

    utils.createExcelFile(readPath, writePath, fileName);
}

main();