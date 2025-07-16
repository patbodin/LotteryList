const configDate = require('./config/config.json');
const utils = require('./utils');
const chalk = require('chalk');
const Enumerable = require('linq');

function main(){
    // console.log(chalk.red("Hello Test"));
    const myArgs = process.argv.slice(2);
    console.log(chalk.green('myArgs: ', myArgs));

    if (myArgs.length == 0) {
        // const objJSON = utils.findLotteryFile("1_10_2564");
        // console.log(objJSON);
        console.log(chalk.hex("#e3d37d")("Please input args!!!"));
    }
    else if (myArgs.length == 1) {
        if(!utils.validateInputNumber(myArgs[0])) {
            console.log(chalk.hex("#a7327c")("Invalid args!!!"));
            process.exit(1);
        }

        //-- Under construction
        
        // const objJSON = utils.findLotteryFile("1_10_2564");
        // console.log(objJSON);
        console.log(chalk.hex("#b3d5fb")("Searching that number in all files..."));
    }
    else if (myArgs.length == 2) {
        if(!utils.validateInputNumber(myArgs[0]) || !utils.validateFileName(myArgs[1])) {
            console.log(chalk.hex("#a7327c")("Invalid args!!!"));
            process.exit(1);
        }

        // const objJSON = utils.findLotteryFile("1_10_2564");
        const objJSON = utils.findLotteryFile(myArgs[1]);

        utils.findNumberInLottery(objJSON, myArgs[0]);

        utils.findCloseNumberInLottery(objJSON, myArgs[0]);
        
    }
    else {
        console.log(chalk.hex("#a7327c")("Invalid args!!!"));
    }

    
}

main();
