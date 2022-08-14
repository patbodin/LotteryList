const configDate = require('./config/config.json');
const utils = require('./utils');
const chalk = require('chalk');
const Enumberable = require('linq');

function main(){
    // console.log(chalk.red("Hello Test"));

    const objJSON = utils.findLotteryFile("1_10_2564");
    // const test = objJSON.filter(x => x.two_suffix[0] == 83);
    // console.log(objJSON);
    // Enumberable.from(objJSON).where(x => x == "83").select(x => x).log().toJoinedString();

    const aaa = RegExp(/83/g);

    for (const key in objJSON) {
        // console.log('key: ' + key);
        // console.log('value: ' + objJSON[key] + ' --- ' + objJSON[key].length);
        if(key != "name") {
            // console.log('value: ' + objJSON[key] + ' --- ' + objJSON[key].length);
            // var xx = Enumberable.from(objJSON[key]).where(x => x == "83").select(x => x).toJSONString();
            var xx = Enumberable.from(objJSON[key]).where(x => x.match(aaa)).select(x => x).toJSONString();
            console.log(xx);
        }
    }
    // console.log("test => " + objJSON['secondAward']);

    const bbb = /abcd/g;
    console.log('====> ' + bbb.source.replace("abcd", "\d\d\d89"));
}

main();
