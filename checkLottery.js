const configDate = require('./config/config.json');
const utils = require('./utils');
const chalk = require('chalk');

function main(){
    // console.log(chalk.red("Hello Test"));

    const objJSON = utils.findLotteryFile("1_10_2564");
    console.log(objJSON);
}

main();
