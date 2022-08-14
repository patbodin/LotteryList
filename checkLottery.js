const configDate = require('./config/config.json');
const utils = require('./utils');
const chalk = require('chalk');
const Enumberable = require('linq');

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

        // const test = objJSON.filter(x => x.two_suffix[0] == 83);
        // console.log(objJSON);
        // Enumberable.from(objJSON).where(x => x == "83").select(x => x).log().toJoinedString();

        const myRegex = /^xxx$/;

        // const aaa = RegExp(/83/, 'g');
        const objRegex = RegExp(myRegex.source.replace("xxx", myArgs[0]), 'g');

        for (const key in objJSON) {
            // console.log('key: ' + key);
            // console.log('value: ' + objJSON[key] + ' --- ' + objJSON[key].length);
            if(Array.isArray(objJSON[key])) {
                
                // console.log('value: ' + objJSON[key] + ' --- ' + objJSON[key].length);
                // var xx = Enumberable.from(objJSON[key]).where(x => x == "83").select(x => x).toJSONString();
                var arrResult = JSON.parse(Enumberable.from(objJSON[key]).where(x => x.match(objRegex)).select(x => x).toJSONString());
                
                if(arrResult.length > 0){
                    console.log('key: ' + key);
                    // console.log("array length: " + arrResult.length);
                    console.log(arrResult);
                }
                
            }
        }
        // console.log("test => " + objJSON['secondAward']);

        // const bbb = /abcd/g;
        // console.log('====> ' + bbb.source.replace("abcd", "\d\d\d89"));
    }
    else {
        console.log(chalk.hex("#a7327c")("Invalid args!!!"));
    }

    
}

main();
